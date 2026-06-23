export interface AIFetchParams {
    openaiApiKey?: string;
    cloudflareAccountId?: string;
    cloudflareApiToken?: string;
}

/**
 * Passes top 3 Google Reviews to an AI model to detect standard Malaysian SME pain points.
 * 
 * @param reviews Array of up to 3 review text strings
 * @param env API Keys (OpenAI by default)
 */
export async function detectAiPainPoints(reviews: string[], env: AIFetchParams): Promise<string> {
    if (reviews.length === 0) return "No reviews available.";

    const prompt = `
You are an expert sales analyst looking at Google Reviews for a Malaysian SME.
Reviews:
${reviews.map((r, i) => `${i + 1}. "${r}"`).join("\n")}

Task: Summarize if this Malaysian business has complaints regarding 'no reply' or 'hard to find info.' 
Return only a short sales hook addressing these issues for a web development agency.
`;

    if (env.openaiApiKey) {
        return await queryOpenAI(prompt, env.openaiApiKey);
    } else if (env.cloudflareAccountId && env.cloudflareApiToken) {
        return await queryCloudflareAI(prompt, env.cloudflareAccountId, env.cloudflareApiToken);
    }

    return "AI capability not configured. Provide OPENAI_API_KEY.";
}

async function queryOpenAI(prompt: string, apiKey: string): Promise<string> {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Cost-effective model for simple summarization
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 150
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "Failed to generate hook.";
    } catch (error) {
        console.error("[AI Error]", error);
        return "Error communicating with OpenAI.";
    }
}

async function queryCloudflareAI(prompt: string, accountId: string, token: string): Promise<string> {
    try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        return data.result?.response || "Failed to generate hook via Cloudflare AI.";
    } catch (error) {
        console.error("[AI Error]", error);
        return "Error communicating with Cloudflare AI.";
    }
}

/**
 * Helper to update the lead's ai_pain_point and increment score based on insights.
 */
export async function applyAiPainPoint(db: any, phone_normalized: string, painPointText: string) {
    let scoreIncrease = 0;

    // Reward identifying actionable insights (+2)
    // Only if it's not a "no info" or "not configured" fallback message
    const skipKeywords = ["No reviews", "not configured", "Failed to generate", "Error communicating"];
    const hasInsight = !skipKeywords.some(kw => painPointText.includes(kw));

    if (hasInsight) {
        scoreIncrease = 2;
    }

    await db.prepare(
        `UPDATE leads SET ai_pain_point = ?, lead_score = lead_score + ? WHERE phone_normalized = ?`
    )
        .bind(painPointText, scoreIncrease, phone_normalized)
        .run();

    console.log(`[AI] Updated pain point for ${phone_normalized}. (Score +${scoreIncrease})`);
}
