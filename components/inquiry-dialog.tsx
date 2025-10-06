"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"
import { useSession } from "next-auth/react"

interface InquiryDialogProps {
  serviceId: string
  serviceName: string
  serviceType: string
  children: React.ReactNode
}

export function InquiryDialog({ serviceId, serviceName, serviceType, children }: InquiryDialogProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [eventDate, setEventDate] = useState<Date>()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    numberOfGuests: "",
    eventType: "",
    eventVision: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      toast.error("Please log in to submit an inquiry")
      return
    }

    if (!eventDate) {
      toast.error("Please select an event date")
      return
    }

    try {
      setLoading(true)

      const inquiryData = {
        ...formData,
        numberOfGuests: parseInt(formData.numberOfGuests),
        eventData: format(eventDate, "yyyy-MM-dd"),
        serviceType: serviceType,
      }

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit inquiry")
      }

      toast.success("Inquiry submitted successfully! The vendor will contact you soon.")
      setOpen(false)
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        numberOfGuests: "",
        eventType: "",
        eventVision: "",
      })
      setEventDate(undefined)
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit inquiry")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquire about {serviceName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName")(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName")(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email")(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber")(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="eventDate">Event Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="numberOfGuests">Number of Guests *</Label>
            <Input
              id="numberOfGuests"
              type="number"
              min="1"
              value={formData.numberOfGuests}
              onChange={(e) => handleInputChange("numberOfGuests")(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="eventType">Event Type</Label>
            <Select value={formData.eventType} onValueChange={handleInputChange("eventType")}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEDDING">Wedding</SelectItem>
                <SelectItem value="BIRTHDAY">Birthday</SelectItem>
                <SelectItem value="ANNIVERSARY">Anniversary</SelectItem>
                <SelectItem value="CORPORATE">Corporate Event</SelectItem>
                <SelectItem value="ENGAGEMENT">Engagement</SelectItem>
                <SelectItem value="BABY_SHOWER">Baby Shower</SelectItem>
                <SelectItem value="GRADUATION">Graduation</SelectItem>
                <SelectItem value="HOLIDAY_PARTY">Holiday Party</SelectItem>
                <SelectItem value="CONFERENCE">Conference</SelectItem>
                <SelectItem value="EXHIBITION">Exhibition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="eventVision">Event Vision *</Label>
            <Textarea
              id="eventVision"
              placeholder="Describe your event vision, requirements, and any specific details..."
              value={formData.eventVision}
              onChange={(e) => handleInputChange("eventVision")(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}