import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="hero" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-1000">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Transformación Digital de Alto Nivel
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl max-w-4xl mx-auto">
            Impulsando el futuro con <span className="text-primary">arm-solutions</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-[700px] leading-relaxed mx-auto">
            Desarrollo de software a la medida y servicios profesionales de TI diseñados para escalar tu empresa al siguiente nivel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-base">Iniciar un Proyecto</Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">Ver Servicios</Button>
          </div>
        </div>
      </div>
      
      {/* Background patterns */}
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-80" aria-hidden="true">
        <svg fill="none" className="absolute inset-0 h-full w-full stroke-muted-foreground/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]">
          <defs>
            <pattern id="pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M.5 20V.5H20" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#pattern)" />
        </svg>
      </div>
    </section>
  )
}
