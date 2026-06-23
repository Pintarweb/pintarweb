export interface AuditResult {
    ssl_missing: boolean;
    mobile_response_slow: boolean; // > 4 seconds
    response_time_ms: number;
}

/**
 * Performs a technical audit on a lead's website.
 * Calculates if SSL is missing (HTTPS error) and tests basic load speed.
 * 
 * @param websiteUrl The URL to audit (e.g., http://example.com)
 */
export async function performTechnicalAudit(websiteUrl: string): Promise<AuditResult> {
    const result: AuditResult = {
        ssl_missing: false,
        mobile_response_slow: false,
        response_time_ms: 0,
    };

    if (!websiteUrl) return result;

    // Make sure we test the HTTPS version for SSL verification
    const httpsUrl = websiteUrl.replace(/^http:\/\//i, 'https://');

    const startTime = Date.now();

    try {
        // Note: We use an AbortController for a 6 second absolute timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        // We only need the headers to measure TTFB (Time To First Byte) and SSL handshake
        await fetch(httpsUrl, {
            method: 'HEAD',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        result.response_time_ms = Date.now() - startTime;
        result.ssl_missing = false; // Successfully fetched via HTTPS

    } catch (error: any) {
        // Check if the error is related to SSL/TLS or connection refused on port 443
        if (error.cause?.code === 'CERT_HAS_EXPIRED' ||
            error.cause?.code === 'ECONNREFUSED' ||
            error.message.includes('fetch failed')) {
            result.ssl_missing = true;
        }

        // If it took longer than 4 seconds before failing (or aborting)
        result.response_time_ms = Date.now() - startTime;
    }

    if (result.response_time_ms > 4000) {
        result.mobile_response_slow = true;
    }

    return result;
}

/**
 * Helper to update a lead's score and audit results in the DB after audit.
 * Uses atomic increments to prevent race conditions with other updates.
 */
export async function applyAuditScores(db: any, phone_normalized: string, audit: AuditResult) {
    let scoreIncrease = 0;
    if (audit.ssl_missing) scoreIncrease += 3;
    if (audit.mobile_response_slow) scoreIncrease += 2;

    await db.prepare(
        `UPDATE leads SET lead_score = lead_score + ?, audit_results = ? WHERE phone_normalized = ?`
    )
        .bind(scoreIncrease, JSON.stringify(audit), phone_normalized)
        .run();

    if (scoreIncrease > 0) {
        console.log(`[Audit] Updated lead ${phone_normalized} score by +${scoreIncrease}`);
    } else {
        console.log(`[Audit] Lead ${phone_normalized} passed technical checks (0 points added)`);
    }
}
