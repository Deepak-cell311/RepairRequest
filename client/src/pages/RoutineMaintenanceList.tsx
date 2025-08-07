import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Building, User, AlertCircle } from "lucide-react";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { Link } from "react-router-dom";

// Helper function to calculate next due date
function calculateNextDueDate(task: any): string {
  const startDate = new Date(task.dateBegun);
  const today = new Date();
  
  // If the start date is in the future, return it
  if (startDate > today) {
    return format(startDate, 'PPP');
  }
  
  // Calculate next occurrence based on recurrence
  let nextDate = new Date(startDate);
  
  while (nextDate <= today) {
    switch (task.recurrence) {
      case 'daily':
        nextDate = addDays(nextDate, 1);
        break;
      case 'weekly':
        nextDate = addWeeks(nextDate, 1);
        break;
      case 'monthly':
        nextDate = addMonths(nextDate, 1);
        break;
      case 'custom':
        if (task.customRecurrence) {
          const days = parseInt(task.customRecurrence) || 7;
          nextDate = addDays(nextDate, days);
        } else {
          nextDate = addDays(nextDate, 7);
        }
        break;
      default:
        nextDate = addDays(nextDate, 7);
    }
  }
  
  return format(nextDate, 'PPP');
}

export default function RoutineMaintenanceList() {
  const { user } = useAuth();

  const { data: routineMaintenance, isLoading, error } = useQuery({
    queryKey: ["/api/routine-maintenance"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Routine Maintenance Schedule</h1>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Schedule</h2>
            <p className="text-red-600">Failed to load routine maintenance tasks. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const tasks = (routineMaintenance as any)?.data || [];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Routine Maintenance Schedule</h1>
          {(user?.role === 'admin' || user?.role === 'maintenance') && (
            <Link to="/routine-maintenance">
              <Button>Create New Task</Button>
            </Link>
          )}
        </div>

        {tasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Routine Tasks Scheduled</h3>
              <p className="text-gray-500 mb-4">
                There are no routine maintenance tasks scheduled for your organization.
              </p>
              {(user?.role === 'admin' || user?.role === 'maintenance') && (
                <Link to="/routine-maintenance">
                  <Button>Create First Task</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tasks.map((task: any) => (
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
                      {task.recurrence}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Started: {format(new Date(task.dateBegun), 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Next: {calculateNextDueDate(task)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>Created by: {task.createdBy?.firstName} {task.createdBy?.lastName}</span>
                      </div>
                    </div>
                    <div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      )}
                      {task.roomNumber && (
                        <Badge variant="secondary" className="text-xs">
                          Room: {task.roomNumber}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Last updated: {format(new Date(task.updatedAt), 'PPP')}
                      </div>
                      <Link to={`/routine-maintenance/${task.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
