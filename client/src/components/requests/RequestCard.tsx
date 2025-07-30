import { Link } from "react-router-dom";
import StatusBadge from "@/components/status/StatusBadge";
import PriorityBadge from "@/components/priority/PriorityBadge";
import { format } from "date-fns";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface RequestCardProps {
  request: any;
  showRequestor?: boolean;
}

export default function RequestCard({ request, showRequestor = false }: RequestCardProps) {
  // Format date display
  const formattedDate = request.eventDate 
    ? format(new Date(request.eventDate), 'MMMM d, yyyy')
    : 'Date not specified';
  
  // Format time display
  const times = [];
  if (request.startTime) times.push(`Start: ${request.startTime}`);
  if (request.endTime) times.push(`End: ${request.endTime}`);
  const timeDisplay = times.length > 0 ? times.join(' - ') : 'Time not specified';

  return (
    <li className="request-card list-none">
      <Link to={`/requests/${request.id}`}>
        <a className="block hover:bg-gray-50">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-primary truncate">{request.event}</p>
              <div className="ml-2 flex-shrink-0 flex space-x-2">
                <StatusBadge status={request.status} />
                <PriorityBadge priority={request.priority || 'medium'} />
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  <span className="material-icons text-gray-400 mr-1.5 text-sm">place</span>
                  <span>{request.facility}</span>
                </p>
                
                {showRequestor && request.requestor && (
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    <span className="material-icons text-gray-400 mr-1.5 text-sm">person</span>
                    <span>{request.requestor.name}</span>
                  </p>
                )}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <span className="material-icons text-gray-400 mr-1.5 text-sm">event</span>
                <p>
                  {formattedDate}
                </p>
              </div>
            </div>
            
            {/* Show assignee if available */}
            {request.assignee && (
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="text-gray-400 mr-1">Assigned to:</span>
                <div className="flex items-center">
                  <UserAvatar user={request.assignee} size="sm" />
                  <span className="ml-1">{request.assignee.name}</span>
                </div>
              </div>
            )}
          </div>
        </a>
      </Link>
    </li>
  );
}
