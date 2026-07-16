import { chromium } from "playwright";
import { normalizePhone, isMobilePhone } from "../utils/normalizePhone.js";
import { ExpectedLead } from "./googleMaps.js";

export interface FacebookLead extends ExpectedLead {
    wa_flagged?: boolean; // If website is empty or wa.me
    instagram_url?: string | null;
    tiktok_url?: string | null;
    email?: string | null;
}

/**
 * Searches Facebook for pages by service keyword and extracts their About section info.
 * 
 * @param keyword e.g., "Aircond Klang Valley"
 * @param maxLeads Maximum number of leads to scrape
 */
export async function scrapeFacebook(
    keyword: string,
    maxLeads: number = 10
): Promise<FacebookLead[]> {
    const leads: FacebookLead[] = [];
    const browser = await chromium.launch({ headless: true });

    try {
        // Facebook strictly blocks obvious headless browsers.
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1280, height: 720 }
        });
        const page = await context.newPage();

        let urlsToScan: string[] = [];
        const processedUrls = new Set<string>();

        // Strategy 1: Facebook Public Directory (Direct, but sometimes noisy)
        console.log(`[Facebook Scraper] Hunting for "${keyword}" via Public Directory...`);
        const cleanKeyword = keyword.replace(/[^\w\s]/g, "").replace(/\s+/g, '-');
        const searchUrl = `https://www.facebook.com/public/${cleanKeyword}`;

        await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForTimeout(3000);

        const pageLinks = await page.$$('a._32mo');
        for (const link of pageLinks) {
            let url = await link.getAttribute("href");
            if (url && url.includes("facebook.com/") && !processedUrls.has(url)) {
                const lv = url.toLowerCase();
                if (lv.includes('/groups/') || lv.includes('/posts/') || lv.includes('/help/') || lv.includes('/search/')) continue;
                url = url.split("?")[0];
                if (!url.endsWith('/')) url += '/';
                urlsToScan.push(url);
                processedUrls.add(url);
            }
        }

        // Strategy 2: Google Discovery (Fallback, more precise business pages)
        if (urlsToScan.length < 3) {
            console.log("[ ] Low yield from Directory. Activating Google Discovery Fallback...");
            const googleUrl = `https://www.google.com/search?q=site:facebook.com+"${encodeURIComponent(keyword)}" + -groups + -posts`;
            try {
                await page.goto(googleUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
                await page.waitForTimeout(2000);
                const googleLinks = await page.$$('a[href*="facebook.com/"]');
                for (const link of googleLinks) {
                    let url = await link.getAttribute("href");
                    if (url && !processedUrls.has(url)) {
                        const lv = url.toLowerCase();
                        if (lv.includes('google.com') || lv.includes('/groups/') || lv.includes('/posts/') || lv.includes('/help/')) continue;
                        url = url.split("?")[0];
                        if (!url.endsWith('/')) url += '/';
                        urlsToScan.push(url);
                        processedUrls.add(url);
                    }
                }
            } catch (e) {
                console.log("[!] Google Discovery blocked or failed.");
            }
        }

        console.log(`[Facebook Scraper] Found ${urlsToScan.length} potential targets. Scanning up to ${maxLeads} leads...`);

        for (const url of urlsToScan) {
            if (leads.length >= maxLeads) break;

            const newPage = await context.newPage();
            try {
                console.log(`[+] Scanning: ${url}`);
                // Wait for 'networkidle' for FB as it is heavily dynamic
                await newPage.goto(url, { waitUntil: "networkidle", timeout: 45000 });
                await newPage.waitForTimeout(3000);

                let pageContent = await newPage.evaluate(() => document.body.innerText);

                // If phone not found on main page, check /about
                const phoneRegex = /((?:\+60|60|0)(?:\s?\d{1,2}[\-\s]?\d{3,4}[\-\s]?\d{3,4}))/g;
                if (!pageContent.match(phoneRegex)) {
                    await newPage.goto(`${url}about`, { waitUntil: "networkidle", timeout: 20000 });
                    await newPage.waitForTimeout(3000);
                    pageContent += "\n" + await newPage.evaluate(() => document.body.innerText);
                }

                let website_url: string | null = null;
                let wa_flagged = true;

                const webMatch = pageContent.match(/([\w-]+\.(?:com\.my|com|my|net|org)[^\s]*)/i);
                if (webMatch && !webMatch[1].toLowerCase().includes("facebook.com")) {
                    const domain = webMatch[1].trim().toLowerCase();
                    if (domain.includes("wa.me") || domain.includes("whatsapp.com")) {
                        website_url = `https://${domain}`;
                    } else {
                        website_url = `http://${domain}`;
                        wa_flagged = false;
                    }
                }

                let rawPhone = null;
                let phone_normalized: string | undefined = undefined;
                const phoneMatch = pageContent.match(phoneRegex);
                if (phoneMatch && phoneMatch.length > 0) {
                    // Filter out candidates that aren't phone numbers (at least 8 digits)
                    const validPhones = phoneMatch.filter(p => p.replace(/\D/g, '').length >= 8);
                    // Prioritize and extract mobile numbers for WhatsApp
                    for (const p of validPhones) {
                        const norm = normalizePhone(p);
                        if (isMobilePhone(norm)) {
                            rawPhone = p;
                            phone_normalized = norm;
                            break;
                        }
                    }
                }

                // Extract Instagram URL
                let instagram_url: string | null = null;
                const instagramMatch = pageContent.match(/(?:instagram\.com\/|@)(\w{2,30})/i);
                if (instagramMatch) {
                    const handle = instagramMatch[1];
                    instagram_url = `https://instagram.com/${handle.replace('@', '')}`;
                }

                // Extract TikTok URL
                let tiktok_url: string | null = null;
                const tiktokMatch = pageContent.match(/(?:tiktok\.com\/@|@)(\w{2,30})/i);
                if (tiktokMatch) {
                    const handle = tiktokMatch[1];
                    tiktok_url = `https://tiktok.com/@${handle.replace('@', '')}`;
                }

                // Extract email
                let email: string | null = null;
                const emailMatch = pageContent.match(/[\w.-]+@[\w.-]+\.\w+/i);
                if (emailMatch) {
                    email = emailMatch[0].toLowerCase();
                }

                if (!phone_normalized) {
                    console.warn(`[!] Skipping ${url}: No valid mobile number found for WhatsApp.`);
                    continue;
                }

                const fullTitle = await newPage.title();
                const business_name = fullTitle.replace(/\|.+|Facebook|Log in|Sign up/ig, "").trim() || "Unknown Page";

                if (business_name !== "Unknown Page") {
                    const lead: FacebookLead = {
                        business_name,
                        source_origin: "Facebook Pages",
                        phone_normalized,
                        website_url,
                        wa_flagged,
                        source_url: url,
                        facebook_url: url,
                        instagram_url,
                        tiktok_url,
                        email
                    };
                    leads.push(lead);
                    console.log(`[+] Found FB Lead: ${business_name} | Phone: ${phone_normalized} | IG: ${instagram_url || 'None'} | TT: ${tiktok_url || 'None'} | Email: ${email || 'None'}`);
                }

            } catch (err: any) {
                console.warn(`[!] Skipping ${url}: ${err.message.split('\n')[0]}`);
            } finally {
                await newPage.close();
            }
        }
    } catch (error) {
        console.error("[Facebook Scraper] Critical error in search processing:", error);
    } finally {
        await browser.close();
    }

    return leads;
}

// Optional Execution Block for testing when run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    (async () => {
        const data = await scrapeFacebook("Aircond Klang Valley", 3);
        console.log("FB Scraping Complete:", data);
    })();
}
