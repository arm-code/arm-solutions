"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, LayoutDashboard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
]

export function AdminSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col gap-1 px-3 py-4">
        {primaryNav.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] touch-manipulation",
                active
                  ? "bg-primary text-primary-foreground shadow-md font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", active ? "text-primary-foreground" : "")} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function AdminSidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            A
          </div>
          <span className="text-lg tracking-tight">ARM Core</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AdminSidebarContent />
      </div>

      <div className="border-t p-3 bg-muted/30">
        <div className="mb-2 px-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {user?.user_metadata?.full_name || "Administrador"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email || "admin@armsolutions.com"}
          </p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-11 rounded-xl touch-manipulation"
          onClick={signOut}
        >
          <LogOut className="h-[18px] w-[18px]" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
