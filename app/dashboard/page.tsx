"use client"

import React, { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user) {
      // Check if user has a role assigned
      if (!session.user.role || session.user.role === "undefined") {
        // Redirect to role selection if no role is assigned
        router.push("/auth/select-role")
        return
      }

      // Redirect based on user role
      const userRole = session.user.role
      
      if (userRole === "VENDOR") {
        router.push("/vendor/dashboard")
      } else if (userRole === "ADMIN") {
        router.push("/admin/dashboard")
      } else if (userRole === "USER") {
        router.push("/dashboard/user") // Regular user dashboard
      } else {
        router.push("/") // Default fallback
      }
    }
  }, [session, status, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
