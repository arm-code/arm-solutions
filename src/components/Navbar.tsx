import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <img 
            src="/images/profile-arm-solutions.png" 
            alt="arm-solutions logo" 
            className="h-8 w-8 rounded-full border border-border"
          />
          <span className="text-xl font-bold tracking-tight">arm-solutions</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#hero" className="transition-colors hover:text-foreground/80 text-foreground">Inicio</a>
          <a href="#services" className="transition-colors hover:text-foreground/80 text-muted-foreground">Servicios</a>
          <a href="#about" className="transition-colors hover:text-foreground/80 text-muted-foreground">Nosotros</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden sm:flex">Contacto</Button>
        </div>
      </div>
    </header>
  )
}
