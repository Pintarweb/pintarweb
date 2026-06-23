import dashboardLayout from "../ui/dashboard.html";
import Header from "../ui/components/Header.html";
import PipelineView from "../ui/components/PipelineView.html";
import CommandCenter from "../ui/components/CommandCenter.html";
import ScorecardModal from "../ui/components/ScorecardModal.html";
import dashboardCss from "../ui/css/dashboard.css.txt";
import dashboardJs from "../ui/js/dashboard.js.txt";
import { upsertLead } from "../db/upsertLead";
import { performTechnicalAudit, applyAuditScores } from "../workers/technicalAudit";
import { detectAiPainPoints, applyAiPainPoint } from "../workers/aiQualification";

export interface Env {
    pintarweb_scraper_db: any; // D1Database
    OPENAI_API_KEY?: string;
    CLOUDFLARE_ACCOUNT_ID?: string;
    CLOUDFLARE_API_TOKEN?: string;
}

export default {
    async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
        const url = new URL(request.url);

        // Endpoint to receive scraped leads
        if (url.pathname === "/api/leads" && request.method === "POST") {
            try {
                const lead = await request.json() as any;

                // 1. Perform Upsert logic in D1
                await upsertLead(env.pintarweb_scraper_db, lead);

                // 2. Fetch the newly saved structure to check its current score
                const savedRecord = await env.pintarweb_scraper_db.prepare(
                    `SELECT * FROM leads WHERE phone_normalized = ?`
                ).bind(lead.phone_normalized).first();

                // 3. Technical Audit & AI Qualification Rule: Run for all leads (score >= 1)
                if (savedRecord && savedRecord.lead_score >= 1) {

                    ctx.waitUntil((async () => {
                        console.log(`[Worker] Score > 3 for ${lead.business_name}. Initiating Background Audits...`);

                        // Run Technical Audit
                        if (savedRecord.website_url) {
                            const auditResults = await performTechnicalAudit(savedRecord.website_url);
                            await applyAuditScores(env.pintarweb_scraper_db, savedRecord.phone_normalized, auditResults);
                        }

                        // Run AI Pain Point check (Mocking 3 reviews here for the blueprint)
                        const mockReviews = [
                            "Called them but no reply for days.",
                            "Hard to find info on their pricing.",
                            "Good service but the website is confusing."
                        ];

                        // Only run AI if keys exist
                        if (env.OPENAI_API_KEY || (env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_API_TOKEN)) {
                            const painPointText = await detectAiPainPoints(mockReviews, {
                                openaiApiKey: env.OPENAI_API_KEY,
                                cloudflareAccountId: env.CLOUDFLARE_ACCOUNT_ID,
                                cloudflareApiToken: env.CLOUDFLARE_API_TOKEN
                            });
                            await applyAiPainPoint(env.pintarweb_scraper_db, savedRecord.phone_normalized, painPointText);
                        } else {
                            console.log("[Worker] Skipping AI Qualification (Keys not provided in .env)");
                        }
                    })());
                }

                // Intelligence Verification: Get current state
                const stats: any = await env.pintarweb_scraper_db.prepare("SELECT count(*) as total FROM leads").first();
                const currentRecord: any = await env.pintarweb_scraper_db.prepare("SELECT lead_score, updated_at FROM leads WHERE phone_normalized = ?").bind(lead.phone_normalized).first();

                return new Response(JSON.stringify({
                    success: true,
                    score: currentRecord ? currentRecord.lead_score : 1,
                    total: stats ? stats.total : '?',
                    updated: currentRecord ? currentRecord.updated_at : 'Now'
                }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // PATCH to update Lead Status / Archive
        if (url.pathname === "/api/leads" && request.method === "PATCH") {
            try {
                const { phone_normalized, status } = await request.json() as any;
                await env.pintarweb_scraper_db.prepare(
                    `UPDATE leads SET status = ? WHERE phone_normalized = ?`
                ).bind(status, phone_normalized).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // DELETE to permanently remove a lead
        if (url.pathname === "/api/leads" && request.method === "DELETE") {
            try {
                const { phone_normalized } = await request.json() as any;
                await env.pintarweb_scraper_db.prepare(
                    `DELETE FROM leads WHERE phone_normalized = ?`
                ).bind(phone_normalized).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // Endpoint to retrieve All Leads
        if (url.pathname === "/api/leads" && request.method === "GET") {
            const { results } = await env.pintarweb_scraper_db.prepare(
                `SELECT * FROM leads ORDER BY updated_at DESC, created_at DESC`
            ).all();

            return new Response(JSON.stringify(results), {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            });
        }

        // Serve the Dashboard UI
        if (url.pathname === "/dashboard") {
            const html = (dashboardLayout as string)
                .replace("/* CSS_PLACEHOLDER */", () => dashboardCss as string)
                .replace("<!-- HEADER_COMPONENT -->", () => Header as string)
                .replace("<!-- PIPELINE_VIEW_COMPONENT -->", () => PipelineView as string)
                .replace("<!-- COMMAND_CENTER_COMPONENT -->", () => CommandCenter as string)
                .replace("<!-- SCORECARD_MODAL_COMPONENT -->", () => ScorecardModal as string)
                .replace("/* JS_PLACEHOLDER */", () => dashboardJs as string);

            return new Response(html, {
                headers: { "Content-Type": "text/html" }
            });
        }

        // --- NEW: Hunt History Management ---

        // Record a new hunt
        if (url.pathname === "/api/hunts" && request.method === "POST") {
            try {
                const hunt = await request.json() as any;
                await env.pintarweb_scraper_db.prepare(
                    `INSERT INTO hunt_logs (id, category, location, sources, max_leads, leads_found) 
                     VALUES (?, ?, ?, ?, ?, ?)`
                ).bind(hunt.id, hunt.category, hunt.location, hunt.sources, hunt.max_leads, hunt.leads_found).run();

                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // Debug Endpoint to check DB schema
        if (url.pathname === "/api/debug-schema" && request.method === "GET") {
            try {
                const { results } = await env.pintarweb_scraper_db.prepare(`PRAGMA table_info(leads)`).all();
                return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // Retrieve all hunt history
        if (url.pathname === "/api/hunts" && request.method === "GET") {
            try {
                const { results } = await env.pintarweb_scraper_db.prepare(
                    `SELECT * FROM hunt_logs ORDER BY created_at DESC LIMIT 50`
                ).all();
                return new Response(JSON.stringify(results), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        return new Response("PintarWeb Lead Engine API Active.");
    }
};
