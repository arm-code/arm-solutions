import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Manejo de peticiones de preflight de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { name, email, message } = await req.json()

    // Validar datos de entrada
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Todos los campos (name, email, message) son obligatorios." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
    const CONTACT_TO_EMAIL = Deno.env.get("CONTACT_TO_EMAIL")

    if (!RESEND_API_KEY) {
      console.error("Falta configurar la variable RESEND_API_KEY en Supabase.")
      return new Response(
        JSON.stringify({ error: "Error de configuración interna del servidor (Resend Key)." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!CONTACT_TO_EMAIL) {
      console.error("Falta configurar la variable CONTACT_TO_EMAIL en Supabase.")
      return new Response(
        JSON.stringify({ error: "Error de configuración interna del servidor (Target Email)." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Por defecto con el dominio gratuito de Resend, el remitente debe ser 'onboarding@resend.dev'
    // Una vez que verifiques tu dominio en Resend, puedes cambiarlo a algo como 'contacto@tusolucion.com'
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev"

    console.log(`Enviando correo de ${email} a ${CONTACT_TO_EMAIL}...`)

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Contacto ARM Solutions <${FROM_EMAIL}>`,
        to: CONTACT_TO_EMAIL,
        subject: `Nuevo mensaje de contacto: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
            <h2 style="color: #0f172a; border-bottom: 1px solid #e4e4e7; padding-bottom: 10px; margin-top: 0;">Nuevo mensaje desde la web</h2>
            
            <p style="margin: 15px 0;"><strong>Nombre del remitente:</strong> ${name}</p>
            <p style="margin: 15px 0;"><strong>Correo de contacto:</strong> <a href="mailto:${email}">${email}</a></p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f4f4f5; border-radius: 6px; border-left: 4px solid #0f172a;">
              <p style="margin: 0; font-weight: bold; color: #334155; margin-bottom: 8px;">Mensaje:</p>
              <p style="margin: 0; white-space: pre-wrap; color: #0f172a; line-height: 1.5;">${message}</p>
            </div>
            
            <p style="font-size: 12px; color: #71717a; margin-top: 25px; border-top: 1px solid #e4e4e7; padding-top: 15px;">
              Este mensaje fue enviado automáticamente desde el formulario de contacto del sitio web.
            </p>
          </div>
        `,
        reply_to: email,
      }),
    })

    const resData = await res.json()

    if (!res.ok) {
      console.error("Error en la API de Resend:", resData)
      throw new Error(`Resend API Error: ${JSON.stringify(resData)}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: "Correo enviado con éxito", data: resData }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error en Edge Function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
