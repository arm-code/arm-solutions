"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Building2, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

// Interfaces
interface Business {
  id: string
  name: string
  slug: string
  role?: string
}

// API functions
const fetchBusinesses = async (): Promise<Business[]> => {
  const { data } = await api.get("/v1/businesses")
  return data
}

const createBusiness = async (data: { name: string; slug?: string }) => {
  const res = await api.post("/v1/businesses", data)
  return res.data
}

// Form Schema
const newBusinessSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  slug: z.string().optional(),
})

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  
  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: fetchBusinesses,
  })

  const form = useForm<z.infer<typeof newBusinessSchema>>({
    resolver: zodResolver(newBusinessSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  const createMutation = useMutation({
    mutationFn: createBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] })
      setIsDialogOpen(false)
      form.reset()
      toast.success("Negocio creado exitosamente")
    },
    onError: (error: any) => {
      toast.error("Error al crear negocio", {
        description: error.message
      })
    }
  })

  const onSubmit = (values: z.infer<typeof newBusinessSchema>) => {
    createMutation.mutate({
      name: values.name,
      slug: values.slug || undefined,
    })
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Negocios (Tenants)</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los clientes y espacios de trabajo del sistema.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Negocio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear un nuevo negocio</DialogTitle>
              <DialogDescription>
                Se aprovisionará automáticamente el catálogo base y te asignarás como administrador.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Negocio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Eventos Mendoza" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="ej. eventos-mendoza" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Dejar en blanco para autogenerar desde el nombre.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Crear e inicializar"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : businesses?.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
          <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No hay negocios registrados</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            Aún no administras ningún negocio. Crea el primero para comenzar a operar la plataforma.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Crear mi primer negocio
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses?.map((b) => (
            <Card key={b.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{b.name}</CardTitle>
                      <CardDescription className="text-xs font-mono mt-1">
                        {b.slug}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <div className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full font-medium">
                    Rol: {b.role || 'admin'}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Abrir <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
