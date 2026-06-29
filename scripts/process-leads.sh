#!/bin/bash
# Score and prioritize leads based on data-opportunity insight
# Usage: bash scripts/process-leads.sh data/leads-raw.csv [output.csv]
#
# Input CSV format (header required):
#   name,phone,address,area,niche,rating,reviews,has_website,has_social,google_maps_url
#
# Scoring (P.A.S.T. data-opportunity insight):
#   +50 No website + active social (data opportunity)
#   +40 No website + no social (pure invisibility)
#   +20 Has website + active social (has presence, can improve data strategy)
#   +10 Has website + no social (needs owned channel)
#   +15 Low rating (<4.0) = looking for solutions
#   -10 High review count (>50) = established
#   -5  Active social (DIY person)

set -e

INPUT_FILE="${1:-}"
OUTPUT_FILE="${2:-}"

if [ -z "$INPUT_FILE" ]; then
    echo "Usage: bash scripts/process-leads.sh <input.csv> [output.csv]"
    echo ""
    echo "Input CSV format (header required):"
    echo "  name,phone,address,area,niche,rating,reviews,has_website,has_social,google_maps_url"
    echo ""
    echo "Notes:"
    echo "  - has_website: 'yes' or 'no'"
    echo "  - has_social: 'yes', 'no', or 'unknown'"
    echo "  - rating: number (e.g., 4.2)"
    echo "  - reviews: number"
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file not found: $INPUT_FILE"
    exit 1
fi

# Default output filename
if [ -z "$OUTPUT_FILE" ]; then
    OUTPUT_FILE="${INPUT_FILE%.csv}-processed.csv"
fi

echo "Processing leads from: $INPUT_FILE"
echo "Output: $OUTPUT_FILE"

# Create temporary files
TEMP_FILE=$(mktemp)
HEADER_FILE=$(mktemp)

# Extract header
head -1 "$INPUT_FILE" > "$HEADER_FILE"

# Process each line
{
    echo "name,phone,address,area,niche,rating,reviews,has_website,has_social,google_maps_url,score,priority,whatsapp_link"

    tail -n +2 "$INPUT_FILE" | while IFS=, read -r name phone address area niche rating reviews has_website has_social google_maps_url; do
        # Skip empty lines
        if [ -z "$name" ]; then
            continue
        fi

        # Clean phone number (remove non-digits, ensure 60 prefix)
        phone_clean=$(echo "$phone" | tr -cd '[:digit:]')
        if [[ ! "$phone_clean" =~ ^60 ]]; then
            phone_clean="60${phone_clean}"
        fi

        # Calculate score
        score=0

        # Website + Social scoring (data-opportunity insight)
        if [ "$has_website" = "no" ] && [ "$has_social" = "yes" ]; then
            # KEY INSIGHT: Has audience but doesn't own the channel
            score=$((score + 50))
            priority="HIGH"
        elif [ "$has_website" = "no" ] && [ "$has_social" != "yes" ]; then
            # Pure invisibility
            score=$((score + 40))
            priority="HIGH"
        elif [ "$has_website" = "yes" ] && [ "$has_social" = "yes" ]; then
            # Has presence, can improve
            score=$((score + 20))
            priority="MEDIUM"
        elif [ "$has_website" = "yes" ]; then
            # Needs owned channel
            score=$((score + 10))
            priority="LOW"
        else
            # Unknown - assume opportunity
            score=$((score + 30))
            priority="MEDIUM"
        fi

        # Rating adjustment
        if [ -n "$rating" ] && [ "$(echo "$rating < 4.0" | bc 2>/dev/null || echo 0)" -eq 1 ]; then
            score=$((score + 15))
        fi

        # High reviews = established = lower urgency
        if [ -n "$reviews" ] && [ "$reviews" -gt 50 ] 2>/dev/null; then
            score=$((score - 10))
        fi

        # Active social = DIY person = less likely to pay
        if [ "$has_social" = "yes" ]; then
            score=$((score - 5))
        fi

        # Ensure score doesn't go negative
        if [ "$score" -lt 0 ]; then
            score=0
        fi

        # Recalculate priority based on final score
        if [ "$score" -ge 60 ]; then
            priority="HIGH"
        elif [ "$score" -ge 30 ]; then
            priority="MEDIUM"
        else
            priority="LOW"
        fi

        # WhatsApp link
        whatsapp_link="https://wa.me/${phone_clean}"

        # Escape fields for CSV (handle commas in names)
        name_escaped="\"${name}\""
        address_escaped="\"${address}\""

        echo "${name_escaped},${phone},${address_escaped},${area},${niche},${rating},${reviews},${has_website},${has_social},${google_maps_url},${score},${priority},${whatsapp_link}"
    done

    # Output header last (so sort works properly)
    echo "name,phone,address,area,niche,rating,reviews,has_website,has_social,google_maps_url,score,priority,whatsapp_link"
} | grep -v "^name,phone" | sort -t',' -k11,11nr > "$TEMP_FILE"

# Add header at the top
{
    echo "name,phone,address,area,niche,rating,reviews,has_website,has_social,google_maps_url,score,priority,whatsapp_link"
    cat "$TEMP_FILE"
} > "$OUTPUT_FILE"

# Count stats
TOTAL=$(tail -n +2 "$OUTPUT_FILE" | wc -l)
HIGH=$(grep ",HIGH," "$OUTPUT_FILE" | wc -l)
MEDIUM=$(grep ",MEDIUM," "$OUTPUT_FILE" | wc -l)
LOW=$(grep ",LOW," "$OUTPUT_FILE" | wc -l)

echo ""
echo "✅ Processed $TOTAL leads"
echo "   HIGH priority:   $HIGH"
echo "   MEDIUM priority: $MEDIUM"
echo "   LOW priority:    $LOW"
echo ""
echo "Output saved to: $OUTPUT_FILE"

# Cleanup
rm -f "$TEMP_FILE" "$HEADER_FILE"
