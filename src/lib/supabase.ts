import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Faltan las variables de entorno de Supabase (VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY). " +
    "Por favor configúralas en tu archivo .env local o en el panel de Vercel."
  )
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  db: {
    schema: "armsolutions",
  },
})
