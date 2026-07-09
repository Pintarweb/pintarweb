#!/bin/bash
# Generate P.A.S.T. audit HTML for a lead
# Usage: bash scripts/generate-audit.sh "Business Name" "Area" "Niche" "output-dir" [--competitors "Name,Rating,Reviews;Name,Rating,Reviews"] [--gmb "listing_status,verification,photo_count,has_hours,has_description,review_count,rating"]
#
# Examples:
#   bash scripts/generate-audit.sh "Ah Seng Plumbing" "Klang" "plumbing" "data/audits"
#   bash scripts/generate-audit.sh "Tai Aircond" "Kuala Lumpur" "aircond" "data/audits" --competitors "Boost Aircond,4.5,67;Super Aircond,4.8,156"
#   bash scripts/generate-audit.sh "Razif Aircond" "Shah Alam" "aircond" "data/audits" --gmb "found,verified,12,1,1,23,4.5"

set -e

BUSINESS_NAME="${1:-}"
AREA="${2:-}"
NICHE="${3:-}"
OUTPUT_DIR="${4:-}"
USE_COMPETITORS=""
USE_GMB=""

# Parse arguments
POSITIONAL_ARGS=()
while [[ $# -gt 0 ]]; do
    case $1 in
        --competitors)
            USE_COMPETITORS="$2"
            shift 2
            ;;
        --gmb)
            USE_GMB="$2"
            shift 2
            ;;
        *)
            POSITIONAL_ARGS+=("$1")
            shift
            ;;
    esac
done

set -- "${POSITIONAL_ARGS[@]}"
BUSINESS_NAME="${1:-}"
AREA="${2:-}"
NICHE="${3:-}"
OUTPUT_DIR="${4:-}"

# Default values
DEFAULT_SEARCHES=500
DEFAULT_JOB_VALUE=150
DEFAULT_CONVERSION=10

# Niche-specific defaults
case "$NICHE" in
  aircond|aircond-service)
    DEFAULT_SEARCHES=500
    ;;
  plumbing|plumber)
    DEFAULT_SEARCHES=400
    ;;
  electrical|electrician)
    DEFAULT_SEARCHES=350
    ;;
  renovation|renovation)
    DEFAULT_SEARCHES=300
    ;;
  cleaning|cleaner)
    DEFAULT_SEARCHES=350
    ;;
  *)
    DEFAULT_SEARCHES=500
    ;;
esac

if [ -z "$BUSINESS_NAME" ] || [ -z "$AREA" ] || [ -z "$NICHE" ] || [ -z "$OUTPUT_DIR" ]; then
    echo "Usage: bash scripts/generate-audit.sh \"Business Name\" \"Area\" \"Niche\" \"output-dir\" [--competitors \"Name,Rating,Reviews;...\"] [--gmb \"listing_status,verification,photo_count,has_hours,has_description,review_count,rating\"]"
    echo ""
    echo "Arguments:"
    echo "  1. Business name"
    echo "  2. Area (e.g., Klang, Shah Alam)"
    echo "  3. Niche (e.g., plumbing, aircond, electrical)"
    echo "  4. Output directory"
    echo "  --competitors \"Name,Rating,Reviews;Name,Rating,Reviews\" (optional)"
    echo "  --gmb \"listing_status,verification,photo_count,has_hours,has_description,review_count,rating\" (optional)"
    echo ""
    echo "GMB --gmb values:"
    echo "  listing_status: found | not-found"
    echo "  verification: verified | pending | unverified | none"
    echo "  photo_count: number"
    echo "  has_hours: 1 | 0"
    echo "  has_description: 1 | 0"
    echo "  review_count: number"
    echo "  rating: number (e.g., 4.5)"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Generate ID from business name
ID=$(echo "$BUSINESS_NAME" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]' | tr '[:blank:]' '-' | head -c 30)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_FILE="${OUTPUT_DIR}/${ID}-audit-${TIMESTAMP}.html"
DEMO_URL="https://preview.pintarweb.com/${ID}/"

# Get WhatsApp number from environment or use default
WHATSAPP_NUMBER="${DEFAULT_WHATSAPP:-60174456243}"
WHATSAPP_TEXT="Hi%2C%20I%20saw%20my%20online%20presence%20audit%20and%20I%27d%20like%20to%20know%20more%20about%20PintarWeb."
WHATSAPP_URL="https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}"

# Calculate default losses
MONTHLY_LOSS=$((DEFAULT_SEARCHES * DEFAULT_CONVERSION / 100 * DEFAULT_JOB_VALUE))
YEARLY_LOSS=$((MONTHLY_LOSS * 12))

# Format numbers with commas
format_number() {
    echo "$1" | sed ':a;s/\B[0-9]\{3\}\>/,&/;ta'
}

MONTHLY_LOSS=$(format_number $MONTHLY_LOSS)
YEARLY_LOSS=$(format_number $YEARLY_LOSS)
DEFAULT_SEARCHES_FMT=$(format_number $DEFAULT_SEARCHES)

# Capitalize niche for display
NICHE_DISPLAY=$(echo "$NICHE" | sed 's/\b\(.\)/\U\1/g')

# Competitor HTML
COMPETITORS_HTML=""
COMPETITOR_COUNT=0

if [ -n "$USE_COMPETITORS" ] && [ "$USE_COMPETITORS" != "--competitors" ]; then
    IFS=';' read -ra COMPETITORS <<< "$USE_COMPETITORS"
    for i in "${!COMPETITORS[@]}"; do
        IFS=',' read -ra COMP <<< "${COMPETITORS[$i]}"
        NAME="${COMP[0]}"
        RATING="${COMP[1]:-0}"
        REVIEWS="${COMP[2]:-0}"
        RANK=$((i + 1))
        INT_RATING=${RATING%.*}

        COMPETITORS_HTML="${COMPETITORS_HTML}
        <div class=\"competitor-item\">
          <div class=\"competitor-rank\">${RANK}</div>
          <div class=\"competitor-info\">
            <div class=\"competitor-name\">${NAME}</div>
            <div class=\"competitor-meta\">${REVIEWS} reviews</div>
          </div>
          <div class=\"competitor-stars\">${INT_RATING}★</div>
        </div>"
        COMPETITOR_COUNT=$((COMPETITOR_COUNT + 1))
    done
else
    # Default competitors
    COMPETITORS_HTML="${COMPETITORS_HTML}
        <div class=\"competitor-item\">
          <div class=\"competitor-rank\">1</div>
          <div class=\"competitor-info\">
            <div class=\"competitor-name\">${AREA} ${NICHE_DISPLAY} Services</div>
            <div class=\"competitor-meta\">Top rated in area</div>
          </div>
          <div class=\"competitor-stars\">4.8★</div>
        </div>
        <div class=\"competitor-item\">
          <div class=\"competitor-rank\">2</div>
          <div class=\"competitor-info\">
            <div class=\"competitor-name\">Professional ${NICHE_DISPLAY}</div>
            <div class=\"competitor-meta\">Established business</div>
          </div>
          <div class=\"competitor-stars\">4.5★</div>
        </div>
        <div class=\"competitor-item\">
          <div class=\"competitor-rank\">3</div>
          <div class=\"competitor-info\">
            <div class=\"competitor-name\">${AREA} ${NICHE_DISPLAY} Expert</div>
            <div class=\"competitor-meta\">Local favorite</div>
          </div>
          <div class=\"competitor-stars\">4.2★</div>
        </div>"
    COMPETITOR_COUNT=3
fi

# GMB Data Processing
GMB_STATUS_CLASS="not-found"
GMB_STATUS_LABEL="TIADA GMB"
GMB_STATS_HTML=""
GMB_CHECKLIST_HTML=""
GMB_OPTIONS_HTML=""

if [ -n "$USE_GMB" ] && [ "$USE_GMB" != "--gmb" ]; then
    IFS=',' read -ra GMB_FIELDS <<< "$USE_GMB"
    GMB_LISTING_FOUND="${GMB_FIELDS[0]:-not-found}"
    GMB_VERIFICATION="${GMB_FIELDS[1]:-none}"
    GMB_PHOTO_COUNT="${GMB_FIELDS[2]:-0}"
    GMB_HAS_HOURS="${GMB_FIELDS[3]:-0}"
    GMB_HAS_DESC="${GMB_FIELDS[4]:-0}"
    GMB_REVIEW_COUNT="${GMB_FIELDS[5]:-0}"
    GMB_RATING="${GMB_FIELDS[6]:-0}"

    if [ "$GMB_LISTING_FOUND" = "found" ]; then
        if [ "$GMB_VERIFICATION" = "verified" ]; then
            GMB_STATUS_CLASS="verified"
            GMB_STATUS_LABEL="TERVERIFIKASI"
        elif [ "$GMB_VERIFICATION" = "pending" ] || [ "$GMB_VERIFICATION" = "unverified" ]; then
            GMB_STATUS_CLASS="unverified"
            GMB_STATUS_LABEL="BELUM SAH"
        else
            GMB_STATUS_CLASS="unverified"
            GMB_STATUS_LABEL="TIDAK LENGKAP"
        fi

        # GMB Stats
        GMB_STATS_HTML="
        <div class=\"gmb-stats\">
            <div class=\"gmb-stat\">
                <div class=\"gmb-stat-value\">${GMB_RATING}★</div>
                <div class=\"gmb-stat-label\">Rating</div>
            </div>
            <div class=\"gmb-stat\">
                <div class=\"gmb-stat-value\">${GMB_REVIEW_COUNT}</div>
                <div class=\"gmb-stat-label\">Ulasan</div>
            </div>
            <div class=\"gmb-stat\">
                <div class=\"gmb-stat-value\">${GMB_PHOTO_COUNT}</div>
                <div class=\"gmb-stat-label\">Foto</div>
            </div>
        </div>"

        # Checklist
        if [ "$GMB_HAS_HOURS" = "1" ]; then
            GMB_CHECKLIST_HTML="${GMB_CHECKLIST_HTML}<li class=\"done\"><span class=\"icon\">✓</span> Waktu operasi ditetapkan</li>"
        else
            GMB_CHECKLIST_HTML="${GMB_CHECKLIST_HTML}<li class=\"pending\"><span class=\"icon\">✗</span> Waktu operasi belum ditetapkan</li>"
        fi

        if [ "$GMB_HAS_DESC" = "1" ]; then
            GMB_CHECKLIST_HTML="${GMB_CHECKLIST_HTML}<li class=\"done\"><span class=\"icon\">✓</span> Deskripsi perniagaan ditulis</li>"
        else
            GMB_CHECKLIST_HTML="${GMB_CHECKLIST_HTML}<li class=\"pending\"><span class=\"icon\">✗</span> Deskripsi perniagaan belum ditulis</li>"
        fi

        if [ "$GMB_PHOTO_COUNT" -ge 10 ]; then
            GMB_CHECKLIST_HTML="${GMB_CHECKLIST_HTML}<li class=\"done\"><span class=\"icon\">✓</span> ${GMB_PHOTO_COUNT} foto (cukup)</li>"
        else
            GMB_CHECKLIST_HTML="${GMB_CHECKLIST_HTML}<li class=\"pending\"><span class=\"icon\">✗</span> Hanya ${GMB_PHOTO_COUNT} foto (minimum 10)</li>"
        fi

        # Options based on status
        if [ "$GMB_VERIFICATION" != "verified" ]; then
            GMB_OPTIONS_HTML="
            <div class=\"gmb-options\">
                <p style=\"font-size: 0.875rem; color: var(--color-muted); margin-bottom: 1rem;\">Kami boleh bantu lengkapkan dan sahkan GMB anda — FREE dalam pakej.</p>
                <a href=\"https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20saya%20nak%20lengkapkan%20dan%20sahkan%20Google%20Business%20Profile%20saya.\" class=\"gmb-cta\">
                    📍 Lengkapkan GMB Saya
                </a>
            </div>"
        else
            GMB_OPTIONS_HTML="
            <div class=\"gmb-options\">
                <p style=\"font-size: 0.875rem; color: var(--color-muted); margin-bottom: 1rem;\">GMB anda dah bagus — tapi boleh lagi dioptimize untuk lebih pelanggan.</p>
                <a href=\"https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20GMB%20saya%20dah%20lengkap.%20Saya%20nak%20optimize%20lagi%20untuk%20lebih%20pelanggan.\" class=\"gmb-cta\">
                    🚀 Optimize GMB Saya Lagi
                </a>
            </div>"
        fi
    else
        # No GMB found
        GMB_STATUS_CLASS="not-found"
        GMB_STATUS_LABEL="TIADA GMB"
        GMB_OPTIONS_HTML="
        <div class=\"gmb-options\">
            <p style=\"font-size: 0.875rem; color: var(--color-muted); margin-bottom: 1rem;\">Google Business Profile membantu pelanggan jumpa anda di Google Maps — FREE!</p>
            <a href=\"https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20saya%20nak%20buka%20Google%20Business%20Profile%20baru%20untuk%20bisnes%20saya.\" class=\"gmb-cta\">
                ➕ Bina GMB Baru Untuk Saya
            </a>
        </div>"
    fi
fi

# Audit date
AUDIT_DATE=$(date "+%B %d, %Y")

# Read template
TEMPLATE_FILE="packages/site-generator/templates/audit-template.html"

if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Error: Template not found: $TEMPLATE_FILE"
    exit 1
fi

# Use Python for robust substitution
python3 << PYTHON_SCRIPT
import re

# Read template
with open("$TEMPLATE_FILE", "r") as f:
    content = f.read()

# Substitutions
replacements = {
    "{{BUSINESS_NAME}}": "$BUSINESS_NAME",
    "{{AREA}}": "$AREA",
    "{{NICHE}}": "$NICHE_DISPLAY",
    "{{COMPETITORS_HTML}}": """$COMPETITORS_HTML""",
    "{{COMPETITOR_COUNT}}": "$COMPETITOR_COUNT",
    "{{DEFAULT_SEARCHES}}": "$DEFAULT_SEARCHES_FMT",
    "{{DEFAULT_JOB_VALUE}}": "$DEFAULT_JOB_VALUE",
    "{{DEFAULT_CONVERSION}}": "$DEFAULT_CONVERSION",
    "{{MONTHLY_LOSS}}": "$MONTHLY_LOSS",
    "{{YEARLY_LOSS}}": "$YEARLY_LOSS",
    "{{DEMO_URL}}": "$DEMO_URL",
    "{{WHATSAPP_URL}}": """$WHATSAPP_URL""",
    "{{AUDIT_DATE}}": "$AUDIT_DATE",
    "{{GMB_STATUS_CLASS}}": "$GMB_STATUS_CLASS",
    "{{GMB_STATUS_LABEL}}": "$GMB_STATUS_LABEL",
    "{{GMB_STATS_HTML}}": """$GMB_STATS_HTML""",
    "{{GMB_CHECKLIST_HTML}}": """$GMB_CHECKLIST_HTML""",
    "{{GMB_OPTIONS_HTML}}": """$GMB_OPTIONS_HTML""",
}

for placeholder, value in replacements.items():
    content = content.replace(placeholder, value)

# Write output
with open("$OUTPUT_FILE", "w") as f:
    f.write(content)

print("Audit generated successfully")
PYTHON_SCRIPT

echo ""
echo "✅ Audit generated!"
echo ""
echo "Business: $BUSINESS_NAME"
echo "Area: $AREA"
echo "Niche: $NICHE"
echo ""
echo "Output: $OUTPUT_FILE"
echo "Demo URL: $DEMO_URL"
