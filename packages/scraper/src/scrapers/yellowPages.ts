import { chromium } from "playwright";
import { normalizePhone, isMobilePhone } from "../utils/normalizePhone.js";
import { ExpectedLead } from "./googleMaps.js";

/**
 * Searches Yellow Pages MY for business categories (e.g., "Construction" or "Home Services")
 * and extracts normalized leads.
 * 
 * @param category e.g., "Plumber"
 * @param location e.g., "Klang Valley"
 * @param maxLeads Maximum number of leads to scrape
 */
export async function scrapeYellowPages(
    category: string,
    location: string = "",
    maxLeads: number = 20
): Promise<ExpectedLead[]> {
    const leads: ExpectedLead[] = [];
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`[YellowPages Scraper] Searching for "${category}" in "${location}"...`);

    // Corrected Yellow Pages MY search URL path
    const searchUrl = `https://www.yellowpages.my/services/l?what=${encodeURIComponent(category)}&where=${encodeURIComponent(location)}`;

    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(5000); // Wait for potential captcha or initial load

    try {
        // Updated selectors based on current site layout
        await page.waitForSelector('.business-details, .listing-info, .search-result-item, .business-card', { timeout: 10000 });
    } catch (error) {
        console.warn("[YellowPages Scraper] No results found, layout changed, or Cloudflare block active.");
        await browser.close();
        return leads;
    }

    let hasNextPage = true;

    while (leads.length < maxLeads && hasNextPage) {
        // Updated listing selectors
        const cards = await page.$$('.business-details, .listing-info, .search-result-item');

        for (const card of cards) {
            if (leads.length >= maxLeads) break;

            try {
                // Extract Business Name & Profile URL
                const nameElement = await card.$('h2, h3, .company-name');
                const business_name = nameElement ? await nameElement.innerText() : "Unknown";

                const linkElement = await card.$('h2 a, h3 a, .company-name a');
                let source_url: string | null = null;
                if (linkElement) {
                    const href = await linkElement.getAttribute('href');
                    if (href) {
                        source_url = new URL(href, "https://www.yellowpages.my").href;
                    }
                }

                // Extract Website URL
                const webElement = await card.$('a[href^="http"]:not([href*="yellowpages.my"])');
                let website_url = webElement ? await webElement.getAttribute('href') : null;

                // Extract Phone. YP typically has a 'tel:' link or explicit text
                const phoneElement = await card.$('a[href^="tel:"], .phone-number');
                let rawPhone = null;
                if (phoneElement) {
                    rawPhone = await phoneElement.innerText();
                    // Fallback to exactly checking the href if text is hidden
                    if (!rawPhone || rawPhone.trim() === "") {
                        const href = await phoneElement.getAttribute('href');
                        rawPhone = href ? href.replace("tel:", "") : null;
                    }
                }

                const phone_normalized = rawPhone ? normalizePhone(rawPhone) : undefined;

                if (!phone_normalized || !isMobilePhone(phone_normalized)) {
                    console.log(`[!] Skipping YP Lead ${business_name} - No valid mobile number for WhatsApp.`);
                    continue;
                }

                // Append to leads list if we have a valid entry
                if (business_name !== "Unknown") {
                    const lead: ExpectedLead = {
                        business_name: business_name.trim(),
                        source_origin: "Yellow Pages MY",
                        phone_normalized,
                        website_url: website_url ? website_url.trim() : null,
                        source_url
                    };
                    leads.push(lead);
                    console.log(`[+] Found YP Lead: ${business_name} | Phone: ${phone_normalized || 'None'} | Web: ${website_url || 'None'}`);
                }

            } catch (err) {
                console.warn("[!] Error processing a YellowPages card:", err);
            }
        }

        if (leads.length >= maxLeads) break;

        // Check for "Next Page" pagination button
        try {
            const nextButton = await page.$('.pagination .next, a[rel="next"]');
            if (nextButton) {
                await nextButton.click();
                await page.waitForTimeout(3000); // Give time for new results to load
            } else {
                hasNextPage = false;
            }
        } catch {
            hasNextPage = false;
        }
    }

    await browser.close();
    return leads;
}

// Optional Execution Block for testing when run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    (async () => {
        const data = await scrapeYellowPages("Construction", "Klang Valley", 5);
        console.log("YellowPages Scraping Complete:", data);
    })();
}
