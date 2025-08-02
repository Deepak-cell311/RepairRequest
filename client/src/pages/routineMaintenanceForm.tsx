"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { queryClient } from "@/lib/queryClient"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Repeat } from "lucide-react"
import { PhotoUpload } from "@/components/ui/PhotoUpload"
import { useAuth } from "@/hooks/useAuth"

const routineMaintenanceSchema = z.object({
  requestType: z.literal("routine_maintenance"),
  facility: z.string().min(1, "Building is required"),
  event: z.string().min(1, "Maintenance title is required"),
  dateBegun: z.string().min(1, "Date begun is required"),
  recurrence: z.enum(["daily", "weekly", "bi-weekly", "monthly", "quarterly", "bi-annually", "annually", "custom"]),
  customRecurrence: z.string().optional(),
  photos: z.any().optional(),

  // Routine maintenance specific fields
  maintenance: z.object({
    roomNumber: z.string().min(1, "Room number is required"),
    description: z.string().min(1, "Routine description is required"),
  }),
})

type RoutineMaintenanceFormValues = z.infer<typeof routineMaintenanceSchema>

export default function RoutineMaintenanceForm() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user has admin/maintenance permissions
  useEffect(() => {
    if (!isLoading && user && !["admin", "super_admin", "maintenance", "requester"].includes(user.role)) {
      toast({
        title: "Access Denied",
        description: "Only admin and maintenance users can create routine maintenance tasks.",
        variant: "destructive",
      })
      navigate("/dashboard")
    }
  }, [user, isLoading, navigate, toast])

  // Fetch organization buildings
  const {
    data: buildings,
    isLoading: buildingsLoading,
    error: buildingsError,
  } = useQuery({
    queryKey: ["/api/buildings"],
  })

  // State for selected building and its rooms
  const [selectedBuilding, setSelectedBuilding] = useState<string>("")
  const [availableRooms, setAvailableRooms] = useState<string[]>([])

  // Update available rooms when building changes
  useEffect(() => {
    if (selectedBuilding && buildings && Array.isArray(buildings)) {
      const building = buildings.find((b: any) => b.name === selectedBuilding)
      if (building && building.roomNumbers) {
        setAvailableRooms(building.roomNumbers)
      } else {
        setAvailableRooms([])
      }
    } else {
      setAvailableRooms([])
    }
  }, [selectedBuilding, buildings])

  const form = useForm<RoutineMaintenanceFormValues>({
    resolver: zodResolver(routineMaintenanceSchema),
    defaultValues: {
      requestType: "routine_maintenance",
      facility: "",
      event: "",
      dateBegun: new Date().toISOString().split("T")[0],
      recurrence: "monthly",
      customRecurrence: "",
      photos: undefined,
      maintenance: {
        roomNumber: "",
        description: "",
      },
    },
  })

  const watchRecurrence = form.watch("recurrence")

  async function onSubmit(data: RoutineMaintenanceFormValues) {
    try {
      console.log("ROUTINE MAINTENANCE SUBMIT - Form data:", JSON.stringify(data))
      setIsSubmitting(true)

      // Create FormData object for multipart form submission
      const formData = new FormData()

      // Basic request info
      formData.append("requestType", "routine_maintenance")
      formData.append("facility", data.facility)
      formData.append("event", data.event)
      formData.append("dateBegun", data.dateBegun)
      formData.append("recurrence", data.recurrence)

      if (data.customRecurrence) {
        formData.append("customRecurrence", data.customRecurrence)
      }

      // Maintenance specific info
      formData.append("maintenance.roomNumber", data.maintenance.roomNumber)
      formData.append("maintenance.description", data.maintenance.description)
      formData.append("maintenance.building", data.facility)

      // Handle multiple photo uploads if present
      if (data.photos) {
        const files = Array.isArray(data.photos) ? data.photos : [data.photos]
        files.forEach((file: File, index: number) => {
          if (file instanceof File) {
            console.log(`ROUTINE MAINTENANCE SUBMIT - Photo ${index + 1} being attached:`, file.name)
            formData.append("photos", file)
          }
        })
      }

      console.log("ROUTINE MAINTENANCE SUBMIT - Sending to /api/routine-maintenance")

      // Submit the form data to the API endpoint
      const response = await fetch("/api/routine-maintenance", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("ROUTINE MAINTENANCE SUBMIT - Error response:", errorText)
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("ROUTINE MAINTENANCE SUBMIT - Success response:", result)

      toast({
        title: "Routine Maintenance Created Successfully",
        description: "The routine maintenance task has been scheduled and will appear for all users to see.",
      })

      // Update any cached data
      queryClient.invalidateQueries({ queryKey: ["/api/routine-maintenance"] })
      queryClient.invalidateQueries({ queryKey: ["/api/requests/my"] })

      // Navigate back to management dashboard
      navigate("/manage-requests")
    } catch (error) {
      console.error("ROUTINE MAINTENANCE SUBMIT - Error:", error)
      toast({
        title: "Submission Failed",
        description: "The routine maintenance task could not be created. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" className="mr-3 text-primary p-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-heading font-bold text-gray-900">New Routine Maintenance Task</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Routine Maintenance Form
            </CardTitle>
            <CardDescription>
              Create a recurring maintenance task that will be visible to all users and automatically scheduled based on
              the recurrence pattern.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="facility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedBuilding(value)
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a building" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {buildingsLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading buildings...
                              </SelectItem>
                            ) : buildings && Array.isArray(buildings) ? (
                              buildings
                                .sort((a: any, b: any) => a.name.localeCompare(b.name))
                                .map((building: any) => (
                                  <SelectItem key={building.id} value={building.name}>
                                    {building.name}
                                  </SelectItem>
                                ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No buildings available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maintenance.roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!form.getValues("facility")}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue
                                placeholder={!form.getValues("facility") ? "Select a building first" : "Select a room"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px] overflow-y-auto">
                            {availableRooms.length > 0 ? (
                              availableRooms.map((room: string) => (
                                <SelectItem key={room} value={room}>
                                  {room}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                {selectedBuilding ? "No rooms available" : "Select a building first"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="event"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Title/Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., HVAC Filter Replacement, Fire Extinguisher Inspection" />
                      </FormControl>
                      <FormDescription>
                        Provide a clear, descriptive name for this routine maintenance task
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maintenance.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routine Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the maintenance routine, steps to be performed, and any special instructions..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Detailed description of the maintenance routine and procedures</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="dateBegun"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date Begun
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>The start date for this routine maintenance schedule</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recurrence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Repeat className="h-4 w-4" />
                          Recurrence
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select recurrence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-weekly (Every 2 weeks)</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly (Every 3 months)</SelectItem>
                            <SelectItem value="bi-annually">Bi-annually (Every 6 months)</SelectItem>
                            <SelectItem value="annually">Annually (Every year)</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How often should this maintenance be performed?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {watchRecurrence === "custom" && (
                  <FormField
                    control={form.control}
                    name="customRecurrence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Recurrence Pattern</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Every 45 days, Every 3rd Tuesday of the month" />
                        </FormControl>
                        <FormDescription>Describe the custom recurrence pattern in detail</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Photo Upload */}
                <PhotoUpload
                  form={form}
                  name="photos"
                  label="Add Reference Photos"
                  description="Upload reference photos for the maintenance routine (optional, max 5MB each)"
                  multiple={true}
                  maxPhotos={5}
                />

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => navigate("/manage-requests")} type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-950 hover:bg-blue-950">
                    {isSubmitting ? "Creating..." : "Create Routine Maintenance"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
