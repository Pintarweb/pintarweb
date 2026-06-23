import { scrapeGoogleMaps } from "./scrapers/googleMaps";

const WORKER_API_URL = "http://127.0.0.1:8787/api/leads";

async function runTestScrape() {
    const keyword = "Interior Decorator Mont Kiara";
    console.log(`\n🔍 TESTING: Starting search for 5 leads: "${keyword}"`);

    // Scrape only 5 results
    const googleLeads = await scrapeGoogleMaps(keyword, 5);

    console.log(`\n✅ Found ${googleLeads.length} leads. Piping to Worker...`);

    for (const customLead of googleLeads) {
        try {
            console.log(`=> Sending [${customLead.business_name}] to Worker API...`);
            const req = await fetch(WORKER_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customLead)
            });

            if (req.ok) {
                console.log(`   [Success] Lead accepted.`);
            } else {
                console.error(`   [Error] Engine rejected lead:`, await req.text());
            }
        } catch (e: any) {
            console.error(`   [Network Error] Is your 'wrangler dev' server running?`, e.message);
        }
    }
    console.log("\n🎯 Test Scrape Complete!");
}

runTestScrape().catch(console.error);
