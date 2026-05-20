-- ====================================================================
-- SCRIPT DE CONFIGURACIÓN PARA SUPABASE (Esquema Personalizado: armsolutions)
-- Ejecuta este script en el editor SQL (SQL Editor) de tu panel de Supabase
-- ====================================================================

-- 1. Crear el esquema si no existe (por si acaso)
CREATE SCHEMA IF NOT EXISTS armsolutions;

-- 2. Conceder permisos de uso del esquema a los roles de Supabase
-- IMPORTANTE: Por seguridad en esquemas personalizados, PostgreSQL requiere 
-- autorizar explícitamente a los roles públicos y autenticados el acceso al esquema.
GRANT USAGE ON SCHEMA armsolutions TO anon;
GRANT USAGE ON SCHEMA armsolutions TO authenticated;
GRANT USAGE ON SCHEMA armsolutions TO service_role;

-- 3. Crear la tabla en el esquema 'armsolutions'
CREATE TABLE IF NOT EXISTS armsolutions.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL
);

-- Conceder permisos sobre la tabla a los roles correspondientes
GRANT ALL ON TABLE armsolutions.contact_messages TO service_role;
GRANT INSERT ON TABLE armsolutions.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE armsolutions.contact_messages TO authenticated;

-- 4. Habilitar la seguridad a nivel de fila (Row Level Security - RLS)
ALTER TABLE armsolutions.contact_messages ENABLE ROW LEVEL SECURITY;

-- 5. Crear la política para inserciones públicas (anónimas)
CREATE POLICY "Permitir inserciones públicas de contacto" 
ON armsolutions.contact_messages 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 6. Crear la política para lectura de usuarios autenticados
CREATE POLICY "Permitir lectura a usuarios autenticados" 
ON armsolutions.contact_messages 
FOR SELECT 
TO authenticated 
USING (true);

-- ====================================================================
-- NOTA IMPORTANTE:
-- Debes ir a tu panel web de Supabase en:
-- Settings ⚙️ > API > "Exposed schemas" 
-- e incluir "armsolutions" en la lista de esquemas expuestos por la API.
-- ====================================================================
