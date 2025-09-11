"use client"

import { useSession } from "next-auth/react"
import { authApi, vendorApi } from "@/lib/api"
import { useEffect, useState } from "react"

// Hook to get and manage API token
export function useApiToken() {
  const { data: session } = useSession()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check session for API token (multiple possible locations based on NextAuth config)
    if ((session as any)?.apiToken) {
      setToken((session as any).apiToken)
      return
    }
    
    if ((session as any)?.user?.token) {
      setToken((session as any).user.token)
      return
    }
    
    if ((session as any)?.token) {
      setToken((session as any).token)
      return
    }

    // Check localStorage for token
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken')
      if (storedToken) {
        setToken(storedToken)
        return
      }
    }

    setToken(null)
  }, [session])

  return token
}

// Hook for API calls with authentication
export function useApiCalls() {
  const token = useApiToken()

  const authenticatedApiCall = async <T>(
    apiFunction: (token: string) => Promise<T>
  ): Promise<T | null> => {
    if (!token) {
      throw new Error("No authentication token available")
    }

    try {
      return await apiFunction(token)
    } catch (error) {
      console.error("API call failed:", error)
      throw error
    }
  }

  return {
    token,
    getProfile: () => authenticatedApiCall(authApi.getProfile),
    updateVendor: (id: number, data: any) => 
      authenticatedApiCall((token) => vendorApi.updateVendor(id, data, token)),
  }
}
