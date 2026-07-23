import dashboardLayout from "../ui/dashboard.html";
import Header from "../ui/components/Header.html";
import PipelineView from "../ui/components/PipelineView.html";
import CommandCenter from "../ui/components/CommandCenter.html";
import ScorecardModal from "../ui/components/ScorecardModal.html";
import ProfilesView from "../ui/components/ProfilesView.html";
import dashboardCss from "../ui/css/dashboard.css.txt";
import dashboardJs from "../ui/js/dashboard.js.txt";
import intakeFormHtml from "../ui/intake-form.html";
import { v4 as uuidv4 } from "uuid";
import { normalizePhone } from "../utils/normalizePhone.js";
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
                const { action } = await upsertLead(env.pintarweb_scraper_db, lead);

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
                    action,
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

        // POST /api/leads/manual — Manual lead insertion (bypasses upsert score filter + background audits)
        if (url.pathname === "/api/leads/manual" && request.method === "POST") {
            try {
                const body = await request.json() as any;

                if (!body.business_name || !body.phone || !body.category) {
                    return new Response(JSON.stringify({ error: "business_name, phone, and category are required" }), { status: 400 });
                }

                const phoneNormalized = normalizePhone(body.phone);

                if (!phoneNormalized) {
                    return new Response(JSON.stringify({ error: "Invalid phone number" }), { status: 400 });
                }

                // Check for duplicate
                const existing = await env.pintarweb_scraper_db.prepare(
                    `SELECT phone_normalized FROM leads WHERE phone_normalized = ?`
                ).bind(phoneNormalized).first();

                if (existing) {
                    return new Response(JSON.stringify({ error: "Lead with this phone number already exists" }), { status: 409 });
                }

                const id = uuidv4();
                const whatsappLink = `https://wa.me/${phoneNormalized}`;

                await env.pintarweb_scraper_db.prepare(`
                    INSERT INTO leads (
                        id, phone_normalized, business_name, source_origin, website_url,
                        whatsapp_link, lead_score, address, category, status, pipeline_stage
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    id,
                    phoneNormalized,
                    body.business_name,
                    "Manual",
                    body.website_url || null,
                    whatsappLink,
                    1,
                    body.address || null,
                    body.category,
                    "New",
                    "new"
                ).run();

                return new Response(JSON.stringify({ success: true, id, phone_normalized: phoneNormalized }), {
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
                return new Response(JSON.stringify({ error: "Failed to update status" }), { status: 500 });
            }
        }

        // PATCH /api/leads/:phone/stage - advance pipeline stage
        if (url.pathname.match(/^\/api\/leads\/[^\/]+\/stage$/) && request.method === "PATCH") {
            try {
                const phone = url.pathname.split("/")[3];
                const { pipeline_stage } = await request.json() as any;
                const validStages = ["new", "images_collected", "demo_built", "audit_ready", "screenshot", "outreach_sent", "in_chat", "qualified", "payment", "active"];
                if (!validStages.includes(pipeline_stage)) {
                    return new Response(JSON.stringify({ error: "Invalid stage" }), { status: 400 });
                }
                if (pipeline_stage === "images_collected") {
                    const lead = await env.pintarweb_scraper_db.prepare(
                        `SELECT images_collected FROM leads WHERE phone_normalized = ?`
                    ).bind(phone).first() as any;
                    if (!lead || !lead.images_collected || lead.images_collected < 1) {
                        return new Response(JSON.stringify({
                            error: "Lead must have at least 1 image uploaded before advancing to images_collected stage"
                        }), { status: 400 });
                    }
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
                const { tagline, niche, services, testimonials, images_collected, facebook_url, instagram_url, tiktok_url } = await request.json() as any;
                if (images_collected !== undefined) {
                    const existing = await env.pintarweb_scraper_db.prepare(
                        `SELECT id FROM leads WHERE phone_normalized = ?`
                    ).bind(phone).first() as any;
                    if (!existing) {
                        await env.pintarweb_scraper_db.prepare(
                            `INSERT INTO leads (id, phone_normalized, lead_score, status, pipeline_stage, images_collected, updated_at)
                             VALUES (?, ?, 1, 'New', 'new', 0, CURRENT_TIMESTAMP)`
                        ).bind(crypto.randomUUID(), phone).run();
                    }
                    await env.pintarweb_scraper_db.prepare(
                        `UPDATE leads SET images_collected = ?, updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
                    ).bind(images_collected, phone).run();
                    if (images_collected > 0) {
                        const cur = await env.pintarweb_scraper_db.prepare(
                            `SELECT pipeline_stage FROM leads WHERE phone_normalized = ?`
                        ).bind(phone).first() as any;
                        if (!cur || cur.pipeline_stage === 'new' || cur.pipeline_stage === null) {
                            await env.pintarweb_scraper_db.prepare(
                                `UPDATE leads SET pipeline_stage = 'images_collected', updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
                            ).bind(phone).run();
                        }
                    }
                }
                if (tagline || niche || services || testimonials || facebook_url !== undefined || instagram_url !== undefined || tiktok_url !== undefined) {
                    // Ensure lead exists before updating (intake form may create leads not yet in D1)
                    const existing = await env.pintarweb_scraper_db.prepare(
                        `SELECT id, website_url, lead_score FROM leads WHERE phone_normalized = ?`
                    ).bind(phone).first() as any;

                    if (!existing) {
                        await env.pintarweb_scraper_db.prepare(
                            `INSERT INTO leads (id, phone_normalized, lead_score, status, pipeline_stage, images_collected, updated_at)
                             VALUES (?, ?, 1, 'New', 'new', 0, CURRENT_TIMESTAMP)`
                        ).bind(crypto.randomUUID(), phone).run();
                    }

                    // Re-fetch to get latest state (lead_score may have been set by insert)
                    const leadRow = await env.pintarweb_scraper_db.prepare(
                        `SELECT website_url, lead_score FROM leads WHERE phone_normalized = ?`
                    ).bind(phone).first() as any;

                    const hasSocial = facebook_url || instagram_url || tiktok_url;
                    const hasNoWebsite = !leadRow?.website_url || leadRow.website_url === 'null';
                    let scoreBonus = 0;

                    if (hasSocial && hasNoWebsite) {
                        scoreBonus = 3;
                    }

                    let setClause = `tagline = ?, niche = ?, services = ?, testimonials = ?, facebook_url = COALESCE(?, facebook_url), instagram_url = COALESCE(?, instagram_url), tiktok_url = COALESCE(?, tiktok_url), updated_at = CURRENT_TIMESTAMP`;
                    let bindArgs = [tagline || null, niche || null, services ? JSON.stringify(services) : null, testimonials ? JSON.stringify(testimonials) : null, facebook_url || null, instagram_url || null, tiktok_url || null];

                    if (scoreBonus > 0) {
                        setClause += `, lead_score = lead_score + ?`;
                        bindArgs.push(scoreBonus);
                    }

                    setClause += ` WHERE phone_normalized = ?`;
                    bindArgs.push(phone);

                    await env.pintarweb_scraper_db.prepare(
                        `UPDATE leads SET ${setClause}`
                    ).bind(...bindArgs).run();
                }
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

        // PATCH /api/leads/:phone/select - toggle selected_for_pipeline
        if (url.pathname.match(/^\/api\/leads\/[^\/]+\/select$/) && request.method === "PATCH") {
            try {
                const phone = url.pathname.split("/")[3];
                const { selected } = await request.json() as any;
                const val = selected ? 1 : 0;
                await env.pintarweb_scraper_db.prepare(
                    `UPDATE leads SET selected_for_pipeline = ?, updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
                ).bind(val, phone).run();
                return new Response(JSON.stringify({ success: true, selected: val }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: "Failed to toggle selection" }), { status: 500 });
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

        // GET /api/leads/:phone — single lead with all intake fields
        if (url.pathname.match(/^\/api\/leads\/[^\/]+$/) && request.method === "GET") {
            try {
                const phone = url.pathname.split("/")[3];
                const lead = await env.pintarweb_scraper_db.prepare(
                    `SELECT * FROM leads WHERE phone_normalized = ?`
                ).bind(phone).first();
                if (!lead) {
                    return new Response(JSON.stringify({ error: "Lead not found" }), { status: 404 });
                }
                return new Response(JSON.stringify(lead), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // Serve the Dashboard UI
        if (url.pathname === "/dashboard") {
            const html = (dashboardLayout as string)
                .replace("/* CSS_PLACEHOLDER */", () => dashboardCss as string)
                .replace("<!-- HEADER_COMPONENT -->", () => Header as string)
                .replace("<!-- PIPELINE_VIEW_COMPONENT -->", () => PipelineView as string)
                .replace("<!-- PROFILES_VIEW_COMPONENT -->", () => ProfilesView as string)
                .replace("<!-- COMMAND_CENTER_COMPONENT -->", () => CommandCenter as string)
                .replace("<!-- SCORECARD_MODAL_COMPONENT -->", () => ScorecardModal as string)
                .replace("/* JS_PLACEHOLDER */", () => dashboardJs as string);

            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                    "Cache-Control": "no-cache, no-store, must-revalidate"
                }
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
                const galleryFiles: File[] = [];
                for (let gi = 0; gi < 5; gi++) {
                    const f = formData.get("gallery_" + gi);
                    if (f && typeof f !== "string") galleryFiles.push(f as File);
                }
                let existingGalleryCount = 0;
                if (galleryFiles.length > 0) {
                    try {
                        const existing = await env.CLIENT_IMAGES.list({ prefix: `${leadId}/gallery-` });
                        existingGalleryCount = existing.objects.length;
                    } catch (_) {}
                }

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

                const r2Base = `https://pub-${env.CLOUDFLARE_ACCOUNT_ID || 'ACCOUNT'}.r2.dev/pintarweb-client-images`;
                const resp: Record<string, unknown> = {};

                if (galleryFiles.length > 0) {
                    results.gallery = [];
                    // Collect existing gallery URLs first so the client gets the full set
                    const allGallery = await env.CLIENT_IMAGES.list({ prefix: `${leadId}/gallery-` });
                    const existingUrls: string[] = allGallery.objects
                        .filter((o: any) => o.key !== undefined)
                        .map((o: any) => `${r2Base}/${o.key}`);
                    for (let gi = 0; gi < galleryFiles.length; gi++) {
                        const f = galleryFiles[gi];
                        const ext = f.name.split(".").pop() || "webp";
                        const key = `${leadId}/gallery-${String(existingGalleryCount + gi + 1).padStart(3, "0")}.${ext}`;
                        try {
                            await env.CLIENT_IMAGES.put(key, f.stream(), {
                                httpMetadata: { contentType: f.type }
                            });
                            (results.gallery as string[]).push(key);
                        } catch (_) {}
                    }
                    // Merge existing + new gallery URLs, deduplicate by key
                    const newUrls: string[] = (results.gallery as string[]).map((k: string) => `${r2Base}/${k}`);
                    const seen = new Set(newUrls);
                    existingUrls.forEach((u: string) => { if (!seen.has(u)) { seen.add(u); newUrls.unshift(u); } });
                    resp.gallery_urls = newUrls;
                }

                if (results.logo) resp.logo_url = `${r2Base}/${results.logo}`;
                if (results.hero) resp.hero_url = `${r2Base}/${results.hero}`;
                resp.keys = results;
                // Report total images in R2 so client can save accurate images_collected
                try {
                    const all = await env.CLIENT_IMAGES.list({ prefix: `${leadId}/` });
                    resp.total_images = all.objects.length;
                } catch (_) {}

                return new Response(JSON.stringify({ success: true, files: resp }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // GET /api/gallery/:leadId — list gallery* image URLs from R2 (excludes logo, hero)
        const galleryMatch = url.pathname.match(/^\/api\/gallery\/([^\/]+)$/);
        if (galleryMatch && request.method === "GET") {
            try {
                const leadId = decodeURIComponent(galleryMatch[1]);
                const r2Base = `https://pub-${env.CLOUDFLARE_ACCOUNT_ID || 'ACCOUNT'}.r2.dev/pintarweb-client-images`;
                const objects = await env.CLIENT_IMAGES.list({ prefix: `${leadId}/` });
                const images: { key: string; url: string }[] = objects.objects
                    .filter((o: any) => o.key && o.key.includes('gallery-'))
                    .map((o: any) => ({ key: o.key, url: `${r2Base}/${o.key}` }));
                return new Response(JSON.stringify({ images }), {
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
                    `INSERT INTO hunt_logs (id, profile_name, category, location, sources, max_leads, leads_found) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`
                ).bind(hunt.id, hunt.profile_name || null, hunt.category, hunt.location, hunt.sources, hunt.max_leads, hunt.leads_found).run();

                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // ── Profile Management ─────────────────────────────────

        // POST /api/profiles/seed — import profiles from JSON array
        if (url.pathname === "/api/profiles/seed" && request.method === "POST") {
            try {
                const profiles = await request.json() as any[];
                let count = 0;
                for (const p of profiles) {
                    const id = p.id || p.name.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
                    await env.pintarweb_scraper_db.prepare(
                        `INSERT OR REPLACE INTO hunt_profiles (id, name, label, category, location, "limit", sources, sort_order, enabled)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(id, p.name, p.label || p.name, p.category, p.location, p.limit || 50, p.sources || 'Maps,FB', count, 1).run();
                    count++;
                }
                return new Response(JSON.stringify({ success: true, count }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // GET /api/profiles — list all profiles with last-run info
        if (url.pathname === "/api/profiles" && request.method === "GET") {
            try {
                const { results } = await env.pintarweb_scraper_db.prepare(
                    `SELECT p.*, 
                        (SELECT created_at FROM hunt_logs WHERE profile_name = p.name ORDER BY created_at DESC LIMIT 1) as last_run,
                        (SELECT leads_found FROM hunt_logs WHERE profile_name = p.name ORDER BY created_at DESC LIMIT 1) as last_leads
                     FROM hunt_profiles p ORDER BY p.sort_order ASC`
                ).all();
                return new Response(JSON.stringify(results), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // POST /api/profiles — create new profile
        if (url.pathname === "/api/profiles" && request.method === "POST") {
            try {
                const p = await request.json() as any;
                const id = p.id || crypto.randomUUID();
                // get max sort_order
                const maxRow: any = await env.pintarweb_scraper_db.prepare(`SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM hunt_profiles`).first();
                const sortOrder = maxRow?.next || 0;
                await env.pintarweb_scraper_db.prepare(
                    `INSERT INTO hunt_profiles (id, name, label, category, location, "limit", sources, sort_order, enabled)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                ).bind(id, p.name, p.label || p.name, p.category, p.location, p.limit || 50, p.sources || 'Maps,FB', sortOrder, p.enabled !== undefined ? (p.enabled ? 1 : 0) : 1).run();
                return new Response(JSON.stringify({ success: true, id }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // PUT /api/profiles/reorder — bulk reorder
        if (url.pathname === "/api/profiles/reorder" && request.method === "PUT") {
            try {
                const { names } = await request.json() as { names: string[] };
                for (let i = 0; i < names.length; i++) {
                    await env.pintarweb_scraper_db.prepare(
                        `UPDATE hunt_profiles SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE name = ?`
                    ).bind(i, names[i]).run();
                }
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // PUT /api/profiles/:id — update profile
        if (url.pathname.match(/^\/api\/profiles\/[^\/]+$/) && request.method === "PUT") {
            try {
                const id = url.pathname.split("/")[3];
                if (id === 'reorder' || id === 'seed') { return new Response('Not found', { status: 404 }); }
                const p = await request.json() as any;
                // Only update fields that are provided (partial update support)
                const existing: any = await env.pintarweb_scraper_db.prepare(`SELECT * FROM hunt_profiles WHERE name = ?`).bind(id).first();
                if (!existing) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
                const label = p.label !== undefined ? p.label : existing.label;
                const category = p.category !== undefined ? p.category : existing.category;
                const location = p.location !== undefined ? p.location : existing.location;
                const lim = p.limit !== undefined ? p.limit : existing.limit;
                const sources = p.sources !== undefined ? p.sources : existing.sources;
                const enabled = p.enabled !== undefined ? (p.enabled ? 1 : 0) : existing.enabled;
                await env.pintarweb_scraper_db.prepare(
                    `UPDATE hunt_profiles SET label = ?, category = ?, location = ?, "limit" = ?, sources = ?, enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE name = ?`
                ).bind(label, category, location, lim, sources, enabled, id).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // DELETE /api/profiles/:id — delete profile
        if (url.pathname.match(/^\/api\/profiles\/[^\/]+$/) && request.method === "DELETE") {
            try {
                const id = url.pathname.split("/")[3];
                await env.pintarweb_scraper_db.prepare(`DELETE FROM hunt_profiles WHERE name = ?`).bind(id).run();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // GET /api/profiles/:id/history — get hunt history for a profile
        if (url.pathname.match(/^\/api\/profiles\/[^\/]+\/history$/) && request.method === "GET") {
            try {
                const name = url.pathname.split("/")[3];
                const { results } = await env.pintarweb_scraper_db.prepare(
                    `SELECT * FROM hunt_logs WHERE profile_name = ? ORDER BY created_at DESC LIMIT 20`
                ).bind(name).all();
                return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // GET /api/areas — return dynamic area list
        if (url.pathname === "/api/areas" && request.method === "GET") {
            const areas = [
                "Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Klang", "Subang Jaya",
                "Cheras", "Puchong", "Ampang", "Kajang", "Bangi", "Setapak",
                "Wangsa Maju", "Gombak", "Batu Caves", "Bangsar", "Mont Kiara",
                "TTDI", "Damansara", "Seri Kembangan", "Balakong", "Semenyih",
                "Putrajaya", "Cyberjaya", "Rawang", "Selayang", "Kepong",
                "Sentul", "Sri Petaling", "Old Klang Road", "Bukit Jalil",
                "Bandar Tun Razak", "Pandan Indah", "Taman Melati", "Keramat",
                "Penang", "Johor Bahru", "Melaka", "Ipoh", "Kota Kinabalu",
                "Kuching", "Seremban", "Kuantan", "Alor Setar", "Kota Bharu"
            ];
            return new Response(JSON.stringify(areas), {
                headers: { "Content-Type": "application/json" }
            });
        }

        // ── Rotation Management ───────────────────────────────

        // GET /api/rotation — get current rotation state + profile info
        if (url.pathname === "/api/rotation" && request.method === "GET") {
            try {
                const stateRow: any = await env.pintarweb_scraper_db.prepare(`SELECT current_index FROM rotation_state WHERE id = 1`).first();
                const currentIndex = stateRow?.current_index || 0;
                const { results: allProfiles } = await env.pintarweb_scraper_db.prepare(
                    `SELECT * FROM hunt_profiles WHERE enabled = 1 ORDER BY sort_order ASC`
                ).all();
                const total = allProfiles.length;
                const safeIndex = total > 0 ? currentIndex % total : 0;
                const currentProfile = total > 0 ? allProfiles[safeIndex] : null;
                const nextIndex = total > 0 ? (safeIndex + 1) % total : 0;
                const nextProfile = total > 0 ? allProfiles[nextIndex] : null;

                return new Response(JSON.stringify({
                    current_index: safeIndex,
                    total_profiles: total,
                    current_profile: currentProfile,
                    next_profile: nextProfile
                }), { headers: { "Content-Type": "application/json" } });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // POST /api/rotation — advance rotation by 1, return next profile
        if (url.pathname === "/api/rotation" && request.method === "POST") {
            try {
                const stateRow: any = await env.pintarweb_scraper_db.prepare(`SELECT current_index FROM rotation_state WHERE id = 1`).first();
                const { results: allProfiles } = await env.pintarweb_scraper_db.prepare(
                    `SELECT * FROM hunt_profiles WHERE enabled = 1 ORDER BY sort_order ASC`
                ).all();
                const total = allProfiles.length;
                const currentIndex = stateRow?.current_index || 0;
                const nextIndex = total > 0 ? (currentIndex + 1) % total : 0;
                await env.pintarweb_scraper_db.prepare(`UPDATE rotation_state SET current_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1`).bind(nextIndex).run();
                const nextProfile = total > 0 ? allProfiles[nextIndex] : null;

                return new Response(JSON.stringify({
                    success: true,
                    current_index: nextIndex,
                    total_profiles: total,
                    next_profile: nextProfile
                }), { headers: { "Content-Type": "application/json" } });
            } catch (e: any) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // PUT /api/rotation/reset — reset rotation to 0
        if (url.pathname === "/api/rotation/reset" && request.method === "PUT") {
            try {
                await env.pintarweb_scraper_db.prepare(`UPDATE rotation_state SET current_index = 0, updated_at = CURRENT_TIMESTAMP WHERE id = 1`).run();
                return new Response(JSON.stringify({ success: true, current_index: 0 }), {
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
