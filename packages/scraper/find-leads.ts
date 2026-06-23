import { scrapeGoogleMaps } from "./src/scrapers/googleMaps";
import { writeFileSync } from "fs";

async function main() {
    const category = process.argv[2] || "aircond contractor";
    const location = process.argv[3] || "Cheras";
    const limit = parseInt(process.argv[4] || "15");
    const keyword = `${category} in ${location}`;

    console.log(`Searching: "${keyword}" (limit ${limit})`);

    const leads = await scrapeGoogleMaps(keyword, limit);
    console.log(`\nFound ${leads.length} leads:\n`);

    const enriched = leads.map((l: any, i: number) => ({
        no: i + 1,
        name: l.business_name || "Unknown",
        phone: l.phone_normalized || "N/A",
        website: l.website_url || null,
        rating: l.rating || null,
        reviews: l.review_count || 0,
        address: l.address || "",
        has_website: !!l.website_url
    }));

    enriched.forEach(l => {
        console.log(`  ${l.no}. ${l.name}`);
        console.log(`     Phone: ${l.phone} | Web: ${l.has_website ? "✅" : "❌"} | ${l.website || ""}`);
        console.log(`     ${l.address}`);
        console.log();
    });

    const noWeb = enriched.filter(l => !l.has_website);
    const withWeb = enriched.filter(l => l.has_website);
    console.log(`\n📊 Summary:`);
    console.log(`  Total: ${enriched.length}`);
    console.log(`  No website: ${noWeb.length} 🔥 hot leads`);
    console.log(`  Has website: ${withWeb.length}`);
    console.log(`\n🔥 NO WEBSITE LEADS:`);
    noWeb.forEach(l => console.log(`  📞 ${l.name}: ${l.phone}`));

    const filename = `leads-${location.toLowerCase()}-${Date.now()}.json`;
    writeFileSync(filename, JSON.stringify(enriched, null, 2));
    console.log(`\nSaved to: ${filename}`);
}

main().catch(e => console.error(e));
