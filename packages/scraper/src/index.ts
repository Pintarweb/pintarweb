import { scrapeGoogleMaps } from "./scrapers/googleMaps";
import { scrapeFacebook } from "./scrapers/facebook";
import { scrapeYellowPages } from "./scrapers/yellowPages";
import { v4 as uuidv4 } from "uuid";

const WORKER_API_URL = "http://localhost:8787/api/leads";

/**
 * CLI Argument Parser Helper
 */
function getArg(name: string, fallback: string): string {
    const idx = process.argv.indexOf(name);
    return (idx !== -1 && process.argv[idx + 1]) ? process.argv[idx + 1] : fallback;
}

/**
 * Logs the hunt results to the central Campaign Vault (D1 via Worker)
 */
async function logHunt(data: any) {
    try {
        await fetch("http://localhost:8787/api/hunts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: uuidv4(),
                ...data
            })
        });
    } catch (e) {
        console.warn("[Log] Failed to record hunt history to DB.");
    }
}

/**
 * The Systematic Master Engine
 */
async function runEngine() {
    console.log("🚀 PintarWeb Diamond Commander Active...");

    // 1. Parsing Tactical Parameters from CLI
    const category = getArg("--category", "Interior Decorator");
    const location = getArg("--location", "Mont Kiara");
    const maxPerSource = parseInt(getArg("--limit", "5"));
    const sourcesStr = getArg("--sources", "Maps,FB"); // Removed YP to avoid ban risk
    const selectedSources = sourcesStr.split(/[,\s]+/).map(s => s.trim()).filter(s => !!s);

    const fullKeyword = `${category} in ${location}`;
    console.log(`📡 MISSION: [${category}] @ [${location}] | Limit: ${maxPerSource}/source | Sources: ${sourcesStr}`);

    let totalNewCaptured = 0;
    const allCaptured: any[] = [];

    // 2. Multi-Channel Intelligence Sweep
    if (selectedSources.includes("Maps")) {
        console.log(`📍 Hunting GOOGLE MAPS...`);
        const leads = await scrapeGoogleMaps(fullKeyword, maxPerSource);
        allCaptured.push(...leads);
    }

    if (selectedSources.includes("FB")) {
        console.log(`📱 Hunting FACEBOOK PAGES...`);
        const leads = await scrapeFacebook(fullKeyword, maxPerSource);
        allCaptured.push(...leads);
    }

    if (selectedSources.includes("YP")) {
        console.log(`📖 Hunting YELLOW PAGES...`);
        const leads = await scrapeYellowPages(category, location, maxPerSource);
        allCaptured.push(...leads);
    }

    console.log(`\n✅ Sweep Complete. Found ${allCaptured.length} raw results. Piping to Intelligence Engine...`);

    // 3. Piping to Worker (Triggering Audits & AI)
    for (const lead of allCaptured) {
        try {
            process.stdout.write(`=> Deploying [${lead.business_name}]... `);
            const res = await fetch(WORKER_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lead)
            });
            if (res.ok) {
                const data = await res.json() as any;
                console.log(`✅ OK [Score: ${data.score} | DB Total: ${data.total}]`);
                totalNewCaptured++;
            } else {
                const txt = await res.text();
                console.log(`❌ FAILED (${res.status}): ${txt.substring(0, 50)}`);
            }
        } catch (e: any) {
            console.log(`❌ SYNC ERROR: ${e.message} (Is 'npx wrangler dev' running on port 8787?)`);
        }
    }

    // 4. Update the Campaign Vault
    await logHunt({
        category,
        location,
        sources: sourcesStr,
        max_leads: maxPerSource,
        leads_found: allCaptured.length
    });

    console.log(`\n🎯 Mission Success! Processed ${allCaptured.length} leads.`);
    console.log(`💡 Usage: npx tsx src/index.ts --category "Plumber" --location "KL" --limit 10 --sources "Maps,FB"`);
}

runEngine().catch(console.error);
