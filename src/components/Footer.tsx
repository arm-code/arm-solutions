export function Footer() {
  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/images/profile-arm-solutions.png" 
                alt="arm-solutions logo" 
                className="h-6 w-6 rounded-full"
              />
              <span className="text-lg font-bold">arm-solutions</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              Excelencia en desarrollo de software y servicios profesionales de TI.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm font-medium text-muted-foreground">
            <a href="#hero" className="hover:text-foreground transition-colors">Inicio</a>
            <a href="#services" className="hover:text-foreground transition-colors">Servicios</a>
            <a href="#about" className="hover:text-foreground transition-colors">Sobre Nosotros</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} arm-solutions. Todos los derechos reservados.
            <br />
            <span className="mt-2 inline-block">Ing. Alexis Romero Mendoza</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
