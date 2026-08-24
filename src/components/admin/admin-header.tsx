"use client"

import { LogOut, User, Menu } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebarContent } from "./admin-sidebar"

export function AdminHeader() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 backdrop-blur px-4 py-3 md:hidden">
      <div className="flex items-center gap-2 font-semibold">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
          A
        </div>
        <span className="text-lg tracking-tight">ARM</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Mobile Nav */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menú"
              className="h-10 w-10 rounded-xl touch-manipulation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 border-r">
            <div className="flex flex-col h-full">
              <SheetHeader className="px-5 py-4 border-b text-left">
                <SheetTitle className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold shadow-sm">
                    A
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-foreground">ARM Solutions</p>
                    <p className="text-xs text-muted-foreground font-medium">Core Panel</p>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <AdminSidebarContent onNavigate={() => setMenuOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cuenta"
              className="h-10 w-10 rounded-xl touch-manipulation"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-xl">
            <DropdownMenuLabel className="flex flex-col gap-1 p-4">
              <span className="font-semibold text-foreground text-sm">
                {user?.user_metadata?.full_name || "Administrador"}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {user?.email || "admin@armsolutions.com"}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer mx-2 mb-2 rounded-lg h-11 touch-manipulation"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
