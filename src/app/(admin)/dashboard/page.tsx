import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Herramientas de trabajo</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de control. Aquí tienes un resumen de tus herramientas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/downloader" className="transition-transform hover:scale-[1.02]">
          <Card className="h-full border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Downloader</CardTitle>
              <Download className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mt-2 text-sm">
                Herramienta para descargar recursos. Accede para comenzar.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
