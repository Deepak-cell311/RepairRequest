import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Building, User, AlertCircle, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { url } from "inspector";

// Helper function to get the correct photo URL
function getPhotoUrl(photo: any): string {
  if (!photo) return "No image";

  // If photoUrl is empty but filePath exists, use filePath
  if (!photo.photoUrl && photo.filePath) {
    // Extract filename from filePath and construct the URL
    const filename = photo.filePath.split('\\').pop() || photo.filePath.split('/').pop();
    return `/uploads/photos/${filename}`;
  }

  // Try different possible URL fields
  const url = photo.photoUrl || photo.url || photo.originalFilename || photo.filename;

  if (!url) return "No image";

  // If it's already a full URL (starts with http), return as is
  if (url.startsWith('http')) {
    return url;
  }

  // If it's a relative path starting with /, return as is
  if (url.startsWith('/')) {
    return url;
  }

  // Otherwise, assume it's a filename and construct the path
  return `/uploads/photos/${url}`;
}

export default function RoutineMaintenanceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();


  const { data: task, isLoading, error } = useQuery({
    queryKey: [`/api/routine-maintenance/${id}`],
    enabled: !!id,
  });

  console.log("Task detail: ", task)
  console.log("Task data: ", (task as any)?.data)
  console.log("Photos: ", (task as any)?.data?.photos)

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Task</h2>
            <p className="text-red-600">Failed to load routine maintenance task details. Please try again.</p>
            <Link to="/routine-maintenance-list">
              <Button variant="outline" className="mt-4">
                Back to Schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const taskData = task?.data;

  if (!taskData) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Task Not Found</h2>
            <p className="text-yellow-600">The routine maintenance task you're looking for doesn't exist.</p>
            <Link to="/routine-maintenance-list">
              <Button variant="outline" className="mt-4">
                Back to Schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* <Link to="/routine-maintenance-list"> */}
              <Button variant="ghost" className="text-primary p-2" onClick={() => {
                if (user?.role === 'admin' || user?.role === 'super_admin') {
                  navigate("/manage-requests");
                } else {
                  navigate("/routine-maintenance-list");
                }
              }}>
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-2xl font-bold">Routine Maintenance Details</h1>
            {/* </Link> */}
          </div>
        </div>
        {(user?.role === 'admin' || user?.role === 'maintenance') && (
          <div className="flex gap-2">
            <Link to={`/routine-maintenance/edit/${id}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Implement delete functionality
                toast({
                  title: "Delete functionality",
                  description: "Delete functionality will be implemented soon.",
                });
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Task Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  {taskData.facility}
                </CardTitle>
                <p className="text-gray-600 mt-1">{taskData.event}</p>
              </div>
              <Badge variant="outline" className="text-sm">
                {taskData.recurrence}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Started: {format(new Date(taskData.dateBegun), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Next Due: {
                      (() => {
                        const begun = new Date(taskData.dateBegun);
                        let nextDue: Date = new Date(begun);
                        if (taskData.recurrence) {
                          switch (taskData.recurrence.toLowerCase()) {
                            case 'daily':
                              nextDue.setDate(begun.getDate() + 1);
                              break;
                            case 'weekly':
                              nextDue.setDate(begun.getDate() + 7);
                              break;
                            case 'biweekly':
                              nextDue.setDate(begun.getDate() + 14);
                              break;
                            case 'monthly':
                              nextDue.setMonth(begun.getMonth() + 1);
                              break;
                            case 'quarterly':
                              nextDue.setMonth(begun.getMonth() + 3);
                              break;
                            case 'yearly':
                              nextDue.setFullYear(begun.getFullYear() + 1);
                              break;
                            default:
                              // If customRecurrence is set, use that (in days)
                              if (taskData.customRecurrence && !isNaN(Number(taskData.customRecurrence))) {
                                nextDue.setDate(begun.getDate() + Number(taskData.customRecurrence));
                              }
                              break;
                          }
                        }
                        return format(nextDue, 'PPP');
                      })()
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Created by: {taskData.createdBy?.firstName} {taskData.createdBy?.lastName}</span>
                </div>
                {taskData.roomNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="h-4 w-4" />
                    <span>Room: {taskData.roomNumber}</span>
                  </div>
                )}
              </div>
              <div>
                {taskData.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{taskData.description}</p>
                  </div>
                )}
                {taskData.customRecurrence && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Custom Schedule</h4>
                    <p className="text-sm text-gray-600">Every {taskData.customRecurrence} days</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos Section */}
        {taskData.photos && taskData.photos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {taskData.photos.map((photo: any, index: number) => (
                  <div key={index} className="relative">
                    <img
                      src={getPhotoUrl(photo) || "No image"}
                      alt={`Task photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {format(new Date(photo.uploadedAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle>Status Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Task Status</h4>
                <Badge variant={taskData.isActive ? "default" : "secondary"}>
                  {taskData.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
                <p className="text-sm text-gray-600">
                  {format(new Date(taskData.updatedAt), 'PPP')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  );
}
