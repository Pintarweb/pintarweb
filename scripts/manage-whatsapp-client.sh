#!/bin/bash
# Manage WhatsApp Bot Clients (Layer 3)
# Usage:
#   bash scripts/manage-whatsapp-client.sh list                          — list all clients
#   bash scripts/manage-whatsapp-client.sh get <waba_id>                 — get client config
#   bash scripts/manage-whatsapp-client.sh add --waba-id X --business-name Y ...  — add client
#   bash scripts/manage-whatsapp-client.sh update <waba_id> [--key value...]   — update client
#   bash scripts/manage-whatsapp-client.sh delete <waba_id>                 — deactivate client

set -e

TARGET="--local"
DB_NAME="pintarweb-claude-db"

COMMAND="${1:-}"

show_usage() {
    echo "Usage: bash scripts/manage-whatsapp-client.sh <command> [args]"
    echo ""
    echo "Commands:"
    echo "  list                          List all clients"
    echo "  get <waba_id>                 Get client config"
    echo "  add [opts]                    Add new client"
    echo "  update <waba_id> [opts]       Update client"
    echo "  delete <waba_id>              Deactivate client"
    echo ""
    echo "Options for add/update:"
    echo "  --waba-id <id>               WhatsApp Business Account ID (required for add)"
    echo "  --business-name <name>        Business name"
    echo "  --services <text>             Services offered"
    echo "  --price-display <text>        Price display text"
    echo "  --area <area>                 Service area"
    echo "  --owner-notification <num>     Owner WhatsApp number"
    echo "  --niche <niche>              Niche (pintarweb|aircond|plumbing|electrical|reno)"
    echo "  --business-hours <text>        Business hours"
    echo "  --closing-flow-enabled <0|1>   Enable closing flow"
    echo ""
    echo "Examples:"
    echo "  bash scripts/manage-whatsapp-client.sh list"
    echo "  bash scripts/manage-whatsapp-client.sh get 727271803683109"
    echo "  bash scripts/manage-whatsapp-client.sh add --waba-id 727271803683109 --business-name \"Razif Aircond\" --niche aircond"
    echo "  bash scripts/manage-whatsapp-client.sh update 727271803683109 --niche plumbing"
}

case "$COMMAND" in
    list)
        echo "📋 Clients:"
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="SELECT waba_id, business_name, niche, area, is_active, updated_at FROM whatsapp_bot_config ORDER BY updated_at DESC;"
        ;;

    get)
        WABA_ID="${2:-}"
        if [ -z "$WABA_ID" ]; then
            echo "Error: Please specify waba_id"
            exit 1
        fi
        echo "📄 Client [$WABA_ID]:"
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="SELECT * FROM whatsapp_bot_config WHERE waba_id = '$WABA_ID';"
        ;;

    add)
        shift
        WABA_ID=""
        BUSINESS_NAME=""
        SERVICES=""
        PRICE_DISPLAY=""
        AREA=""
        OWNER_NOTIFICATION=""
        NICHE="pintarweb"
        BUSINESS_HOURS=""
        CLOSING_FLOW_ENABLED="1"

        while [[ $# -gt 0 ]]; do
            case $1 in
                --waba-id)
                    WABA_ID="$2"
                    shift 2
                    ;;
                --business-name)
                    BUSINESS_NAME="$2"
                    shift 2
                    ;;
                --services)
                    SERVICES="$2"
                    shift 2
                    ;;
                --price-display)
                    PRICE_DISPLAY="$2"
                    shift 2
                    ;;
                --area)
                    AREA="$2"
                    shift 2
                    ;;
                --owner-notification)
                    OWNER_NOTIFICATION="$2"
                    shift 2
                    ;;
                --niche)
                    NICHE="$2"
                    shift 2
                    ;;
                --business-hours)
                    BUSINESS_HOURS="$2"
                    shift 2
                    ;;
                --closing-flow-enabled)
                    CLOSING_FLOW_ENABLED="$2"
                    shift 2
                    ;;
                *)
                    shift
                    ;;
            esac
        done

        if [ -z "$WABA_ID" ] || [ -z "$BUSINESS_NAME" ]; then
            echo "Error: --waba-id and --business-name are required"
            exit 1
        fi

        # Escape single quotes
        BUSINESS_NAME="${BUSINESS_NAME//\'/\'}"
        SERVICES="${SERVICES//\'/\'}"
        PRICE_DISPLAY="${PRICE_DISPLAY//\'/\'}"
        AREA="${AREA//\'/\'}"
        OWNER_NOTIFICATION="${OWNER_NOTIFICATION//\'/\'}"
        NICHE="${NICHE//\'/\'}"
        BUSINESS_HOURS="${BUSINESS_HOURS//\'/\'}"

        echo "Adding client $WABA_ID..."
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="
        INSERT INTO whatsapp_bot_config 
            (waba_id, business_name, services, price_display, area, owner_notification, niche, business_hours, closing_flow_enabled, is_active, created_at, updated_at)
        VALUES 
            ('$WABA_ID', '$BUSINESS_NAME', '$SERVICES', '$PRICE_DISPLAY', '$AREA', '$OWNER_NOTIFICATION', '$NICHE', '$BUSINESS_HOURS', $CLOSING_FLOW_ENABLED, 1, datetime('now'), datetime('now'))
        ON CONFLICT(waba_id) DO UPDATE SET
            business_name = '$BUSINESS_NAME',
            services = '$SERVICES',
            price_display = '$PRICE_DISPLAY',
            area = '$AREA',
            owner_notification = '$OWNER_NOTIFICATION',
            niche = '$NICHE',
            business_hours = '$BUSINESS_HOURS',
            closing_flow_enabled = $CLOSING_FLOW_ENABLED,
            updated_at = datetime('now');
        "
        echo "✅ Client added/updated: $WABA_ID"
        ;;

    update)
        WABA_ID="${2:-}"
        if [ -z "$WABA_ID" ]; then
            echo "Error: Please specify waba_id"
            exit 1
        fi
        shift 2

        BUSINESS_NAME=""
        SERVICES=""
        PRICE_DISPLAY=""
        AREA=""
        OWNER_NOTIFICATION=""
        NICHE=""
        BUSINESS_HOURS=""
        CLOSING_FLOW_ENABLED=""

        while [[ $# -gt 0 ]]; do
            case $1 in
                --business-name)
                    BUSINESS_NAME="$2"
                    shift 2
                    ;;
                --services)
                    SERVICES="$2"
                    shift 2
                    ;;
                --price-display)
                    PRICE_DISPLAY="$2"
                    shift 2
                    ;;
                --area)
                    AREA="$2"
                    shift 2
                    ;;
                --owner-notification)
                    OWNER_NOTIFICATION="$2"
                    shift 2
                    ;;
                --niche)
                    NICHE="$2"
                    shift 2
                    ;;
                --business-hours)
                    BUSINESS_HOURS="$2"
                    shift 2
                    ;;
                --closing-flow-enabled)
                    CLOSING_FLOW_ENABLED="$2"
                    shift 2
                    ;;
                *)
                    shift
                    ;;
            esac
        done

        UPDATE_STMT="UPDATE whatsapp_bot_config SET updated_at = datetime('now')"

        if [ -n "$BUSINESS_NAME" ]; then
            BUSINESS_NAME="${BUSINESS_NAME//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, business_name = '$BUSINESS_NAME'"
        fi
        if [ -n "$SERVICES" ]; then
            SERVICES="${SERVICES//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, services = '$SERVICES'"
        fi
        if [ -n "$PRICE_DISPLAY" ]; then
            PRICE_DISPLAY="${PRICE_DISPLAY//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, price_display = '$PRICE_DISPLAY'"
        fi
        if [ -n "$AREA" ]; then
            AREA="${AREA//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, area = '$AREA'"
        fi
        if [ -n "$OWNER_NOTIFICATION" ]; then
            OWNER_NOTIFICATION="${OWNER_NOTIFICATION//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, owner_notification = '$OWNER_NOTIFICATION'"
        fi
        if [ -n "$NICHE" ]; then
            NICHE="${NICHE//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, niche = '$NICHE'"
        fi
        if [ -n "$BUSINESS_HOURS" ]; then
            BUSINESS_HOURS="${BUSINESS_HOURS//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, business_hours = '$BUSINESS_HOURS'"
        fi
        if [ -n "$CLOSING_FLOW_ENABLED" ]; then
            UPDATE_STMT="$UPDATE_STMT, closing_flow_enabled = $CLOSING_FLOW_ENABLED"
        fi

        UPDATE_STMT="$UPDATE_STMT WHERE waba_id = '$WABA_ID';"

        echo "Updating client $WABA_ID..."
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="$UPDATE_STMT"
        echo "✅ Client updated: $WABA_ID"
        ;;

    delete)
        WABA_ID="${2:-}"
        if [ -z "$WABA_ID" ]; then
            echo "Error: Please specify waba_id"
            exit 1
        fi

        echo "Deactivating client $WABA_ID..."
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="UPDATE whatsapp_bot_config SET is_active = 0, updated_at = datetime('now') WHERE waba_id = '$WABA_ID';"
        echo "✅ Client deactivated: $WABA_ID"
        ;;

    help|--help|-h)
        show_usage
        ;;

    *)
        show_usage
        exit 1
        ;;
esac
