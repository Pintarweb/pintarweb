#!/bin/bash
# Build watcher daemon — polls D1 for leads at images_collected stage,
# generates config.json from D1 data, auto-builds demo sites,
# saves demo URL, and advances pipeline.
#
# Usage:
#   bash scripts/watch-build.sh              run in foreground (Ctrl+C)
#   bash scripts/watch-build.sh --daemon     background
#   bash scripts/watch-build.sh --stop       stop background daemon
#   bash scripts/watch-build.sh --once       single pass (for cron)

set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")/.."

WORKER_URL="${WATCH_BUILD_WORKER_URL:-https://pintarweb-scraper.yusmarin.workers.dev}"
POLL_INTERVAL="${WATCH_BUILD_POLL_INTERVAL:-30}"
LOCK_DIR="/tmp/pintarweb-build-locks"
LOG_FILE="$PWD/logs/build-watcher.log"
PID_FILE="/tmp/pintarweb-build-watcher.pid"

mkdir -p "$LOCK_DIR" "$(dirname "$LOG_FILE")"

log() { echo "[$(TZ=Asia/Kuala_Lumpur date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"; echo "[$(TZ=Asia/Kuala_Lumpur date '+%Y-%m-%d %H:%M:%S')] $*"; }

NICHE_MOOD_MAP='{
  "aircond-contractor": "premium-modern",
  "plumbing": "trustworthy-local",
  "electrical": "bold-urgent",
  "renovation": "premium-modern",
  "general": "trustworthy-local"
}'

cleanup_locks() {
  find "$LOCK_DIR" -type f -mmin +60 -delete 2>/dev/null || true
}

generate_config() {
  local lead_json="$1"
  local leadId; leadId=$(echo "$lead_json" | jq -r '.id // empty')
  [ -z "$leadId" ] && return 1

  local config_dir="packages/site-generator/clients/$leadId"
  mkdir -p "$config_dir"

  local config
  config=$(echo "$lead_json" | jq --argjson mood_map "$NICHE_MOOD_MAP" '{
    id: .id,
    business_name: (.business_name // ""),
    tagline: (.tagline // ""),
    tagline_en: (.tagline_en // ""),
    phone: (.phone_normalized // ""),
    whatsapp: (.phone_normalized // ""),
    area: ((.address // "") as $addr | ($addr | gsub("^[^a-zA-Z0-9]+\\s*"; "") | split(",")) as $parts | $parts[2] // $parts[0] | sub("^\\s+"; "") | sub("\\s+$"; "") // "Kuala Lumpur"),
    address: (.address // ""),
    niche: (.niche // .category // "general"),
    services: (if .services then (.services | fromjson) else [] end),
    services_en: (if .services_en then (.services_en | fromjson) else [] end),
    service_areas: [((.address // "") as $addr | ($addr | gsub("^[^a-zA-Z0-9]+\\s*"; "") | split(",")) as $parts | $parts[2] // $parts[0] | sub("^\\s+"; "") | sub("\\s+$"; "") // "Kuala Lumpur")],
    mood: ($mood_map[(.niche // .category // "general")] // "trustworthy-local"),
    google_rating: ((.gmb_rating // 0) | tonumber | if . > 0 then . else null end),
    google_review_count: (.gmb_review_count // 0),
    testimonials: (if .testimonials then (.testimonials | fromjson) else [] end),
    testimonials_en: (if .testimonials_en then (.testimonials_en | fromjson) else [] end),
    gallery_images: [],
    facebook_url: (.facebook_url // ""),
    instagram_url: (.instagram_url // ""),
    tiktok_url: (.tiktok_url // ""),
    social: {
      instagram_handle: ((.instagram_url // "") | gsub("https://(www\\.)?instagram\\.com/"; "") | gsub("@"; "")),
      instagram_followers: 0,
      instagram_active: (.instagram_url != null and .instagram_url != ""),
      instagram_content_type: "project-photos",
      instagram_link_in_bio: "whatsapp",
      tiktok_handle: ((.tiktok_url // "") | gsub("https://(www\\.)?tiktok\\.com/@"; "")),
      tiktok_followers: 0,
      tiktok_active: (.tiktok_url != null and .tiktok_url != "")
    },
    audit: {
      has_website: (.website_url != null and .website_url != ""),
      website_url: .website_url,
      google_maps_url: .maps_url
    }
  }')

  echo "$config" > "$config_dir/config.json"
  log "Generated config.json for $leadId"
  return 0
}

build_lead() {
  local lead_json="$1"
  local phone; phone=$(echo "$lead_json" | jq -r '.phone_normalized // empty')
  local leadId; leadId=$(echo "$lead_json" | jq -r '.id // empty')
  local niche; niche=$(echo "$lead_json" | jq -r '.niche // .category // "general"')
  local demo_url; demo_url=$(echo "$lead_json" | jq -r '.demo_url // ""')

  if [ -z "$phone" ] || [ -z "$leadId" ]; then
    log "WARN: Skipping lead with missing phone/id"
    return
  fi

  if [ -n "$demo_url" ] && [ "$demo_url" != "null" ] && [ "$demo_url" != "" ]; then
    log "SKIP $leadId — already has demo_url: $demo_url"
    return
  fi
  if [ -f "$LOCK_DIR/$leadId" ]; then
    log "SKIP $leadId — already building (lock exists)"
    return
  fi

  touch "$LOCK_DIR/$leadId"
  log "Building demo for $leadId ($phone, niche=$niche)..."

  generate_config "$lead_json" || {
    log "FAILED to generate config.json for $leadId"
    rm -f "$LOCK_DIR/$leadId"
    return
  }

  set +e
  bash scripts/generate-site.sh "$leadId" "$niche" 2>&1 | tee -a "$LOG_FILE"
  local build_exit=${PIPESTATUS[0]}
  set -e

  if [ "$build_exit" -eq 0 ]; then
    local demo_url="https://preview.pintarweb.com/${leadId}/"
    curl -s -X PATCH "$WORKER_URL/api/leads/$phone/demo" \
      -H "Content-Type: application/json" \
      -d "{\"demo_url\": \"$demo_url\"}" > /dev/null
    curl -s -X PATCH "$WORKER_URL/api/leads/$phone/stage" \
      -H "Content-Type: application/json" \
      -d '{"pipeline_stage": "demo_built"}' > /dev/null
    log "Demo built & saved for $leadId -> $demo_url"
  else
    log "BUILD FAILED for $leadId (exit code $build_exit)"
  fi

  rm -f "$LOCK_DIR/$leadId"
}

do_pass() {
  log "Polling for leads at images_collected stage..."
  local response
  response=$(curl -s "$WORKER_URL/api/leads?stage=images_collected")

  if ! echo "$response" | jq -e '. | type == "array"' > /dev/null 2>&1; then
    log "WARN: Invalid response from worker (not an array)"
    return
  fi

  local count
  count=$(echo "$response" | jq 'length')
  log "Found $count lead(s) at images_collected"

  echo "$response" | jq -c '.[]' | while IFS= read -r lead; do
    build_lead "$lead"
  done
}

case "${1:-}" in
  --daemon)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "Watcher already running (PID $(cat "$PID_FILE"))"
      exit 1
    fi
    nohup "$0" --foreground > /dev/null 2>&1 &
    echo $! > "$PID_FILE"
    echo "Watcher started in background (PID $(cat "$PID_FILE"))"
    echo "Log: $LOG_FILE"
    echo "Stop: bash $0 --stop"
    ;;
  --foreground)
    log "Build watcher started (poll every ${POLL_INTERVAL}s)"
    while true; do
      cleanup_locks
      do_pass
      sleep "$POLL_INTERVAL"
    done
    ;;
  --stop)
    if [ -f "$PID_FILE" ]; then
      kill "$(cat "$PID_FILE")" 2>/dev/null || true
      rm -f "$PID_FILE"
      log "Watcher stopped"
    else
      echo "No watcher running"
    fi
    ;;
  --once)
    do_pass
    ;;
  *)
    echo "PintarWeb Build Watcher"
    echo ""
    echo "Usage:"
    echo "  bash scripts/watch-build.sh              Run in foreground"
    echo "  bash scripts/watch-build.sh --daemon     Run in background"
    echo "  bash scripts/watch-build.sh --stop       Stop background daemon"
    echo "  bash scripts/watch-build.sh --once       Single pass (cron)"
    echo ""
    echo "Env vars:"
    echo "  WATCH_BUILD_WORKER_URL   Worker URL"
    echo "  WATCH_BUILD_POLL_INTERVAL   Poll interval (s)"
    ;;
esac
