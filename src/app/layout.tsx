import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/sonner"
import './globals.css'

import { Providers } from '@/lib/providers'

export const metadata: Metadata = {
  title: 'arm-solutions',
  description: 'Desarrollo de software a la medida y servicios profesionales de TI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
