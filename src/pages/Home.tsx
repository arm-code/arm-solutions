import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Services } from "@/components/Services"
import { Footer } from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <section id="about" className="py-20">
          <div className="container mx-auto px-4 sm:px-8 text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestra Misión</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed italic">
              "La inteligencia sin disciplina solo es arrogancia decorativa"
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              En arm-solutions, combinamos innovación técnica con una ejecución disciplinada para entregar soluciones que realmente transforman negocios.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
