#!/bin/sh
set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

DEPLOY_DIR="/tmp/pintarweb-landing-deploy"

echo "🔧 Injecting components into landing page..."

mkdir -p "$DEPLOY_DIR"

python3 << PYEOF
import os

repo = "$REPO_ROOT"
widget_file = os.path.join(repo, "packages/site-generator/components/bot-demo-widget/bot-demo-widget.html")
landing_file = os.path.join(repo, "packages/site-generator/landing/index.html")
deploy_file = os.path.join("$DEPLOY_DIR", "index.html")

with open(widget_file, "r") as f:
    widget = f.read()

# Extract section + script (from <section to </script>)
lines = widget.split("\n")
start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if '<section id="bot-demo"' in line:
        start_idx = i
    if start_idx is not None and line.strip() == "</script>":
        end_idx = i
        break

widget_section = "\n".join(lines[start_idx:end_idx+1])

with open(landing_file, "r") as f:
    content = f.read()

content = content.replace("<!-- {{BOT_DEMO_WIDGET}} -->", widget_section)

with open(deploy_file, "w") as f:
    f.write(content)

print("Injection complete")
PYEOF

echo "🚀 Deploying landing page to pintarweb-main (pintarweb.com)..."
npx wrangler pages deploy "$DEPLOY_DIR" \
  --project-name=pintarweb-main \
  --branch=main \
  --commit-dirty=true

echo "✅ Deployed: https://pintarweb.com"
echo "   Preview:  https://main.pintarweb-main.pages.dev"
