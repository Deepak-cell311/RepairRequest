import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { queryClient } from "@/lib/queryClient";

interface SidebarProps {
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
  user: any;
}

declare global {
  interface Window {
    queryClient: any;
  }
}

export default function Sidebar({ isMobileOpen, closeMobileSidebar, user }: SidebarProps) {
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isMaintenance = user?.role === 'maintenance' || user?.role === 'admin';

  const navItems = isSuperAdmin ? [
    // Super Admin menu order
    { href: "/dashboard", label: "Dashboard", icon: "dashboard", access: "super_admin" },
    { href: "/admin/organizations", label: "Manage Organizations", icon: "business", access: "super_admin" },
    { href: "/admin/buildings-facilities", label: "Buildings & Facilities", icon: "domain", access: "super_admin" },
    { href: "/admin/users", label: "User Management", icon: "group", access: "super_admin" },
    { href: "/manage-requests", label: "Manage Requests", icon: "manage_accounts", access: "super_admin" },
    // { href: "/reports", label: "Reports", icon: "assessment", access: "super_admin" },
  ] : isAdmin ? [
    // Admin menu order
    { href: "/dashboard", label: "Dashboard", icon: "dashboard", access: "admin" },
    // { href: "/admin/users", label: "User Management", icon: "group", access: "admin" },
    { href: "/manage-requests", label: "Manage Requests", icon: "manage_accounts", access: "admin" },
    { href: "/room-history", label: "Room History", icon: "history", access: "admin" },
    { href: "/reports", label: "Reports", icon: "assessment", access: "admin" },
    { href: "/assigned-requests", label: "Assigned to Me", icon: "engineering", access: "admin" },
    { href: "/new-building-request", label: "New Repair Request", icon: "home_repair_service", access: "admin" },
    { href: "/new-facilities-request", label: "New Labor Request", icon: "event_seat", access: "admin" },
  ] : user?.role === 'maintenance' ? [
    // Maintenance menu order
    { href: "/dashboard", label: "Dashboard", icon: "dashboard", access: "maintenance" },
    { href: "/assigned-requests", label: "Assigned to Me", icon: "engineering", access: "maintenance" },
    { href: "/room-history", label: "Room History", icon: "history", access: "maintenance" },

    { href: "/manage-requests", label: "Manage Requests", icon: "manage_accounts", access: "maintenance" },
    { href: "/new-building-request", label: "New Repair Request", icon: "home_repair_service", access: "maintenance" },
    { href: "/new-facilities-request", label: "New Facilities Request", icon: "event_seat", access: "maintenance" },
  ] : [
    // Regular user menu
    { href: "/dashboard", label: "Dashboard", icon: "dashboard", access: "all" },
    { href: "/new-building-request", label: "New Repair Request", icon: "home_repair_service", access: "all" },
    { href: "/new-facilities-request", label: "New Labor Request", icon: "event_seat", access: "all" },
    { href: "/my-requests", label: "My Requests", icon: "assignment", access: "all" },
    { href: "/room-history", label: "Room History", icon: "history", access: "all" },
  ];

  return (
    <aside className={cn(
      "hidden md:flex md:flex-shrink-0 sidebar-transition",
      isMobileOpen && "fixed inset-0 z-50 flex md:relative md:z-0"
    )}>
      <div className="flex flex-col w-64 bg-white shadow-lg relative z-10">
        <div className="h-0 flex-1 flex flex-col overflow-y-auto">
          {/* User Info */}
          <div className="px-4 py-6 bg-gray-50 border-b">
            <div className="flex items-center">
              <UserAvatar user={user} />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              // Check access rights
              if (
                item.access === "all" || 
                (item.access === "maintenance" && isMaintenance) || 
                (item.access === "admin" && isAdmin) ||
                (item.access === "super_admin" && isSuperAdmin)
              ) {
                const isActive = location.pathname === item.href;
                
                return (
                  <Link to={item.href} key={item.href}>
                    <div
                      className={cn(
                        isActive
                          ? "bg-gray-100 text-primary"
                          : "text-gray-700 hover:bg-gray-100 hover:text-primary",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer select-none"
                      )}
                      onClick={() => {
                        if (isMobileOpen) {
                          closeMobileSidebar();
                        }
                      }}
                    >
                      <span className={cn(
                        "material-icons mr-3",
                        isActive ? "text-primary" : "text-gray-500 group-hover:text-primary"
                      )}>
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                  </Link>
                );
              }
              
              return null;
            })}
          </nav>
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <div 
            className="flex items-center text-gray-600 hover:text-primary cursor-pointer select-none"
            onClick={async (e) => {
              e.preventDefault();
              if (isMobileOpen) {
                closeMobileSidebar();
              }
              await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, { credentials: "include" });
              // Clear React Query cache
              queryClient.clear();
              window.location.href = "/landing";
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            <span className="material-icons mr-2">logout</span>
            <span>Sign Out</span>
          </div>
        </div>
      </div>
      
      {/* Close sidebar on mobile overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={closeMobileSidebar}
        />
      )}
    </aside>
  );
}
