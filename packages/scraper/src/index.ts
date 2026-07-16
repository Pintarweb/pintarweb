import { scrapeGoogleMaps } from "./scrapers/googleMaps.js";
import { scrapeFacebook } from "./scrapers/facebook.js";
import { scrapeYellowPages } from "./scrapers/yellowPages.js";
import { scrapeGMBDetail } from "./scrapers/gmbDetail.js";
import { v4 as uuidv4 } from "uuid";

const WORKER_HOST = process.argv.includes("--remote")
    ? "https://pintarweb-scraper.yusmarin.workers.dev"
    : "http://localhost:8787";
const WORKER_API_URL = WORKER_HOST + "/api/leads";

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
        await fetch(WORKER_HOST + "/api/hunts", {
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
    let totalExistingSkipped = 0;
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

    // 2.5 Enrich Google Maps leads with GMB detail data
    console.log(`\n🔍 Enriching Google Maps leads with GMB data...`);
    for (const lead of allCaptured) {
        if (lead.maps_url && lead.source_origin === "Google Maps") {
            try {
                const gmbData = await scrapeGMBDetail(lead.maps_url);
                lead.gmb_listing_found = gmbData.listingFound ? 1 : 0;
                lead.gmb_verification_status = gmbData.verificationStatus;
                lead.gmb_listing_complete = gmbData.listingComplete ? 1 : 0;
                lead.gmb_photo_count = gmbData.photoCount;
                lead.gmb_has_hours = gmbData.hasHours ? 1 : 0;
                lead.gmb_has_description = gmbData.hasDescription ? 1 : 0;
                lead.gmb_review_count = gmbData.reviewCount;
                lead.gmb_rating = gmbData.rating;
                lead.gmb_responds_to_reviews = gmbData.respondsToReviews ? 1 : 0;
                lead.gmb_attributes = JSON.stringify(gmbData.attributes);
                lead.gmb_listing_url = gmbData.listingUrl;
                lead.business_hours = gmbData.businessHours ? JSON.stringify(gmbData.businessHours) : null;
            } catch (e) {
                console.warn(`[GMB] Failed to scrape GMB for ${lead.business_name}:`, e);
            }
        }
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
                if (data.action === 'created') {
                    console.log(`✅ NEW [Score: ${data.score} | DB Total: ${data.total}]`);
                    totalNewCaptured++;
                } else {
                    console.log(`⏭️ EXISTS [Score: ${data.score} | DB Total: ${data.total}]`);
                    totalExistingSkipped++;
                }
            } else {
                const txt = await res.text();
                console.log(`❌ FAILED (${res.status}): ${txt.substring(0, 50)}`);
            }
        } catch (e: any) {
            console.log(`❌ SYNC ERROR: ${e.message} (Is 'npx wrangler dev' running on port 8787? Or use --remote for production API)`);
        }
    }

    // 4. Update the Campaign Vault
    const profileName = getArg("--profile", "");
    await logHunt({
        profile_name: profileName || undefined,
        category,
        location,
        sources: sourcesStr,
        max_leads: maxPerSource,
        leads_found: allCaptured.length
    });

    console.log(`\n🎯 Mission Success! ${totalNewCaptured} new + ${totalExistingSkipped} existing = ${allCaptured.length} total leads.`);
    console.log(`💡 Usage: npx tsx src/index.ts --category "Plumber" --location "KL" --limit 10 --sources "Maps,FB"`);
    console.log(`   └─ Add --remote to send to production D1 (no wrangler dev needed)`);
}

runEngine().catch(console.error);
