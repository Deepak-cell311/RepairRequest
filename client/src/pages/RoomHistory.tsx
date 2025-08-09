import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Building, User, AlertCircle, Wrench } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import RequestCard from "@/components/requests/RequestCard";
import { format } from "date-fns";

export default function RoomHistory() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [selectedBuildingRoutine, setSelectedBuildingRoutine] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({
    start: undefined,
    end: undefined
  });
  const [activeTab, setActiveTab] = useState<string>("requests");
  
  // Get list of all buildings
  const { data: buildings = [], isLoading: buildingsLoading } = useQuery<string[]>({
    queryKey: ["/api/room-buildings"],
    enabled: isAuthenticated,
  });

  // Get all requests for the selected building/room
  const { data: requests = [], isLoading: requestsLoading, error: requestsError } = useQuery<any[]>({
    queryKey: ["/api/room-history", selectedBuilding, selectedRoom === "all" ? undefined : selectedRoom],
    queryFn: async () => {
      if (!selectedBuilding) return [];
      
      const params = new URLSearchParams({ building: selectedBuilding });
      if (selectedRoom && selectedRoom !== "all") {
        params.append("roomNumber", selectedRoom);
      }
      
      console.log("Fetching room history with params:", params.toString());
      const response = await fetch(`/api/room-history?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.error("Room history fetch failed:", response.status, response.statusText);
        throw new Error(`Failed to fetch room history: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Room history data received:", data);
      return data;
    },
    enabled: isAuthenticated && !!selectedBuilding,
  });

  // Get routine maintenance for the selected building/room
  const { data: routineMaintenance = [], isLoading: routineMaintenanceLoading, error: routineMaintenanceError } = useQuery<any[]>({
    queryKey: ["/api/room-routine-maintenance", selectedBuilding, selectedRoom === "all" ? undefined : selectedRoom],
    queryFn: async () => {
      if (!selectedBuilding) return [];
      
      const params = new URLSearchParams({ building: selectedBuilding });
      if (selectedRoom && selectedRoom !== "all") {
        params.append("roomNumber", selectedRoom);
      }
      
      console.log("Fetching routine maintenance with params:", params.toString());
      const response = await fetch(`/api/room-routine-maintenance?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.error("Routine maintenance fetch failed:", response.status, response.statusText);
        throw new Error(`Failed to fetch routine maintenance: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Routine maintenance data received:", data);
      return data;
    },
    enabled: isAuthenticated && !!selectedBuilding,
  });

  // Debug logging
  console.log("Room History Debug Info:");
  console.log("- Selected Building:", selectedBuilding);
  console.log("- Selected Room:", selectedRoom);
  console.log("- Requests data:", requests);
  console.log("- Routine Maintenance data:", routineMaintenance);
  console.log("- Requests error:", requestsError);
  console.log("- Routine Maintenance error:", routineMaintenanceError);

  // Filter requests based on search term, date range, and user role
  const filteredRequests = requests.filter((request: any) => {
    // Only show own requests for requester
    if (user?.role === "requester") {
      // Use request.requestor.id for the user ID
      const requestUserId = request.requestor?.id;
      if (requestUserId !== user.id) {
        return false;
      }
    }
    
    // Filter by search term if provided
    const matchesSearch = !searchTerm || 
      request.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by date range if provided
    const requestDate = new Date(request.eventDate);
    const matchesDateRange = 
      (!dateRange.start || requestDate >= new Date(dateRange.start)) &&
      (!dateRange.end || requestDate <= new Date(dateRange.end));
    
    return matchesSearch && matchesDateRange;
  });

  // Filter routine maintenance based on search term and date range
  const filteredRoutineMaintenance = routineMaintenance.filter((task: any) => {
    // Filter by search term if provided
    const matchesSearch = !searchTerm || 
      task.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by date range if provided
    const taskDate = new Date(task.eventDate);
    const matchesDateRange = 
      (!dateRange.start || taskDate >= new Date(dateRange.start)) &&
      (!dateRange.end || taskDate <= new Date(dateRange.end));
    
    return matchesSearch && matchesDateRange;
  });

  // When building changes, reset room selection
  useEffect(() => {
    setSelectedRoom("all");
  }, [selectedBuilding]);

  // Get unique room numbers for the selected building
  const rooms = requests.reduce((acc: string[], request: any) => {
    if (
      request.buildingDetails?.roomNumber && 
      !acc.includes(request.buildingDetails.roomNumber)
    ) {
      acc.push(request.buildingDetails.roomNumber);
    }
    return acc;
  }, []);

  // Helper function to calculate next due date for routine maintenance
  const calculateNextDueDate = (task: any): string => {
    const startDate = new Date(task.eventDate);
    const today = new Date();

    // If the start date is in the future, return it
    if (startDate > today) {
      return format(startDate, 'PPP');
    }

    // Calculate next occurrence based on recurrence (assuming daily for now)
    let nextDate = new Date(startDate);
    while (nextDate <= today) {
      nextDate.setDate(nextDate.getDate() + 1); // Daily recurrence
    }

    return format(nextDate, 'PPP');
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" className="mr-3 text-primary p-2" onClick={() => {
            if (user?.role === 'admin' || user?.role === 'super_admin') {
              navigate("/dashboard");
            } else {
              navigate("/dashboard");
            }
          }}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Room Maintenance History</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                <Select
                  value={selectedBuilding}
                  onValueChange={setSelectedBuilding}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select building" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingsLoading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      buildings.map((building: string) => (
                        <SelectItem key={building} value={building}>
                          {building}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <Select
                  value={selectedRoom}
                  onValueChange={setSelectedRoom}
                  disabled={!selectedBuilding || !rooms?.length}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedBuilding ? "Select building first" : "All rooms"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    {rooms && rooms.map((room: string) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex flex-row gap-2">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    placeholder="Start date"
                    className="w-full"
                  />
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    placeholder="End date"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by keywords"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedBuilding ? 
                `Maintenance History: ${selectedBuilding}${selectedRoom ? ` - Room ${selectedRoom}` : ''}` : 
                'Select a building to view history'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedBuilding ? (
              <div className="text-center py-8 text-gray-500">
                Select a building to view maintenance history
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="requests" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Repair Requests ({filteredRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="routine" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Routine Maintenance ({filteredRoutineMaintenance.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="requests" className="mt-6">
            {requestsLoading ? (
              <div className="text-center py-8">Loading request history...</div>
            ) : filteredRequests?.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request: any) => (
                  <RequestCard key={request.id} request={request} showRequestor={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {user?.role === "requester"
                  ? "You have not submitted any requests for this room yet."
                        : `No repair requests found for ${selectedBuilding}${selectedRoom ? ` - Room ${selectedRoom}` : ""}`}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="routine" className="mt-6">
                  {routineMaintenanceLoading ? (
                    <div className="text-center py-8">Loading routine maintenance...</div>
                  ) : filteredRoutineMaintenance?.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRoutineMaintenance.map((task: any) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  <Building className="h-5 w-5 text-blue-600" />
                                  {task.facility}
                                </CardTitle>
                                <p className="text-gray-600 mt-1">{task.event}</p>
                              </div>
                              <Badge variant="outline" className="text-sm">
                                Routine
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>Started: {format(new Date(task.eventDate), 'PPP')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span>Next Due: {calculateNextDueDate(task)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User className="h-4 w-4" />
                                  <span>Created by: {task.requestor?.name || task.requestor?.id}</span>
                                </div>
                              </div>
                              <div>
                                <Badge variant="secondary" className="text-xs">
                                  Status: Active
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No routine maintenance tasks found for {selectedBuilding}{selectedRoom ? ` - Room ${selectedRoom}` : ""}
              </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}