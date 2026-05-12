import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Server, Smartphone, Globe } from "lucide-react"

const services = [
  {
    title: "Software a la Medida",
    description: "Desarrollamos soluciones únicas que se adaptan perfectamente a los procesos de tu negocio.",
    icon: Code,
  },
  {
    title: "Servicios de TI",
    description: "Mantenimiento, soporte y consultoría profesional para mantener tu infraestructura al día.",
    icon: Server,
  },
  {
    title: "Aplicaciones Móviles",
    description: "Creamos experiencias móviles fluidas y potentes para iOS y Android.",
    icon: Smartphone,
  },
  {
    title: "Desarrollo Web",
    description: "Sitios y aplicaciones web modernas, rápidas y optimizadas para SEO.",
    icon: Globe,
  }
]

export function Services() {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros Servicios</h2>
          <p className="text-muted-foreground max-w-[600px]">
            Soluciones tecnológicas integrales para enfrentar los retos del mundo digital.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="border-border/50 bg-background/50 backdrop-blur transition-all hover:shadow-md hover:-translate-y-1">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
