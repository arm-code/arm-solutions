"use client"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col md:flex-row bg-muted/20">
        <AdminSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
