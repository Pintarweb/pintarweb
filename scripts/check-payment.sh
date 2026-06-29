#!/bin/bash
# Check payment status by reference ID
# Usage: bash scripts/check-payment.sh "PWT-001"
#
# Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env

set -e

REFERENCE_ID="${1:-}"

if [ -z "$REFERENCE_ID" ]; then
    echo "Usage: bash scripts/check-payment.sh \"PWT-001\""
    exit 1
fi

# Load .env if exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

if [ -z "$RAZORPAY_KEY_ID" ] || [ -z "$RAZORPAY_KEY_SECRET" ]; then
    echo "Error: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env"
    exit 1
fi

echo "Checking payments for reference: $REFERENCE_ID..."

RESPONSE=$(curl -s -X GET "https://api.razorpay.com/v1/payments?reference_id=$REFERENCE_ID" \
    -u "$RAZORPAY_KEY_ID:$RAZORPAY_KEY_SECRET")

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
