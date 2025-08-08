import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import StatsCard from "@/components/dashboard/StatsCard";
import RequestCard from "@/components/requests/RequestCard";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function Dashboard() {
  const { user } = useAuth();
  console.log(user);
  
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });
  
  const { data: recentRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["/api/requests/recent"],
  });

  const { data: assignedRequests, isLoading: isLoadingAssigned } = useQuery({
    queryKey: ["/api/requests/assigned"],
    enabled: user?.role === 'maintenance',
  });
  
  // Fetch organizations
  const { data: organizations, isLoading: isLoadingOrgs } = useQuery({
    queryKey: ["/api/admin/organizations"],
  });
  
  // Fetch buildings for user's organization
  const { data: buildings, isLoading: isLoadingBuildings } = useQuery({
    queryKey: ["/api/buildings"],
  });

  // Fetch routine maintenance tasks
  const { data: routineMaintenance, isLoading: isLoadingRoutine } = useQuery({
    queryKey: ["/api/routine-maintenance"],
  });

  console.log("Response of organizations: ", organizations)
  console.log("Response of buildings: ", buildings)
  console.log("Response of routine maintenance: ", routineMaintenance)

  // Type assertions for API responses
  const stats = statsData as any;
  const requests = recentRequests as any[];
  const assigned = assignedRequests as any[];
  const orgs = organizations as any[];
  const userBuildings = buildings as any[];
  const routineTasks = routineMaintenance?.data as any[] || [];
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
        
        {/* Stats Overview */}
        {/* Statistics Cards - Show for admins only */}
        {user && user.role === 'admin' && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {isLoadingStats ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white animate-pulse h-24 rounded-lg"></div>
                ))}
              </>
            ) : (
              <>
                <StatsCard 
                  title="Total Requests" 
                  value={stats?.total || 0} 
                  className="bg-white" 
                />
                <StatsCard 
                  title="Pending" 
                  value={stats?.pending || 0} 
                  className="bg-white text-status-pending" 
                />
                <StatsCard 
                  title="In Progress" 
                  value={stats?.inProgress || 0} 
                  className="bg-white text-status-inprogress" 
                />
                <StatsCard 
                  title="Completed" 
                  value={stats?.completed || 0} 
                  className="bg-white text-status-completed" 
                />
              </>
            )}
          </div>
        )}
        
        {/* Assigned Requests - Show for maintenance users */}
        {user && user.role === 'maintenance' && (
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-heading font-medium text-gray-900">Assigned to Me</h2>
              <Link to="/assigned-requests" className="text-sm text-primary hover:text-primary-light font-medium">
                View all
              </Link>
            </div>
            
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              {isLoadingAssigned ? (
                <div className="p-4 space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse h-20 bg-gray-100 rounded"></div>
                  ))}
                </div>
              ) : assigned && assigned.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {assigned.slice(0, 3).map((request: any) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No requests assigned to you</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Super Admin Actions */}
        {user && user.role === 'super_admin' && (
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-heading font-medium text-gray-900">Administrative Tools</h2>
            
            {/* Manage Organizations */}
            <div className="bg-white rounded-lg shadow p-6">
              <Link to="/admin/organizations">
                <a className="block hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4 -m-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Organizations</h3>
                      <p className="text-gray-600">Create, edit, and manage organizations within the system</p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>

            {/* Buildings & Facilities */}
            <div className="bg-white rounded-lg shadow p-6">
              <Link to="/admin/buildings-facilities">
                <span className="block hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4 -m-4" >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Buildings & Facilities</h3>
                      <p className="text-gray-600">Configure buildings and facilities for all organizations</p>
                    </div>
                  </div>
                </span>
              </Link>
            </div>

            {/* User Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <Link to="/admin/users">
                <a className="block hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4 -m-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                      <p className="text-gray-600">Manage user roles and organization assignments across the system</p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        )}

        {/* Request Actions - Show for regular users and maintenance */}
        {user && user.role !== 'admin' && user.role !== 'super_admin' && (
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-heading font-medium text-gray-900">Submit a Request</h2>
            
            {/* Building Maintenance Request */}
            <div className="bg-white rounded-lg shadow p-6">
              <Link to="/new-building-request">
                <a className="block hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4 -m-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Repair Request</h3>
                      <p className="text-gray-600">Use this if there is a situation somewhere on site that needs to be addressed</p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>

            {/* Facilities Request */}
            <div className="bg-white rounded-lg shadow p-6">
              <Link to="/new-facilities-request">
                <a className="block hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4 -m-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Labor Request</h3>
                      <p className="text-gray-600">Use this if there is an event where you will need maintenance to assist with labor</p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        )}

        {/* Request Status Sections - Show for admins only */}
        {user && user.role === 'admin' && (
          <div className="mt-8 space-y-8">
            {/* Open Requests */}
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-heading font-medium text-gray-900">Open Requests</h2>
                <Link to="/manage">
                  <a className="text-sm text-primary hover:text-primary-light font-medium">View all</a>
                </Link>
              </div>
              
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                {isLoadingRequests ? (
                  <div className="p-4 space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="animate-pulse h-20 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ) : (() => {
                    const openRequests = requests?.filter((request: any) => 
                      ['pending', 'approved', 'in-progress'].includes(request.status)
                    ) || [];
                    
                    return openRequests.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {openRequests.slice(0, 3).map((request: any) => (
                          <RequestCard key={request.id} request={request} />
                        ))}
                      </ul>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">No open requests found</p>
                      </div>
                    );
                  })()}
              </div>
            </div>

            {/* Completed Requests */}
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-heading font-medium text-gray-900">Completed Requests</h2>
                <Link to="/manage">
                  <a className="text-sm text-primary hover:text-primary-light font-medium">View all</a>
                </Link>
              </div>
              
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                {isLoadingRequests ? (
                  <div className="p-4 space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="animate-pulse h-20 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ) : (() => {
                    const completedRequests = requests?.filter((request: any) => 
                      request.status === 'completed'
                    ) || [];
                    
                    return completedRequests.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {completedRequests.slice(0, 3).map((request: any) => (
                          <RequestCard key={request.id} request={request} />
                        ))}
                      </ul>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">No completed requests found</p>
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>
        )}
        
        {/* Campus Facilities */}
        <div className="mt-8">
          <h2 className="text-lg font-heading font-medium text-gray-900">Organizations</h2>
          <div className="mt-4 grid gap-6 grid-cols-1 md:grid-cols-2">
            {isLoadingOrgs ? (
              <div>Loading...</div>
            ) : orgs && orgs.length > 0 ? (
              orgs.map((org: any) => (
                <div key={org.id} className="relative rounded-lg overflow-hidden h-48 shadow-md flex gap-2">
                  {org.image1Url && (
                    <img
                      src={org.image1Url}
                      alt={org.name + ' image 1'}
                      className="w-1/2 h-full object-cover"
                    />
                  )}
                  {org.image2Url && (
                    <img
                      src={org.image2Url}
                      alt={org.name + ' image 2'}
                      className="w-1/2 h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-heading font-medium">{org.name}</h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">No organization assigned to your account yet.</p>
                <p className="text-sm text-gray-400 mt-2">Please contact your administrator to get assigned to an organization.</p>
              </div>
            )}
          </div>
        </div>

        {/* Buildings Section - Only show if user has an organization */}
        {/* {orgs && orgs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-heading font-medium text-gray-900">Buildings</h2>
            <div className="mt-4">
              {isLoadingBuildings ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading buildings...</p>
                </div>
              ) : userBuildings && userBuildings.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {userBuildings.map((building: any) => (
                    <div key={building.id} className="bg-white rounded-lg shadow p-6">
                      <h3 className="font-medium text-gray-900 mb-2">{building.name}</h3>
                      {building.address && (
                        <p className="text-sm text-gray-600 mb-2">{building.address}</p>
                      )}
                      {building.description && (
                        <p className="text-sm text-gray-500 mb-3">{building.description}</p>
                      )}
                      {building.roomNumbers && building.roomNumbers.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Rooms:</p>
                          <div className="flex flex-wrap gap-1">
                            {building.roomNumbers.slice(0, 5).map((room: string, index: number) => (
                              <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {room}
                              </span>
                            ))}
                            {building.roomNumbers.length > 5 && (
                              <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                                +{building.roomNumbers.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No buildings configured for your organization yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Contact your administrator to add buildings.</p>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Routine Maintenance Section - Only show if user has an organization */}
        {/* {orgs && orgs.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-heading font-medium text-gray-900">Scheduled Maintenance</h2>
              <Link to="/routine-maintenance-list" className="text-sm text-primary hover:text-primary-light font-medium">
                View all
              </Link>
            </div>
            <div className="mt-4">
              {isLoadingRoutine ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading scheduled tasks...</p>
                </div>
              ) : routineTasks && routineTasks.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {routineTasks.slice(0, 3).map((task: any) => (
                    <div key={task.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-900">{task.facility}</h3>
                        <Badge variant="outline" className="text-xs">
                          {task.recurrence}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.event}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Started: {format(new Date(task.dateBegun), 'MMM dd, yyyy')}</span>
                        </div>
                        {task.roomNumber && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>Room: {task.roomNumber}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <Link to={`/routine-maintenance-list`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No scheduled maintenance tasks found.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {(user?.role === 'admin' || user?.role === 'maintenance') && (
                      <Link to="/routine-maintenance" className="text-primary hover:text-primary-light">
                        Create a scheduled task
                      </Link>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}