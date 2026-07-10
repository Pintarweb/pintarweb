#!/bin/bash
# Manage WhatsApp Bot Prompts (Layer 1 & 2)
# Usage: 
#   bash scripts/manage-whatsapp-prompts.sh list                       — list all prompts
#   bash scripts/manage-whatsapp-prompts.sh list-niches              — list all niche knowledge
#   bash scripts/manage-whatsapp-prompts.sh get <type>               — get prompt (base|fallback)
#   bash scripts/manage-whatsapp-prompts.sh get-niche <niche>       — get niche knowledge (pintarweb|aircond|plumbing)
#   bash scripts/manage-whatsapp-prompts.sh update <type> "text"    — update prompt
#   bash scripts/manage-whatsapp-prompts.sh update-niche <niche> --faq-json "json" --price-json "json" --obj-json "json"

set -e

TARGET="--local"
DB_NAME="pintarweb-claude-db"

COMMAND="${1:-}"
SUBCOMMAND="${2:-}"

show_usage() {
    echo "Usage: bash scripts/manage-whatsapp-prompts.sh <command> [args]"
    echo ""
    echo "Commands:"
    echo "  list                          List all system prompts"
    echo "  list-niches                   List all niche knowledge"
    echo "  get <type>                    Get prompt (base|fallback)"
    echo "  get-niche <niche>             Get niche knowledge (pintarweb|aircond|plumbing)"
    echo "  update <type> \"text\"         Update prompt text"
    echo "  update-niche <niche> [opts]   Update niche knowledge"
    echo ""
    echo "Options for update-niche:"
    echo "  --faq-json \"json\"             FAQ JSON array"
    echo "  --price-json \"json\"           Price ranges JSON object"
    echo "  --obj-json \"json\"             Objections JSON array"
    echo ""
    echo "Examples:"
    echo "  bash scripts/manage-whatsapp-prompts.sh list"
    echo "  bash scripts/manage-whatsapp-prompts.sh get base"
    echo "  bash scripts/manage-whatsapp-prompts.sh get-niche aircond"
    echo "  bash scripts/manage-whatsapp-prompts.sh update base \"new prompt text...\""
}

case "$COMMAND" in
    list)
        echo "📋 System Prompts:"
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="SELECT id, prompt_type, version, is_active, updated_at FROM whatsapp_bot_system_prompts ORDER BY prompt_type;"
        ;;

    list-niches)
        echo "📚 Niche Knowledge:"
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="SELECT id, version, is_active, updated_at FROM whatsapp_bot_niche_knowledge ORDER BY id;"
        ;;

    get)
        if [ -z "$SUBCOMMAND" ]; then
            echo "Error: Please specify prompt type (base|fallback)"
            exit 1
        fi
        echo "📄 Prompt [$SUBCOMMAND]:"
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="SELECT prompt_text FROM whatsapp_bot_system_prompts WHERE prompt_type = '$SUBCOMMAND' AND is_active = 1 ORDER BY version DESC LIMIT 1;" 2>/dev/null | head -20
        ;;

    get-niche)
        if [ -z "$SUBCOMMAND" ]; then
            echo "Error: Please specify niche (pintarweb|aircond|plumbing)"
            exit 1
        fi
        echo "📄 Niche [$SUBCOMMAND]:"
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="SELECT faq_json, price_ranges_json, objections_json FROM whatsapp_bot_niche_knowledge WHERE id = '$SUBCOMMAND' AND is_active = 1;" 2>/dev/null
        ;;

    update)
        TYPE="$SUBCOMMAND"
        NEW_TEXT="${3:-}"
        if [ -z "$TYPE" ] || [ -z "$NEW_TEXT" ]; then
            echo "Error: Usage: update <type> \"new text\""
            exit 1
        fi

        # Escape single quotes in the text
        NEW_TEXT="${NEW_TEXT//\'/\'}"
        
        echo "Updating $TYPE prompt..."
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="
        UPDATE whatsapp_bot_system_prompts 
        SET prompt_text = '$NEW_TEXT', 
            version = version + 1, 
            updated_at = datetime('now')
        WHERE prompt_type = '$TYPE';
        "
        echo "✅ Updated $TYPE prompt (version incremented)"
        ;;

    update-niche)
        NICHE="$SUBCOMMAND"
        shift 2
        FAQ_JSON=""
        PRICE_JSON=""
        OBJ_JSON=""

        while [[ $# -gt 0 ]]; do
            case $1 in
                --faq-json)
                    FAQ_JSON="$2"
                    shift 2
                    ;;
                --price-json)
                    PRICE_JSON="$2"
                    shift 2
                    ;;
                --obj-json)
                    OBJ_JSON="$2"
                    shift 2
                    ;;
                *)
                    shift
                    ;;
            esac
        done

        if [ -z "$NICHE" ]; then
            echo "Error: Please specify niche"
            exit 1
        fi

        UPDATE_STMT="UPDATE whatsapp_bot_niche_knowledge SET version = version + 1, updated_at = datetime('now')"
        
        if [ -n "$FAQ_JSON" ]; then
            FAQ_JSON="${FAQ_JSON//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, faq_json = '$FAQ_JSON'"
        fi
        
        if [ -n "$PRICE_JSON" ]; then
            PRICE_JSON="${PRICE_JSON//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, price_ranges_json = '$PRICE_JSON'"
        fi
        
        if [ -n "$OBJ_JSON" ]; then
            OBJ_JSON="${OBJ_JSON//\'/\'}"
            UPDATE_STMT="$UPDATE_STMT, objections_json = '$OBJ_JSON'"
        fi

        UPDATE_STMT="$UPDATE_STMT WHERE id = '$NICHE';"

        echo "Updating $NICHE niche..."
        npx wrangler d1 execute "$DB_NAME" $TARGET --command="$UPDATE_STMT"
        echo "✅ Updated $NICHE niche (version incremented)"
        ;;

    help|--help|-h)
        show_usage
        ;;

    *)
        show_usage
        exit 1
        ;;
esac
