# arm-solutions

Proyecto web de **arm-solutions** — Ing. Alexis Romero Mendoza.

## Stack

- **React 19** + **Vite 7**
- **TypeScript 5.9** (strict mode)
- **Tailwind CSS v4** + tw-animate-css
- **shadcn/ui** (new-york, neutral)
- **React Router DOM v7**
- **Supabase** (Base de datos + Edge Functions)
- **Resend** (Servicio de correos transaccionales)
- **pnpm**

---

## Inicio rápido

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   pnpm install
   ```
3. Crear un archivo `.env` basado en `.env.example` y configurar tus variables de entorno locales de Supabase.
4. Levantar el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

---

## 📧 Configuración del Formulario de Contacto (Supabase + Resend)

El sitio utiliza una arquitectura híbrida donde el formulario de contacto guarda los leads en una base de datos segura y activa un envío de email automatizado en el servidor mediante una **Edge Function** de Supabase y **Resend**.

Para replicar o desplegar esta funcionalidad desde cero, sigue estos pasos:

### 1. Base de Datos (Supabase)
1. Ve al panel de Supabase > **SQL Editor** y haz clic en **New query**.
2. Copia y ejecuta el script completo que se encuentra en [supabase/migrations/20260520000000_create_contact_messages.sql](supabase/migrations/20260520000000_create_contact_messages.sql).
   * *Este script crea el esquema personalizado `armsolutions`, la tabla `contact_messages` y configura las políticas RLS para permitir inserciones públicas anónimas y restringir las lecturas.*

### 2. Habilitar el Esquema en la API de Supabase
Debido a que usamos un esquema personalizado (`armsolutions`), debes indicarle a la API de Supabase que lo exponga:
1. En tu panel de Supabase, ve a **Project Settings ⚙️** > **API**.
2. En la sección **Exposed schemas**, añade **`armsolutions`** a la lista (junto a `public`).
3. Guarda los cambios.

### 3. Configurar Secretos en Supabase
Para que la Edge Function pueda conectarse a Resend de forma segura, debes definir estas dos variables secretas. Puedes hacerlo desde la terminal ejecutando:

```bash
npx supabase secrets set RESEND_API_KEY="tu_api_key_de_resend" CONTACT_TO_EMAIL="tu_email_real@destino.com" --project-ref tu-id-de-proyecto
```
*(Reemplaza `tu_api_key_de_resend` con la clave generada en [Resend](https://resend.com), `tu-id-de-proyecto` con el ID de referencia de tu panel de Supabase y define tu dirección de correo de destino).*

> [!TIP]
> También puedes añadir estas variables visualmente desde el panel de Supabase en:
> **Project Settings ⚙️** > **Edge Functions** > **Secrets**.

### 4. Desplegar la Edge Function
Sube la lógica de envío de correos a tu Supabase en la nube con la CLI de Supabase:
1. Inicia sesión en la consola (si no lo has hecho):
   ```bash
   npx supabase login
   ```
2. Realiza el despliegue desactivando la validación JWT (ya que es una función que invocan usuarios visitantes anónimos):
   ```bash
   npx supabase functions deploy send-contact-email --no-verify-jwt --project-ref tu-id-de-proyecto
   ```

---

## 🚀 Despliegue en Producción

El proyecto está configurado para un despliegue automático continuo alojado en **Vercel** al realizar un push a la rama `main`.

Asegúrate de tener configuradas las siguientes variables de entorno en el panel de Vercel (**Settings** > **Environment Variables**):
* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`
