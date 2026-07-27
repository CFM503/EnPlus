/**
 * Cloudflare Pages Function: /api/sync
 * Provides multi-device progress sync for VoiceTutor AI (PC + Mobile)
 * Supports Cloudflare KV binding (env.PROGRESS_KV) or HTTP JSON payload
 */

export async function onRequestGet({ request, env }) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
        return new Response(JSON.stringify({ error: "Missing sync token" }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }

    try {
        let data = null;
        if (env.PROGRESS_KV) {
            const kvData = await env.PROGRESS_KV.get(`user_progress_${token}`);
            if (kvData) data = JSON.parse(kvData);
        }

        return new Response(JSON.stringify({
            success: true,
            token: token,
            data: data || null,
            updatedAt: new Date().toISOString()
        }), {
            status: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store"
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}

export async function onRequestPost({ request, env }) {
    try {
        const body = await request.json();
        const { token, data } = body;

        if (!token || !data) {
            return new Response(JSON.stringify({ error: "Invalid payload" }), {
                status: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }

        if (env.PROGRESS_KV) {
            await env.PROGRESS_KV.put(`user_progress_${token}`, JSON.stringify(data));
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Progress synced to Cloudflare Edge successfully",
            token: token,
            syncedAt: new Date().toISOString()
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
