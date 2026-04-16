import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { to, subject, html, from_name } = await req.json();

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY not configured" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: from_name
        ? `${from_name} <notify-alisha@jvivero.com>`
        : "notify-alisha@jvivero.com",
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
