#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROFILES="$DIR/hunt-profiles.json"
LOG="$DIR/hunts/auto-hunt.log"
REMOTE_FLAG="--remote"

mkdir -p "$(dirname "$LOG")"

# ── Help ──────────────────────────────────────────────
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    echo "🎯 PintarWeb Hunt Commander"
    echo ""
    echo "Usage:"
    echo "  bash scripts/auto-hunt.sh              Interactive menu"
    echo "  bash scripts/auto-hunt.sh <profile>    Run profile by name"
    echo "  bash scripts/auto-hunt.sh --all        Run ALL profiles"
    echo "  bash scripts/auto-hunt.sh --silent     Run with minimal output"
    echo "  bash scripts/auto-hunt.sh --install-cron  Set up daily cron"
    echo "  bash scripts/auto-hunt.sh --list       List profiles and last-run"
    echo "  bash scripts/auto-hunt.sh --edit       Open profiles file in \$EDITOR"
    echo ""
    exit 0
fi

# ── Load profiles ────────────────────────────────────
if [[ ! -f "$PROFILES" ]]; then
    echo "❌ No hunt-profiles.json found at $PROFILES"
    echo "   Create one or run: bash scripts/auto-hunt.sh --edit"
    exit 1
fi

PROFILE_NAMES=()
PROFILE_LABELS=()
PROFILE_CATS=()
PROFILE_LOCS=()
PROFILE_LIMITS=()
PROFILE_SRCS=()

while IFS=$'\t' read -r name label cat loc lim src; do
    PROFILE_NAMES+=("$name")
    PROFILE_LABELS+=("$label")
    PROFILE_CATS+=("$cat")
    PROFILE_LOCS+=("$loc")
    PROFILE_LIMITS+=("$lim")
    PROFILE_SRCS+=("$src")
done < <(jq -r '.[] | [.name, .label, .category, .location, (.limit|tostring), .sources] | @tsv' "$PROFILES")

# ── Fetch last-run dates from D1 ────────────────────
fetch_last_run() {
    local cat="$1" loc="$2"
    curl -s "https://pintarweb-scraper.yusmarin.workers.dev/api/hunts" 2>/dev/null \
        | jq -r --arg cat "$cat" --arg loc "$loc" '[.[] | select(.category == $cat and .location == $loc)] | first | .created_at // "never"'
}

# ── Run a single hunt ────────────────────────────────
run_hunt() {
    local idx=$1
    local silent=${2:-false}

    local name="${PROFILE_NAMES[$idx]}"
    local label="${PROFILE_LABELS[$idx]}"
    local cat="${PROFILE_CATS[$idx]}"
    local loc="${PROFILE_LOCS[$idx]}"
    local lim="${PROFILE_LIMITS[$idx]}"
    local src="${PROFILE_SRCS[$idx]}"

    if [[ "$silent" != "true" ]]; then
        echo ""
        echo "═══════════════════════════════════════════════"
        echo "  🎯 $label"
        echo "═══════════════════════════════════════════════"
    fi

    local ts
    ts=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$ts] Starting hunt: $label" >> "$LOG"

    npx tsx src/index.ts \
        --category "$cat" \
        --location "$loc" \
        --limit "$lim" \
        --sources "$src" \
        $REMOTE_FLAG 2>&1 | tee -a "$LOG"

    echo "[$ts] Finished hunt: $label" >> "$LOG"
    echo "" >> "$LOG"
}

# ── Install cron ──────────────────────────────────────
install_cron() {
    local SCRIPT_DIR
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    local CRON_LINE="0 6 * * 1-5 cd $(dirname "$SCRIPT_DIR") && bash $SCRIPT_DIR/auto-hunt.sh --all --silent >> $LOG 2>&1"

    if crontab -l 2>/dev/null | grep -q "auto-hunt.sh"; then
        echo "⚠️  Auto-hunt cron already installed."
        echo "   Edit manually: crontab -e"
    else
        (crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -
        echo "✅ Cron installed! Auto-hunt runs weekdays at 6am."
        echo "   Logs: $LOG"
    fi
    exit 0
}

# ── List profiles ────────────────────────────────────
list_profiles() {
    echo "📋 Hunt Profiles"
    echo "───────────────────────────────────────────────"
    for i in "${!PROFILE_NAMES[@]}"; do
        local last
        last=$(fetch_last_run "${PROFILE_CATS[$i]}" "${PROFILE_LOCS[$i]}")
        printf "  %-20s  %-30s  last: %s\n" "${PROFILE_NAMES[$i]}" "${PROFILE_LABELS[$i]}" "$last"
    done
    exit 0
}

# ── Handle flags ─────────────────────────────────────
if [[ "${1:-}" == "--install-cron" ]]; then install_cron; fi
if [[ "${1:-}" == "--list" ]]; then list_profiles; fi
if [[ "${1:-}" == "--edit" ]]; then ${EDITOR:-nano} "$PROFILES"; exit 0; fi

MODE="${1:-menu}"
SILENT=false
if [[ "${2:-}" == "--silent" || "${1:-}" == "--silent" ]]; then SILENT=true; fi

# ── Run ALL profiles ─────────────────────────────────
if [[ "$MODE" == "--all" ]]; then
    for i in "${!PROFILE_NAMES[@]}"; do
        run_hunt "$i" "$SILENT"
    done
    echo ""
    echo "✅ ALL hunts complete!"
    echo "   Dashboard: https://pintarweb-scraper.yusmarin.workers.dev/dashboard"
    exit 0
fi

# ── Run profile by name ──────────────────────────────
if [[ "$MODE" != "menu" ]]; then
    for i in "${!PROFILE_NAMES[@]}"; do
        if [[ "${PROFILE_NAMES[$i]}" == "$MODE" ]]; then
            run_hunt "$i" "$SILENT"
            echo ""
            echo "✅ Done: ${PROFILE_LABELS[$i]}"
            exit 0
        fi
    done
    echo "❌ Unknown profile: $MODE"
    echo "   Available: ${PROFILE_NAMES[*]}"
    exit 1
fi

# ── Interactive menu ─────────────────────────────────
echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║     🎯 HUNT COMMANDER                ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

for i in "${!PROFILE_NAMES[@]}"; do
    local last
    last=$(fetch_last_run "${PROFILE_CATS[$i]}" "${PROFILE_LOCS[$i]}")
    printf "  %2d) %-32s last: %s\n" $((i+1)) "${PROFILE_LABELS[$i]}" "$last"
done

echo "  $((${#PROFILE_NAMES[@]}+1))) Run ALL profiles"
echo "  $((${#PROFILE_NAMES[@]}+2))) 🚪 Exit"
echo ""
read -rp "  Choice (1-$((${#PROFILE_NAMES[@]}+2))): " choice

if [[ "$choice" -ge 1 && "$choice" -le "${#PROFILE_NAMES[@]}" ]]; then
    run_hunt $((choice-1)) false
    echo ""
    echo "✅ Done! Dashboard: https://pintarweb-scraper.yusmarin.workers.dev/dashboard"
elif [[ "$choice" -eq $((${#PROFILE_NAMES[@]}+1)) ]]; then
    for i in "${!PROFILE_NAMES[@]}"; do
        run_hunt "$i" false
    done
    echo ""
    echo "✅ ALL hunts complete!"
    echo "   Dashboard: https://pintarweb-scraper.yusmarin.workers.dev/dashboard"
else
    echo "👋 Exiting."
    exit 0
fi
