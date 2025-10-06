"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { LoadingSpinner } from "@/components/loading-spinner"
import { StarRating } from "@/components/ui/star-rating"
import { MapPin, Globe, Phone, Star, Search, Filter, Mail } from "lucide-react"

interface Vendor {
  id: number
  businessName: string
  location: string
  bio: string
  websiteUrl: string[]
  profilePictureUrl: string
  email: string
  phoneNumber: string
  addressId: number
  approved: boolean
  published: boolean
  totalRating?: number
  numberOfRatings?: number
}

interface VendorsResponse {
  vendors: Vendor[]
  pagination: {
    page: number
    size: number
    total: number
    pages: number
  }
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalVendors, setTotalVendors] = useState(0)

  const pageSize = 12

  useEffect(() => {
    fetchVendors()
  }, [currentPage, searchQuery, locationFilter])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        pgNo: currentPage.toString(),
        pgSize: pageSize.toString(),
      })

      if (searchQuery && searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }

      if (locationFilter && locationFilter !== 'all') {
        params.append('location', locationFilter)
      }

      console.log('Frontend: Fetching vendors with params:', Object.fromEntries(params))
      const response = await fetch(`/api/vendors?${params.toString()}`)
      console.log('Frontend: API response status:', response.status)

      if (!response.ok) {
        throw new Error(`Failed to fetch vendors: ${response.status} ${response.statusText}`)
      }

      const data: VendorsResponse = await response.json()
      console.log('Frontend: API Response:', data)
      console.log('Frontend: Vendors array:', data.vendors)
      console.log('Frontend: Number of vendors:', data.vendors?.length || 0)

      // Ensure vendors is always an array
      const vendorsArray = Array.isArray(data.vendors) ? data.vendors : []
      setVendors(vendorsArray)
      setTotalPages(data.pagination?.pages || 1)
      setTotalVendors(data.pagination?.total || 0)
    } catch (err) {
      console.error('Frontend: Error fetching vendors:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setVendors([])
      setTotalPages(1)
      setTotalVendors(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchVendors()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading && vendors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Discover Amazing Vendors
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect vendors for your special events. From photographers to caterers,
              discover trusted professionals in your area.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Debug Info - Remove this after debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Vendors count: {vendors.length}</p>
            <p>Total from API: {totalVendors}</p>
            <p>Current page: {currentPage}</p>
            <p>Loading: {loading ? 'true' : 'false'}</p>
            <p>Error: {error || 'none'}</p>
            <details className="mt-2">
              <summary className="cursor-pointer">Raw vendor data</summary>
              <pre className="text-xs mt-2 overflow-auto max-h-40">
                {JSON.stringify(vendors.slice(0, 2), null, 2)}
              </pre>
            </details>
          </div>
        )}
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search vendors by name, service, or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </form>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by location"/>
              </SelectTrigger>
              <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                    <SelectItem value="Chicago">Chicago</SelectItem>
                    <SelectItem value="Houston">Houston</SelectItem>
                    <SelectItem value="Phoenix">Phoenix</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" onClick={handleSearch} className="h-12 px-8">
              Search
            </Button>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {totalVendors > 0 ? (
                `Showing ${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, totalVendors)} of ${totalVendors} vendors`
              ) : (
                'No vendors found'
              )}
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-destructive font-medium mb-2">Error loading vendors</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                onClick={fetchVendors}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Vendors Grid */}
        {!error && (
          <>
            {vendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {vendors.map((vendor) => (
                  <Card key={vendor?.id || Math.random()} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={vendor?.profilePictureUrl || "/placeholder-user.jpg"}
                            alt={vendor?.businessName || vendor?.email || "Vendor"}
                          />
                          <AvatarFallback className="text-lg">
                            {getInitials(vendor?.businessName || vendor?.email || "Unknown Vendor")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {vendor?.businessName || vendor?.email || "Unnamed Vendor"}
                          </CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {vendor?.location || "Location not specified"}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {vendor?.bio && vendor.bio.trim() && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {vendor.bio}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        {vendor?.websiteUrl && Array.isArray(vendor.websiteUrl) && vendor.websiteUrl.length > 0 && vendor.websiteUrl[0] && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Globe className="h-3 w-3 mr-2" />
                            <a
                              href={vendor.websiteUrl[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors truncate"
                            >
                              {vendor.websiteUrl[0].replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}

                        {vendor?.phoneNumber && vendor.phoneNumber.trim() && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 mr-2" />
                            {vendor.phoneNumber}
                          </div>
                        )}

                        {vendor?.email && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-3 w-3 mr-2" />
                            {vendor.email}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {(vendor?.totalRating !== undefined && vendor?.numberOfRatings !== undefined) ? (
                          <div className="flex items-center gap-2">
                            <StarRating rating={vendor.totalRating || 0} readonly size="sm" />
                            <span className="text-xs text-muted-foreground">({vendor.numberOfRatings} reviews)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <StarRating rating={0} readonly size="sm" />
                            <span className="text-xs text-muted-foreground">(No reviews yet)</span>
                          </div>
                        )}

                        <Badge variant={(vendor?.approved === true) ? "default" : "secondary"}>
                          {(vendor?.approved === true) ? "Verified" : "Pending"}
                        </Badge>
                      </div>

                      <Button asChild className="w-full mt-4">
                        <Link href={`/vendors/${vendor?.id || ''}`}>
                          View Profile
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or browse all available vendors.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery("")
                      setLocationFilter("all")
                      setCurrentPage(1)
                    }}>
                      Clear Filters
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/vendors?showAll=true')
                          const data = await response.json()
                          console.log('Show all API call result:', data)
                          alert(`Show all API call: ${data.vendors?.length || 0} vendors found`)
                        } catch (err) {
                          console.error('Show all API call failed:', err)
                          alert('Show all API call failed')
                        }
                      }}
                    >
                      Show All Vendors
                    </Button>
                  </div>
                </div>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={pageNumber === currentPage}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
