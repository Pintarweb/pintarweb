import { chromium } from "playwright";
import { normalizePhone, isMobilePhone } from "../utils/normalizePhone";

export interface ExpectedLead {
    business_name: string;
    source_origin: string;
    phone_normalized?: string;
    website_url?: string | null;
    rating?: string;
    reviews?: string;
    address?: string | null;
    category?: string | null;
    maps_url?: string | null;
    source_url?: string | null;
}

/**
 * Sweeps Google Maps for specific service keywords and returns structured leads.
 * 
 * @param keyword e.g., "Plumber in Klang Valley"
 * @param maxLeads Maximum number of leads to scrape
 */
export async function scrapeGoogleMaps(
    keyword: string,
    maxLeads: number = 20
): Promise<ExpectedLead[]> {
    const leads: ExpectedLead[] = [];
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`[Google Maps Scraper] Searching for "${keyword}"...`);

    // Navigate directly to the search URL to skip home page steps
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(keyword)}`;
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

    try {
        // Wait for the results pane to load. Gmaps usually places results in main role main / or a specific scrollable div.
        await page.waitForSelector('a[href*="https://www.google.com/maps/place/"]', { timeout: 15000 });
    } catch (error) {
        console.warn("[Google Maps Scraper] No results found or layout changed.");
        await browser.close();
        return leads;
    }

    // Define a set to prevent duplicates during the scroll
    const processedUrls = new Set<string>();

    // A helper function to scroll the results list pane
    const scrollResults = async () => {
        await page.evaluate(() => {
            const scrollableDiv = document.querySelector('div[role="feed"]');
            if (scrollableDiv) {
                scrollableDiv.scrollBy(0, 1000);
            }
        });
        // Wait a brief moment for new elements to render
        await page.waitForTimeout(1500);
    };

    while (leads.length < maxLeads) {
        // Select result cards - Google often uses specific classes for the result list items
        const cards = await page.$$('a[href*="/maps/place/"]');
        let newLeadsFound = false;

        for (const card of cards) {
            if (leads.length >= maxLeads) break;

            const url = await card.getAttribute('href');
            if (!url || processedUrls.has(url)) continue;

            processedUrls.add(url);
            newLeadsFound = true;

            try {
                // Scroll the element into view and click
                await card.scrollIntoViewIfNeeded();
                await card.click();
                await page.waitForTimeout(3000); // Wait for details pane to fully load

                // 1. Extract Business Name - Targeting the specific H1 within the dynamic side-panel
                const business_name = await page.evaluate(() => {
                    const heading = document.querySelector('h1.DUwDvf'); // Common GMaps title class
                    return heading ? (heading as HTMLElement).innerText.trim() : "Unknown";
                });

                if (business_name === "Results" || business_name === "Unknown") {
                    continue; // Skip noise
                }

                // 2. Use specific attribute selectors for Website, Phone, Category, and Address
                const details = await page.evaluate(() => {
                    const webEl = document.querySelector('a[data-item-id="authority"]');
                    const phoneEl = document.querySelector('button[data-item-id^="phone:tel:"]');
                    const categoryEl = document.querySelector('button[jsaction*="category"]');
                    const addressEl = document.querySelector('button[data-item-id="address"]');

                    return {
                        website: webEl ? webEl.getAttribute('href') : null,
                        phone: phoneEl ? (phoneEl as HTMLElement).innerText : null,
                        category: categoryEl ? (categoryEl as HTMLElement).innerText : null,
                        address: addressEl ? (addressEl as HTMLElement).innerText : null
                    };
                });

                const phone_normalized = details.phone ? normalizePhone(details.phone) : undefined;
                
                if (!phone_normalized || !isMobilePhone(phone_normalized)) {
                    console.log(`[!] Skipping ${business_name} - No valid mobile number for WhatsApp.`);
                    continue;
                }

                if (business_name !== "Unknown") {
                    const lead: ExpectedLead = {
                        business_name,
                        source_origin: "Google Maps",
                        phone_normalized,
                        website_url: details.website,
                        category: details.category,
                        address: details.address,
                        maps_url: url
                    };
                    leads.push(lead);
                    console.log(`[+] Valid Lead: ${business_name} | Phone: ${phone_normalized} | Web: ${details.website || 'None'}`);
                }

            } catch (err) {
                console.warn(`[!] Error processing entry:`, err);
            }
        }

        if (!newLeadsFound) {
            await scrollResults();
            const updatedCards = await page.$$('a[href*="/maps/place/"]');
            if (updatedCards.length <= processedUrls.size) break;
        }
    }

    await browser.close();
    return leads;
}

// Optional Execution Block for testing when run directly
if (require.main === module) {
    (async () => {
        const data = await scrapeGoogleMaps("Plumber in Klang Valley", 5);
        console.log("Scraping Complete:", data);
    })();
}
