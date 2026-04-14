import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    })
  }

  const { to, subject, html, from_name } = await req.json()
  
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
  
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
  
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: from_name ? `${from_name} <onboarding@resend.dev>` : "onboarding@resend.dev",
      to,
      subject,
      html,
    }),
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : 400,
    headers: { "Content-Type": "application/json" },
  })
})