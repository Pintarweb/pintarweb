import { ExpectedLead } from "../scrapers/googleMaps";
import { v4 as uuidv4 } from "uuid";

// A mock interface for D1Database or better-sqlite3 matching functions.
// In a Cloudflare Worker, `env.DB` implements this.
export interface D1DB {
    prepare(query: string): any;
}

export interface dbResult {
    id: string;
    business_name: string;
    phone_normalized: string;
    source_origin: string;
    lead_score: number;
    website_url: string | null;
}

/**
 * Upserts a lead into the D1 Database handling the de-duplication logic.
 * 
 * Rules:
 * 1. IF NEW: Create new record.
 * 2. IF EXISTS:
 *    - Append new source_origin to source_origin column.
 *    - Increase lead_score by +2.
 *    - Update website_url only if the old record missed it.
 * 
 * @param db D1Database binding instance
 * @param lead The scraped lead data
 */
export async function upsertLead(db: any, lead: ExpectedLead): Promise<void> {
    if (!lead.phone_normalized) {
        console.log(`[Skip] Lead "${lead.business_name}" has no phone number.`);
        return;
    }

    try {
        // 1. Check if the lead exists by normalized phone
        const existingResult = await db.prepare(
            `SELECT * FROM leads WHERE phone_normalized = ?`
        ).bind(lead.phone_normalized).first();

        if (!existingResult) {
            // IF NEW: Create a new record
            console.log(`[Upsert] creating NEW lead for: ${lead.business_name}`);

            // Base score is 1. If no website, add +3 bonus (Total 4).
            const newScore = (!lead.website_url || lead.website_url === 'null') ? 4 : 1;

            // Collect the initial source link
            const initialLink = lead.maps_url || lead.source_url || null;

            const insertQuery = `
        INSERT INTO leads (id, phone_normalized, business_name, source_origin, website_url, whatsapp_link, lead_score, address, category, maps_url, source_links, status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', CURRENT_TIMESTAMP)
      `;

            const whatsapp_link = `https://wa.me/${lead.phone_normalized}`;

            await db.prepare(insertQuery)
                .bind(
                    uuidv4(),
                    lead.phone_normalized,
                    lead.business_name,
                    lead.source_origin,
                    lead.website_url || null,
                    whatsapp_link,
                    newScore,
                    lead.address || null,
                    lead.category || null,
                    lead.maps_url || null,
                    initialLink
                )
                .run();

        } else {
            // IF EXISTS: Update and Reinstate
            const existingRecord: any = existingResult;

            console.log(`[Upsert] REINSTATING existing lead for: ${existingRecord.business_name}`);

            // 1. Manage Sources
            const currentSources = existingRecord.source_origin ? existingRecord.source_origin.split(",") : [];
            const hasSource = currentSources.map((s: string) => s.trim()).includes(lead.source_origin);

            let newSources = existingRecord.source_origin;
            let scoreIncrement = 0;

            if (!hasSource) {
                newSources = currentSources.concat(lead.source_origin).join(",");
                scoreIncrement = 2; // +2 for multi-source presence
            }

            // 2. Manage Source Links (Aggregate unique URLs)
            const currentLinks = existingRecord.source_links ? existingRecord.source_links.split(',').map((l: string) => l.trim()).filter(Boolean) : [];
            const newLink = lead.maps_url || lead.source_url;

            let updatedLinks = existingRecord.source_links;
            if (newLink && !currentLinks.includes(newLink.trim())) {
                const combined = [...currentLinks, newLink.trim()];
                updatedLinks = combined.join(',');
            }

            // 3. Manage Content Updates
            const shouldUpdateWeb = !existingRecord.website_url && lead.website_url;
            const finalWebsite = shouldUpdateWeb ? lead.website_url : existingRecord.website_url;

            // Prefer the newly scraped name if the old one was "Unknown"
            const finalName = (existingRecord.business_name === "Unknown" || !existingRecord.business_name)
                ? lead.business_name
                : existingRecord.business_name;

            const newScore = existingRecord.lead_score + scoreIncrement;

            const updateQuery = `
        UPDATE leads 
        SET business_name = ?, source_origin = ?, lead_score = ?, website_url = ?, address = ?, category = ?, maps_url = ?, source_links = ?, status = 'New', updated_at = CURRENT_TIMESTAMP
        WHERE phone_normalized = ?
      `;

            await db.prepare(updateQuery)
                .bind(
                    finalName,
                    newSources,
                    newScore,
                    finalWebsite,
                    lead.address || existingRecord.address,
                    lead.category || existingRecord.category,
                    lead.maps_url || existingRecord.maps_url,
                    updatedLinks,
                    lead.phone_normalized
                )
                .run();
        }
    } catch (error) {
        console.error(`[DB Error] Failed to upsert lead: ${lead.business_name}`, error);
    }
}
