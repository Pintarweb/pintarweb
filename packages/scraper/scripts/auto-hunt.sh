#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROFILES="$DIR/hunt-profiles.json"
LOG="$DIR/hunts/auto-hunt.log"
REMOTE_FLAG="--remote"
WORKER="https://pintarweb-scraper.yusmarin.workers.dev"

mkdir -p "$(dirname "$LOG")"

# ── Help ──────────────────────────────────────────────
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    echo "🎯 PintarWeb Hunt Commander"
    echo ""
    echo "Usage:"
    echo "  bash scripts/auto-hunt.sh                  Interactive menu"
    echo "  bash scripts/auto-hunt.sh <profile>        Run profile by name"
    echo "  bash scripts/auto-hunt.sh --all            Run ALL profiles"
    echo "  bash scripts/auto-hunt.sh --rotate         Run next profile in rotation"
    echo "  bash scripts/auto-hunt.sh --silent         Run with minimal output"
    echo "  bash scripts/auto-hunt.sh --list           List profiles and last-run"
    echo "  bash scripts/auto-hunt.sh --edit           Open profiles file"
    exit 0
fi

# ── Load profiles ────────────────────────────────────
# Try D1 API first (for --rotate), fall back to local JSON
PROFILE_NAMES=(); PROFILE_LABELS=(); PROFILE_CATS=()
PROFILE_LOCS=(); PROFILE_LIMITS=(); PROFILE_SRCS=()

load_profiles_from_json() {
    if [[ ! -f "$PROFILES" ]]; then
        echo "❌ No hunt-profiles.json found at $PROFILES"
        exit 1
    fi
    while IFS=$'\t' read -r name label cat loc lim src; do
        PROFILE_NAMES+=("$name")
        PROFILE_LABELS+=("$label")
        PROFILE_CATS+=("$cat")
        PROFILE_LOCS+=("$loc")
        PROFILE_LIMITS+=("$lim")
        PROFILE_SRCS+=("$src")
    done < <(jq -r '.[] | [.name, .label, .category, .location, (.limit|tostring), .sources] | @tsv' "$PROFILES")
}

load_profiles_from_json

# ── Run a single hunt ────────────────────────────────
run_hunt() {
    local idx=$1
    local silent=${2:-false}
    local profile_name="${PROFILE_NAMES[$idx]}"
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
        --profile "$profile_name" \
        $REMOTE_FLAG 2>&1 | tee -a "$LOG"

    echo "[$ts] Finished hunt: $label" >> "$LOG"
    echo "" >> "$LOG"
}

# ── Rotation: fetch next profile from D1 & run it ────
run_rotation() {
    local silent=${1:-false}

    echo "🔄 Fetching rotation state from D1..."
    local rot
    rot=$(curl -sf "$WORKER/api/rotation") || {
        echo "❌ Failed to fetch rotation state. Is the worker deployed?"
        exit 1
    }

    local name label cat loc lim src
    name=$(echo "$rot" | jq -r '.current_profile.name // empty')
    label=$(echo "$rot" | jq -r '.current_profile.label // empty')
    cat=$(echo "$rot" | jq -r '.current_profile.category // empty')
    loc=$(echo "$rot" | jq -r '.current_profile.location // empty')
    lim=$(echo "$rot" | jq -r '.current_profile.limit // 50')
    src=$(echo "$rot" | jq -r '.current_profile.sources // "Maps,FB"')

    if [[ -z "$name" ]]; then
        echo "❌ No enabled profiles found in rotation."
        echo "   Add profiles via Dashboard → Profiles tab."
        exit 1
    fi

    local total
    total=$(echo "$rot" | jq -r '.total_profiles // 0')

    if [[ "$silent" != "true" ]]; then
        echo ""
        echo "═══════════════════════════════════════════════"
        echo "  🔄 ROTATION: $label"
        echo "  📊 Profile $(( $(echo "$rot" | jq '.current_index') + 1 )) of $total"
        echo "═══════════════════════════════════════════════"
        echo ""
    fi

    local ts
    ts=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$ts] Rotation hunt: $label (profile $(echo "$rot" | jq '.current_index + 1')/$total)" >> "$LOG"

    npx tsx src/index.ts \
        --category "$cat" \
        --location "$loc" \
        --limit "$lim" \
        --sources "$src" \
        --profile "$name" \
        $REMOTE_FLAG 2>&1 | tee -a "$LOG"

    echo "[$ts] Finished rotation hunt: $label" >> "$LOG"

    # Advance rotation
    echo ""
    echo "⏩ Advancing rotation..."
    local adv
    adv=$(curl -sf -X POST "$WORKER/api/rotation") || {
        echo "⚠️  Scrape done but failed to advance rotation."
        echo "   You can manually advance from Dashboard → Profiles."
        return
    }
    local next_name
    next_name=$(echo "$adv" | jq -r '.next_profile.label // "none"')
    local next_idx
    next_idx=$(echo "$adv" | jq -r '.current_index // 0')
    echo "✅ Rotation advanced. Next up: $next_name (index $next_idx)"
    echo "" >> "$LOG"
}

# ── Flag handlers ────────────────────────────────────
if [[ "${1:-}" == "--rotate" ]]; then
    SILENT=false
    [[ "${2:-}" == "--silent" || "${1:-}" == "--silent" ]] && SILENT=true
    run_rotation "$SILENT"
    exit 0
fi

# ── Interactive menu & legacy commands ────────────────
# (keeping all existing functionality for backward compat)

# Install cron (updated to use --rotate)
install_cron() {
    local CRON_LINE="0 6 * * 1,4 cd $DIR && bash scripts/auto-hunt.sh --rotate --silent >> $LOG 2>&1"
    if crontab -l 2>/dev/null | grep -q "auto-hunt.sh"; then
        echo "⚠️  Auto-hunt cron already installed."
        echo "   Edit: crontab -e"
    else
        (crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -
        echo "✅ Cron installed! Auto-hunt runs Mon & Thu at 6am using rotation."
        echo "   Logs: $LOG"
    fi
    exit 0
}

fetch_last_run() {
    local cat="$1" loc="$2"
    curl -s "$WORKER/api/hunts" 2>/dev/null \
        | jq -r --arg cat "$cat" --arg loc "$loc" '[.[] | select(.category == $cat and .location == $loc)] | first | .created_at // "never"'
}

if [[ "${1:-}" == "--install-cron" ]]; then install_cron; fi
if [[ "${1:-}" == "--list" ]]; then
    echo "📋 Hunt Profiles"
    echo "───────────────────────────────────────────────"
    for i in "${!PROFILE_NAMES[@]}"; do
        local last
        last=$(fetch_last_run "${PROFILE_CATS[$i]}" "${PROFILE_LOCS[$i]}")
        printf "  %-20s  %-30s  last: %s\n" "${PROFILE_NAMES[$i]}" "${PROFILE_LABELS[$i]}" "$last"
    done
    echo ""
    echo "💡 For rotation-based profiles, manage via Dashboard → Profiles tab."
    exit 0
fi
if [[ "${1:-}" == "--edit" ]]; then ${EDITOR:-nano} "$PROFILES"; exit 0; fi

MODE="${1:-menu}"
SILENT=false
[[ "${2:-}" == "--silent" || "${1:-}" == "--silent" ]] && SILENT=true

if [[ "$MODE" == "--all" ]]; then
    for i in "${!PROFILE_NAMES[@]}"; do run_hunt "$i" "$SILENT"; done
    echo ""; echo "✅ ALL hunts complete!"
    echo "   Dashboard: https://pintarweb-scraper.yusmarin.workers.dev/dashboard"
    exit 0
fi

if [[ "$MODE" != "menu" ]]; then
    for i in "${!PROFILE_NAMES[@]}"; do
        if [[ "${PROFILE_NAMES[$i]}" == "$MODE" ]]; then
            run_hunt "$i" "$SILENT"
            echo ""; echo "✅ Done: ${PROFILE_LABELS[$i]}"
            exit 0
        fi
    done
    echo "❌ Unknown profile: $MODE"
    echo "   Available: ${PROFILE_NAMES[*]}"
    exit 1
fi

# Interactive menu
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
echo "  $((${#PROFILE_NAMES[@]}+2))) 🔄 Run rotation"
echo "  $((${#PROFILE_NAMES[@]}+3))) 🚪 Exit"
echo ""
read -rp "  Choice (1-$((${#PROFILE_NAMES[@]}+3))): " choice

if [[ "$choice" -ge 1 && "$choice" -le "${#PROFILE_NAMES[@]}" ]]; then
    run_hunt $((choice-1)) false
elif [[ "$choice" -eq $((${#PROFILE_NAMES[@]}+1)) ]]; then
    for i in "${!PROFILE_NAMES[@]}"; do run_hunt "$i" false; done
elif [[ "$choice" -eq $((${#PROFILE_NAMES[@]}+2)) ]]; then
    run_rotation false
else
    echo "👋 Exiting."
    exit 0
fi

echo ""
echo "✅ Done! Dashboard: https://pintarweb-scraper.yusmarin.workers.dev/dashboard"
