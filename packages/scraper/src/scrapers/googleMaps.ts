import { chromium } from "playwright";
import { normalizePhone, isMobilePhone } from "../utils/normalizePhone.js";

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
    facebook_url?: string | null;
    instagram_url?: string | null;
    tiktok_url?: string | null;
    email?: string | null;
    business_hours?: string | null;
    // GMB / Google Business Profile fields
    gmb_listing_found?: number;
    gmb_verification_status?: string;
    gmb_listing_complete?: number;
    gmb_photo_count?: number;
    gmb_has_hours?: number;
    gmb_has_description?: number;
    gmb_review_count?: number;
    gmb_rating?: string;
    gmb_responds_to_reviews?: number;
    gmb_attributes?: string;
    gmb_listing_url?: string;
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

                // 2. Use specific attribute selectors for Website, Phone, Category, Address, and Social
                const details = await page.evaluate(() => {
                    const webEl = document.querySelector('a[data-item-id="authority"]');
                    const phoneEl = document.querySelector('button[data-item-id^="phone:tel:"]');
                    const categoryEl = document.querySelector('button[jsaction*="category"]');
                    const addressEl = document.querySelector('button[data-item-id="address"]');
                    const fbEl = document.querySelector('a[data-item-id^="social"]');
                    const emailEl = document.querySelector('a[data-item-id^="email"]');

                    // Extract social links from page content
                    let facebookUrl = null;
                    let email = null;

                    // Find Facebook URL: prefer dedicated social link, then search page links
                    if (fbEl) {
                        const href = fbEl.getAttribute('href') || '';
                        facebookUrl = href.startsWith('http') ? href.split('?')[0] : null;
                    }
                    if (!facebookUrl) {
                        const allLinks = Array.from(document.querySelectorAll('a[href]'));
                        for (const link of allLinks) {
                            const href = link.getAttribute('href') || '';
                            // Skip Google redirect/tracking links and Maps own Facebook links
                            if (!href.includes('facebook.com')) continue;
                            if (href.includes('facebook.com/l/')) continue;          // Facebook login/tracking redirect
                            if (href.includes('facebook.com/pages/')) continue;     // Facebook internal pages
                            if (href.includes('facebook.com/ctx/')) continue;       // Facebook redirector
                            if (href.includes('l.facebook.com/')) continue;          // Facebook external redirect
                            if (href.includes('lm.facebook.com/')) continue;        // Facebook lite redirect
                            // Accept only URLs with a real page path (e.g. /BusinessName/)
                            // Reject bare /share/facebook, /plugins, /dialog paths
                            const cleanUrl = href.split('?')[0];
                            const path = cleanUrl.replace('https://www.facebook.com', '').replace('https://facebook.com', '');
                            if (path.length <= 1) continue;                        // root path = Maps' own FB link
                            if (['/share', '/plugins', '/dialog', '/sharer', '/common'].some(p => path.startsWith(p))) continue;
                            facebookUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
                            break;
                        }
                    }

                    // Find email
                    if (emailEl) {
                        const href = emailEl.getAttribute('href') || '';
                        if (href.startsWith('mailto:')) {
                            email = href.replace('mailto:', '');
                        }
                    }

                    // Fallback: search page text for email pattern
                    if (!email) {
                        const pageText = document.body.innerText;
                        const emailMatch = pageText.match(/[\w.-]+@[\w.-]+\.\w+/);
                        if (emailMatch) {
                            email = emailMatch[0].toLowerCase();
                        }
                    }

                    return {
                        website: webEl ? webEl.getAttribute('href') : null,
                        phone: phoneEl ? (phoneEl as HTMLElement).innerText : null,
                        category: categoryEl ? (categoryEl as HTMLElement).innerText : null,
                        address: addressEl ? (addressEl as HTMLElement).innerText : null,
                        facebookUrl,
                        email
                    };
                });

                const phone_normalized = details.phone ? normalizePhone(details.phone) : undefined;
                
                if (!phone_normalized || !isMobilePhone(phone_normalized)) {
                    console.log(`[!] Skipping ${business_name} - No valid mobile number for WhatsApp.`);
                    continue;
                }

                // Scroll side panel to bottom to trigger lazy-loaded Web results section
                await page.evaluate(() => {
                    const panel = document.querySelector('div[role="main"]') || document.querySelector('.m6QErb');
                    if (panel) {
                        (panel as HTMLElement).scrollTop = (panel as HTMLElement).scrollHeight;
                    }
                });
                await page.waitForTimeout(3000);

                // Extract social links from Web results (more accurate than page-level fallback)
                const webSocial = await page.evaluate(() => {
                    const result: { facebook?: string; instagram?: string; tiktok?: string } = {};
                    const headings = document.querySelectorAll('h2, h3, h4');
                    let sectionEl: Element | null = null;
                    for (const h of headings) {
                        const text = h.textContent?.toLowerCase() || '';
                        if (text.includes('web result') || text.includes('result from the web')) {
                            sectionEl = h.closest('[class]')?.parentElement || h.parentElement;
                            break;
                        }
                    }
                    if (sectionEl) {
                        const links = sectionEl.querySelectorAll('a[href]');
                        for (const link of Array.from(links)) {
                            const href = link.getAttribute('href') || '';
                            if (!href.startsWith('http')) continue;
                            const cleanUrl = href.split('?')[0];
                            if (!result.facebook && cleanUrl.includes('facebook.com/')) {
                                const p = cleanUrl.replace(/https?:\/\/(www\.)?facebook\.com/, '');
                                if (p.length > 1 && !['/share', '/l/', '/plugins', '/dialog', '/sharer', '/common'].some(x => p.startsWith(x))) {
                                    result.facebook = cleanUrl.endsWith('/') ? cleanUrl : cleanUrl + '/';
                                }
                            }
                            if (!result.instagram && cleanUrl.includes('instagram.com/')) {
                                const p = cleanUrl.replace(/https?:\/\/(www\.)?instagram\.com/, '');
                                if (p.length > 1 && !['/share', '/p/'].some(x => p.startsWith(x))) {
                                    result.instagram = cleanUrl.endsWith('/') ? cleanUrl : cleanUrl + '/';
                                }
                            }
                            if (!result.tiktok && cleanUrl.includes('tiktok.com/@')) {
                                result.tiktok = cleanUrl.endsWith('/') ? cleanUrl : cleanUrl + '/';
                            }
                        }
                    }
                    return result;
                });

                // Prefer web results social URLs (more accurate), fall back to page-level scrape
                const facebookUrl = webSocial.facebook || details.facebookUrl;
                const instagramUrl = webSocial.instagram || null;
                const tiktokUrl = webSocial.tiktok || null;

                if (business_name !== "Unknown") {
                    const lead: ExpectedLead = {
                        business_name,
                        source_origin: "Google Maps",
                        phone_normalized,
                        website_url: details.website,
                        category: details.category,
                        address: details.address,
                        maps_url: url,
                        facebook_url: facebookUrl,
                        instagram_url: instagramUrl,
                        tiktok_url: tiktokUrl,
                        email: details.email || null
                    };
                    leads.push(lead);
                    console.log(`[+] Valid Lead: ${business_name} | Phone: ${phone_normalized} | Web: ${details.website || 'None'} | FB: ${facebookUrl || 'None'} | IG: ${instagramUrl || 'None'} | TT: ${tiktokUrl || 'None'} | Email: ${details.email || 'None'}`);
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
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    (async () => {
        const data = await scrapeGoogleMaps("Plumber in Klang Valley", 5);
        console.log("Scraping Complete:", data);
    })();
}
