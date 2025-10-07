"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CheckCircle, XCircle, User, MapPin, Globe, Phone, Mail } from "lucide-react"
import toast from "react-hot-toast"

interface Vendor {
  id: number
  businessName: string
  location: string
  bio: string
  websiteUrl?: string[]
  profilePictureUrl?: string
  email: string
  phoneNumber?: string
  isApproved: boolean
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function VendorApproval() {
  const { data: session } = useSession()
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }
    fetchVendors()
  }, [session, router])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vendors', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setVendors(data)
      } else {
        toast.error('Failed to fetch vendors')
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (vendorId: number) => {
    try {
      setProcessing(vendorId)
      const response = await fetch(`/api/vendor-verification/approve/${vendorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success('Vendor approved successfully')
        // Update local state
        setVendors(vendors.map(vendor => 
          vendor.id === vendorId 
            ? { ...vendor, isApproved: true }
            : vendor
        ))
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to approve vendor')
      }
    } catch (error) {
      console.error('Error approving vendor:', error)
      toast.error('Network error')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (vendorId: number) => {
    try {
      setProcessing(vendorId)
      const response = await fetch(`/api/vendor-verification/reject/${vendorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Profile does not meet our requirements' }),
      })

      if (response.ok) {
        toast.success('Vendor rejected')
        // Update local state
        setVendors(vendors.map(vendor => 
          vendor.id === vendorId 
            ? { ...vendor, isApproved: false }
            : vendor
        ))
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to reject vendor')
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error)
      toast.error('Network error')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const pendingVendors = vendors.filter(v => !v.isApproved)
  const approvedVendors = vendors.filter(v => v.isApproved)

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Vendor Approval</h1>
          <p className="text-muted-foreground">
            Review and approve vendor applications
          </p>
        </div>

        <div className="grid gap-6">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals ({pendingVendors.length})</CardTitle>
              <CardDescription>
                Vendors waiting for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingVendors.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending vendor applications
                </p>
              ) : (
                <div className="grid gap-4">
                  {pendingVendors.map((vendor) => (
                    <Card key={vendor.id} className="border-orange-200">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={vendor.profilePictureUrl} />
                            <AvatarFallback>
                              <User className="h-8 w-8" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold">{vendor.businessName}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {vendor.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Mail className="h-4 w-4 mr-1" />
                                    {vendor.email}
                                  </div>
                                  {vendor.phoneNumber && (
                                    <div className="flex items-center">
                                      <Phone className="h-4 w-4 mr-1" />
                                      {vendor.phoneNumber}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(vendor.id)}
                                  disabled={processing === vendor.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {processing === vendor.id ? (
                                    <LoadingSpinner size="sm" className="mr-2" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  )}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(vendor.id)}
                                  disabled={processing === vendor.id}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-sm">{vendor.bio}</p>
                            </div>
                            
                            {vendor.websiteUrl && vendor.websiteUrl.length > 0 && (
                              <div className="mt-2">
                                <a
                                  href={vendor.websiteUrl[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center"
                                >
                                  <Globe className="h-4 w-4 mr-1" />
                                  {vendor.websiteUrl[0]}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approved Vendors */}
          <Card>
            <CardHeader>
              <CardTitle>Approved Vendors ({approvedVendors.length})</CardTitle>
              <CardDescription>
                Recently approved vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approvedVendors.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No approved vendors yet
                </p>
              ) : (
                <div className="grid gap-4">
                  {approvedVendors.slice(0, 5).map((vendor) => (
                    <Card key={vendor.id} className="border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={vendor.profilePictureUrl} />
                            <AvatarFallback>
                              <User className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h4 className="font-medium">{vendor.businessName}</h4>
                            <p className="text-sm text-muted-foreground">{vendor.location}</p>
                          </div>
                          
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}