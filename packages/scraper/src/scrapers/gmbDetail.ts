import { chromium } from "playwright";

export interface GMBData {
    listingFound: boolean;
    verificationStatus: "none" | "unverified" | "pending" | "verified";
    listingComplete: boolean;
    photoCount: number;
    hasHours: boolean;
    hasDescription: boolean;
    reviewCount: number;
    rating: string;
    respondsToReviews: boolean;
    attributes: Record<string, string>;
    listingUrl: string;
}

function defaultGMBData(listingUrl: string): GMBData {
    return {
        listingFound: false,
        verificationStatus: "none",
        listingComplete: false,
        photoCount: 0,
        hasHours: false,
        hasDescription: false,
        reviewCount: 0,
        rating: "0",
        respondsToReviews: false,
        attributes: {},
        listingUrl
    };
}

/**
 * Scrapes detailed GMB (Google Business Profile) data from a Google Maps listing URL.
 *
 * @param mapsUrl Google Maps place URL (e.g., https://www.google.com/maps/place/...)
 * @param timeout Optional timeout in ms (default 30000)
 */
export async function scrapeGMBDetail(
    mapsUrl: string,
    timeout: number = 30000
): Promise<GMBData> {
    const data = defaultGMBData(mapsUrl);

    if (!mapsUrl || !mapsUrl.includes("google.com/maps")) {
        console.warn("[GMB Scraper] Invalid maps URL provided.");
        return data;
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`[GMB Scraper] Scraping GMB details from: ${mapsUrl}`);

    try {
        await page.goto(mapsUrl, { waitUntil: "domcontentloaded", timeout });

        // Wait for the business name heading to appear — indicates listing loaded
        try {
            await page.waitForSelector("h1.DUwDvf", { timeout: 10000 });
        } catch {
            console.warn("[GMB Scraper] No business listing found at this URL.");
            await browser.close();
            return data;
        }

        // Listing found — business name loaded successfully
        data.listingFound = true;

        // Extract verification status
        data.verificationStatus = await extractVerificationStatus(page);

        // Extract basic info: hours, description, photos, reviews, rating
        data.hasHours = await extractHours(page);
        data.hasDescription = await extractDescription(page);
        data.photoCount = await extractPhotoCount(page);
        data.reviewCount = await extractReviewCount(page);
        data.rating = await extractRating(page);
        data.respondsToReviews = await extractRespondsToReviews(page);
        data.attributes = await extractAttributes(page);

        // Determine listing completeness
        data.listingComplete =
            data.hasHours === true &&
            data.hasDescription === true &&
            data.photoCount >= 3;

        console.log(`[GMB Scraper] Found: ${data.listingFound}, Verified: ${data.verificationStatus}, Complete: ${data.listingComplete}`);

    } catch (error) {
        console.error("[GMB Scraper] Error during scraping:", error);
    } finally {
        await browser.close();
    }

    return data;
}

async function extractVerificationStatus(page: any): Promise<"none" | "unverified" | "pending" | "verified"> {
    try {
        const pageContent = await page.content();

        // Check for "Verified" badge
        if (pageContent.includes("Verified") || pageContent.includes("TERVERIFIKASI")) {
            return "verified";
        }

        // Check for "Verify now" or "Verification pending" or postcard notice
        if (
            pageContent.includes("Verify now") ||
            pageContent.includes("verification") ||
            pageContent.includes("pending") ||
            pageContent.includes("postcard")
        ) {
            return "pending";
        }

        // Check for unverified indicator
        if (pageContent.includes("unverified") || pageContent.includes("tidak disahkan")) {
            return "unverified";
        }

        // If listing exists and has reviews/rating, it's likely verified
        const ratingEl = await page.$("span[class*='rating']");
        if (ratingEl) {
            return "verified";
        }
    } catch (e) {
        // ignore
    }
    return "none";
}

async function extractHours(page: any): Promise<boolean> {
    try {
        // Look for opening hours button or element
        const hoursBtn = await page.$('button[data-item-id="opening-hours"]');
        const hoursSection = await page.$("text=/jam|hours|buka|tutup/i");
        if (hoursBtn || hoursSection) {
            return true;
        }
    } catch (e) {
        // ignore
    }
    return false;
}

async function extractDescription(page: any): Promise<boolean> {
    try {
        // Look for business description section
        // GMaps shows "About" section with description text
        const aboutSection = await page.$("div[class*='fontBodyMedium']");
        if (aboutSection) {
            const text = await aboutSection.innerText();
            if (text.length > 50) {
                return true;
            }
        }
    } catch (e) {
        // ignore
    }
    return false;
}

async function extractPhotoCount(page: any): Promise<number> {
    try {
        // Look for photo count near the photos tab or section
        const photoMatch = await page.evaluate(() => {
            const text = document.body.innerText;
            // Match patterns like "203 fotos" or "100+ photos"
            const match = text.match(/(\d[\d,]*)\s*(?:foto|photo)/i);
            return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
        });
        return photoMatch;
    } catch (e) {
        return 0;
    }
}

async function extractReviewCount(page: any): Promise<number> {
    try {
        // Try multiple selectors for review count
        const reviewEl = await page.$("span[class*='reviewCount']");
        if (reviewEl) {
            const text = await reviewEl.innerText();
            const match = text.match(/(\d[\d,]*)/);
            if (match) {
                return parseInt(match[1].replace(/,/g, ""), 10);
            }
        }

        // Fallback: look for "X reviews" or "X ulasan" text pattern
        const count = await page.evaluate(() => {
            const text = document.body.innerText;
            const match = text.match(/(\d[\d,]*)\s*(?:review|ulasan)/i);
            return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
        });
        return count;
    } catch (e) {
        return 0;
    }
}

async function extractRating(page: any): Promise<string> {
    try {
        // Try to find rating value
        const ratingEl = await page.$("span[class*='rating']");
        if (ratingEl) {
            const text = await ratingEl.innerText();
            const match = text.match(/(\d+\.?\d*)/);
            if (match) {
                return match[1];
            }
        }

        // Fallback: look for star rating pattern in content
        const rating = await page.evaluate(() => {
            const text = document.body.innerText;
            // Match patterns like "4.5" near the word "star" or "★"
            const match = text.match(/(\d+\.?\d*)\s*(?:★|star)/i);
            return match ? match[1] : "0";
        });
        return rating !== "0" ? rating : "0";
    } catch (e) {
        return "0";
    }
}

async function extractRespondsToReviews(page: any): Promise<boolean> {
    try {
        // Look for owner replies in reviews section
        // Owner replies typically have "Reply by..." or "Responded by..." label
        const pageContent = await page.content();
        if (
            pageContent.includes("Responded") ||
            pageContent.includes("Replied") ||
            pageContent.includes("Responded by") ||
            pageContent.includes("Owner")
        ) {
            return true;
        }
    } catch (e) {
        // ignore
    }
    return false;
}

async function extractAttributes(page: any): Promise<Record<string, string>> {
    const attrs: Record<string, string> = {};
    try {
        // Look for attribute buttons/elements on GMB listing
        const attributeEls = await page.$$('button[data-item-id^="attributes."]');
        for (const el of attributeEls) {
            const text = await el.innerText();
            if (text) {
                // Extract label from text like "Wheelchair accessible: Yes"
                const parts = text.split(":");
                if (parts.length >= 2) {
                    const key = parts[0].trim().toLowerCase().replace(/\s+/g, "_");
                    attrs[key] = parts[1].trim();
                } else {
                    attrs[text.trim().toLowerCase().replace(/\s+/g, "_")] = "true";
                }
            }
        }

        // Also search for common attributes by text pattern
        const commonAttrs = [
            "wheelchair",
            "parking",
            "payment",
            "mask",
            "service",
        ];
        const pageText = await page.evaluate(() => document.body.innerText.toLowerCase());
        for (const attr of commonAttrs) {
            if (pageText.includes(attr)) {
                attrs[attr] = "true";
            }
        }
    } catch (e) {
        // ignore
    }
    return attrs;
}

// Optional Execution Block for testing when run directly
if (require.main === module) {
    (async () => {
        // Test with a sample Google Maps URL
        const testUrl = process.argv[2] || "https://www.google.com/maps/place/Example+Business";
        const result = await scrapeGMBDetail(testUrl);
        console.log("GMB Data:", JSON.stringify(result, null, 2));
    })();
}
