import dashboardLayout from "../ui/dashboard.html";
import Header from "../ui/components/Header.html";
import PipelineView from "../ui/components/PipelineView.html";
import CommandCenter from "../ui/components/CommandCenter.html";
import ScorecardModal from "../ui/components/ScorecardModal.html";
import dashboardCss from "../ui/css/dashboard.css.txt";
import dashboardJs from "../ui/js/dashboard.js.txt";
import intakeFormHtml from "../ui/intake-form.html";
import { upsertLead } from "../db/upsertLead.js";
import { performTechnicalAudit, applyAuditScores } from "../workers/technicalAudit.js";
import { detectAiPainPoints, applyAiPainPoint } from "../workers/aiQualification.js";

export interface Env {
    pintarweb_scraper_db: any; // D1Database
    CLIENT_IMAGES: any;
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
                const msg = e.message?.includes("D1_ERROR") ? "Database error — check column count matches" : e.message;
                return new Response(JSON.stringify({ error: msg }), { status: 500 });
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
                return new Response(JSON.stringify({ error: "Failed to update status" }), { status: 500 });
            }
        }

        // PATCH /api/leads/:phone/stage - advance pipeline stage
        if (url.pathname.match(/^\/api\/leads\/[^\/]+\/stage$/) && request.method === "PATCH") {
            try {
                const phone = url.pathname.split("/")[3];
                const { pipeline_stage } = await request.json() as any;
                const validStages = ["new", "images_collected", "demo_ready", "demo_built", "audit_ready", "screenshot", "outreach_sent", "in_chat", "qualified", "payment", "active"];
                if (!validStages.includes(pipeline_stage)) {
                    return new Response(JSON.stringify({ error: "Invalid stage" }), { status: 400 });
                }
                await env.pintarweb_scraper_db.prepare(
                    `UPDATE leads SET pipeline_stage = ?, updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
                ).bind(pipeline_stage, phone).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: "Failed to update pipeline stage" }), { status: 500 });
            }
        }

        // PATCH /api/leads/:phone/intake - save manual intake data
        if (url.pathname.match(/^\/api\/leads\/[^\/]+\/intake$/) && request.method === "PATCH") {
            try {
                const phone = url.pathname.split("/")[3];
                const { tagline, niche, services, testimonials } = await request.json() as any;
                await env.pintarweb_scraper_db.prepare(
                    `UPDATE leads SET tagline = ?, niche = ?, services = ?, testimonials = ?, updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
                ).bind(tagline || null, niche || null, services ? JSON.stringify(services) : null, testimonials ? JSON.stringify(testimonials) : null, phone).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: "Failed to save intake data" }), { status: 500 });
            }
        }

        // PATCH /api/leads/:phone/demo - save demo URL/audit after build
        if (url.pathname.match(/^\/api\/leads\/[^\/]+\/demo$/) && request.method === "PATCH") {
            try {
                const phone = url.pathname.split("/")[3];
                const { demo_url, audit_url, screenshot_path } = await request.json() as any;
                await env.pintarweb_scraper_db.prepare(
                    `UPDATE leads SET demo_url = ?, audit_url = ?, screenshot_path = ?, demo_built_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
                ).bind(demo_url || null, audit_url || null, screenshot_path || null, phone).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: "Failed to save demo URLs" }), { status: 500 });
            }
        }

        // PATCH /api/leads/:phone/outreach - mark outreach as sent
        if (url.pathname.match(/^\/api\/leads\/[^\/]+\/outreach$/) && request.method === "PATCH") {
            try {
                const phone = url.pathname.split("/")[3];
                await env.pintarweb_scraper_db.prepare(
                    `UPDATE leads SET outreach_sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
                ).bind(phone).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: "Failed to mark outreach sent" }), { status: 500 });
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
                return new Response(JSON.stringify({ error: "Failed to delete lead" }), { status: 500 });
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

        // Serve the Intake Form (standalone, opened in new tab)
        if (url.pathname === "/clients/intake-form.html") {
            return new Response(intakeFormHtml as string, {
                headers: { "Content-Type": "text/html" }
            });
        }

        // POST /api/generate-tagline — smart template-based tagline generation
        if (url.pathname === "/api/generate-tagline" && request.method === "POST") {
            try {
                const { niche, area, business_name } = await request.json() as any;

                const NICHE_LABELS: Record<string, string[]> = {
                    'aircond-contractor': ['Servis Aircond', 'Pakar Aircond', 'Pasang Aircond', 'Aircond Profesional'],
                    'plumbing': ['Pakar Plumbing', 'Servis Paip', 'Plumber Profesional'],
                    'electrical': ['Pakar Elektrik', 'Servis Elektrik', 'Pendawaian Profesional'],
                    'renovation': ['Pakar Renovation', 'Servis Ubah Suai', 'Kontraktor Renovation'],
                    'general': ['Pakar Servis', 'Servis Profesional', 'Pakar Kontraktor']
                };

                const NICHE_SERVICES: Record<string, string[]> = {
                    'aircond-contractor': ['Aircond', 'HVAC', 'Ventilation'],
                    'plumbing': ['Paip', 'Plumbing', 'Saluran'],
                    'electrical': ['Elektrik', 'Pendawaian', 'Wiring'],
                    'renovation': ['Renovation', 'Ubah Suai', 'Interior'],
                    'general': ['Servis', 'Repair', 'Maintenance']
                };

                const SERVICE_PREPS: Record<string, string> = {
                    'aircond-contractor': ' & ',
                    'plumbing': ' & ',
                    'electrical': ' & ',
                    'renovation': ' & ',
                    'general': ' — '
                };

                const labels = NICHE_LABELS[niche] || NICHE_LABELS['general'];
                const services = NICHE_SERVICES[niche] || NICHE_SERVICES['general'];
                const prep = SERVICE_PREPS[niche] || ' & ';

                const label = labels[Math.floor(Math.abs((business_name || '').length) / labels.length) % labels.length];
                const svc = services[Math.floor(Math.abs((area || '').length) / services.length) % services.length];
                const taglineBase = `${label}${prep}${svc}`;
                const areaShort = (area || '').split(',')[0].trim();
                const tagline = areaShort ? `${taglineBase} ${areaShort}` : taglineBase;

                return new Response(JSON.stringify({ tagline }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // POST /api/upload/:leadId — handle image uploads to R2
        if (url.pathname.match(/^\/api\/upload\/[^\/]+$/) && request.method === "POST") {
            try {
                const leadId = url.pathname.split("/")[3];
                const formData = await request.formData();
                const results: Record<string, string | string[]> = {};

                const logoFile = formData.get("logo") as File | null;
                const heroFile = formData.get("hero") as File | null;
                const galleryFiles = formData.getAll("gallery") as File[];

                if (logoFile && logoFile.size > 0) {
                    const ext = logoFile.name.split(".").pop() || "webp";
                    const key = `${leadId}/logo.${ext}`;
                    await env.CLIENT_IMAGES.put(key, logoFile.stream(), {
                        httpMetadata: { contentType: logoFile.type }
                    });
                    results.logo = key;
                }

                if (heroFile && heroFile.size > 0) {
                    const ext = heroFile.name.split(".").pop() || "webp";
                    const key = `${leadId}/hero.${ext}`;
                    await env.CLIENT_IMAGES.put(key, heroFile.stream(), {
                        httpMetadata: { contentType: heroFile.type }
                    });
                    results.hero = key;
                }

                if (galleryFiles.length > 0) {
                    results.gallery = [];
                    galleryFiles.slice(0, 5).forEach((f, i) => {
                        const ext = f.name.split(".").pop() || "webp";
                        const key = `${leadId}/gallery-${String(i + 1).padStart(3, "0")}.${ext}`;
                        env.CLIENT_IMAGES.put(key, f.stream(), {
                            httpMetadata: { contentType: f.type }
                        }).catch(() => {});
                        (results.gallery as string[]).push(key);
                    });
                }

                const r2Base = `https://pub-${env.CLOUDFLARE_ACCOUNT_ID || 'ACCOUNT'}.r2.dev/pintarweb-client-images`;
                const resp: Record<string, unknown> = {};
                if (results.logo) resp.logo_url = `${r2Base}/${results.logo}`;
                if (results.hero) resp.hero_url = `${r2Base}/${results.hero}`;
                if (results.gallery) resp.gallery_urls = (results.gallery as string[]).map((k: string) => `${r2Base}/${k}`);
                resp.keys = results;

                return new Response(JSON.stringify({ success: true, files: resp }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
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
