// import { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { queryClient, apiRequest } from "@/lib/queryClient";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Plus, Building2, Users, Settings } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface Organization {
//   id: number;
//   name: string;
//   slug: string;
//   domain?: string;
//   logoUrl?: string;
//   settings?: any;
//   createdAt: string;
//   userCount?: number;
//   buildingCount?: number;
//   image1Url?: string;
//   image2Url?: string;
// }

// export default function AdminOrganizations() {
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
//   const { toast } = useToast();

//   const API_URL = import.meta.env.API_URL || "";

//   const { data: organizations, isLoading } = useQuery({
//     queryKey: [`${API_URL}/api/admin/organizations`],
//   });

//   const createOrgMutation = useMutation({
//     mutationFn: (orgData: any) => {
//       return fetch(`${API_URL}/api/admin/organizations`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orgData),
//       }).then(res => {
//         if (!res.ok) throw new Error("Failed to create organization");
//         return res.json();
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [`${API_URL}/api/admin/organizations`] });
//       setShowCreateForm(false);
//       toast({ title: "Organization created successfully" });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error creating organization",
//         description: error.message,
//         variant: "destructive"
//       });
//     },
//   });

//   const updateOrgMutation = useMutation({
//     mutationFn: ({ id, ...data }: any) => {
//       return fetch(`${API_URL}/api/admin/organizations/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       }).then(res => {
//         if (!res.ok) throw new Error("Failed to update organization");
//         return res.json();
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [`${API_URL}/api/admin/organizations`] });
//       setSelectedOrg(null);
//       toast({ title: "Organization updated successfully" });
//     },
//   });

//   const deleteOrgMutation = useMutation({
//     mutationFn: (id: number) => {
//       return fetch(`${API_URL}/api/admin/organizations/${id}`, {
//         method: "DELETE",
//       }).then(async res => {
//         if (!res.ok) throw new Error("Failed to delete organization");
//         const text = await res.text();
//         return text ? JSON.parse(text) : {};
//         return res.json();
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [`${API_URL}/api/admin/organizations`] });
//       setSelectedOrg(null);
//       toast({ title: "Organization deleted successfully" });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error deleting organization",
//         description: error.message,
//         variant: "destructive"
//       });
//     },
//   });

//   const handleCreateOrg = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const orgData = {
//       name: formData.get("name"),
//       slug: formData.get("slug"),
//       domain: formData.get("domain") || null,
//       logoUrl: formData.get("logoUrl") || null,
//       image1Url: formData.get("image1Url") || null,
//       image2Url: formData.get("image2Url") || null,
//     };
//     createOrgMutation.mutate(orgData);
//   };

//   const handleUpdateOrg = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedOrg) return;

//     const formData = new FormData(e.currentTarget);
//     const orgData = {
//       id: selectedOrg.id,
//       name: formData.get("name"),
//       domain: formData.get("domain") || null,
//       logoUrl: formData.get("logoUrl") || null,
//       image1Url: formData.get("image1Url") || null,
//       image2Url: formData.get("image2Url") || null,
//     };
//     updateOrgMutation.mutate(orgData);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">Organization Management</h1>
//           <p className="text-gray-600">Manage client organizations and their settings</p>
//         </div>
//         <Button onClick={() => setShowCreateForm(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Organization
//         </Button>
//       </div>

//       {/* Create Organization Form */}
//       {showCreateForm && (
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>Create New Organization</CardTitle>
//             <CardDescription>
//               Add a new client organization to the system
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleCreateOrg} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="name">Organization Name</Label>
//                   <Input id="name" name="name" required placeholder="Acme School District" />
//                 </div>
//                 <div>
//                   <Label htmlFor="slug">URL Slug</Label>
//                   <Input id="slug" name="slug" required placeholder="acme-school" />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="domain">Email Domain (Optional)</Label>
//                   <Input id="domain" name="domain" placeholder="acmeschool.edu" />
//                 </div>
//                 <div>
//                   <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
//                   <Input id="logoUrl" name="logoUrl" placeholder="https://..." />
//                 </div>
//                 <div>
//                   <Label htmlFor="image1Url">Image 1 URL</Label>
//                   <Input id="image1Url" name="image1Url" placeholder="https://..." />
//                 </div>
//                 <div>
//                   <Label htmlFor="image2Url">Image 2 URL</Label>
//                   <Input id="image2Url" name="image2Url" placeholder="https://..." />
//                 </div>
                
//               </div>
//               <div className="flex gap-2">
//                 <Button type="submit" disabled={createOrgMutation.isPending}>
//                   {createOrgMutation.isPending ? "Creating..." : "Create Organization"}
//                 </Button>
//                 <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {/* Organizations List */}
//       <div className="grid gap-4">
//         {organizations && Array.isArray(organizations) ? organizations.map((org: Organization) => (
//           <Card key={org.id}>
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div className="flex items-center gap-3">
//                   {org.logoUrl ? (
//                     <img src={org.logoUrl} alt={org.name} className="h-12 w-12 rounded-lg object-cover" />
//                   ) : (
//                     <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
//                       <Building2 className="h-6 w-6 text-blue-600" />
//                     </div>
//                   )}
//                   {/* Show image1Url and image2Url side by side if present */}
//                   {/* {(org.image1Url || org.image2Url) && (
//                     <div className="flex gap-2 ml-2">
//                       {org.image1Url && (
//                         <img src={org.image1Url} alt={org.name + ' image 1'} className="h-12 w-12 rounded-lg object-cover border" />
//                       )}
//                       {org.image2Url && (
//                         <img src={org.image2Url} alt={org.name + ' image 2'} className="h-12 w-12 rounded-lg object-cover border" />
//                       )}
//                     </div>
//                   )} */}
//                   <div>
//                     <CardTitle>{org.name}</CardTitle>
//                     <CardDescription>
//                       Slug: {org.slug} {org.domain && `• Domain: ${org.domain}`}
//                     </CardDescription>
//                   </div>
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setSelectedOrg(org)}
//                 >
//                   <Settings className="h-4 w-4 mr-2" />
//                   Manage
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex gap-6 text-sm text-gray-600">
//                 <div className="flex items-center gap-1">
//                   <Users className="h-4 w-4" />
//                   {org.userCount || 0} Users
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Building2 className="h-4 w-4" />
//                   {org.buildingCount || 0} Buildings
//                 </div>
//                 <div>Created: {new Date(org.createdAt).toLocaleDateString()}</div>
//               </div>
//             </CardContent>
//           </Card>
//         )) : (
//           <div className="text-center py-8">
//             <p className="text-gray-500">No organizations found</p>
//           </div>
//         )}
//       </div>

//       {/* Edit Organization Modal */}
//       {selectedOrg && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle>Edit Organization</CardTitle>
//               <CardDescription>Update organization settings</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleUpdateOrg} className="space-y-4">
//                 <div>
//                   <Label htmlFor="edit-name">Organization Name</Label>
//                   <Input
//                     id="edit-name"
//                     name="name"
//                     defaultValue={selectedOrg.name}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-domain">Email Domain</Label>
//                   <Input
//                     id="edit-domain"
//                     name="domain"
//                     defaultValue={selectedOrg.domain || ""}
//                     placeholder="organization.edu"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-logoUrl">Logo URL</Label>
//                   <Input
//                     id="edit-logoUrl"
//                     name="logoUrl"
//                     defaultValue={selectedOrg.logoUrl || ""}
//                     placeholder="https://..."
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-image1Url">Image 1 URL</Label>
//                   <Input
//                     id="edit-image1Url"
//                     name="image1Url"
//                     defaultValue={selectedOrg.image1Url || ""}
//                     placeholder="https://..."
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-image2Url">Image 2 URL</Label>
//                   <Input
//                     id="edit-image2Url"
//                     name="image2Url"
//                     defaultValue={selectedOrg.image2Url || ""}
//                     placeholder="https://..."
//                   />
//                 </div>
//                 <div className="flex gap-2">
//                   <Button type="submit" disabled={updateOrgMutation.isPending}>
//                     {updateOrgMutation.isPending ? "Updating..." : "Update"}
//                   </Button>
//                   <Button
//                     type="button"
//                     disabled={deleteOrgMutation.isPending}
//                     className="bg-red-800 hover:bg-red-900 text-white"
//                     onClick={() => selectedOrg && deleteOrgMutation.mutate(selectedOrg.id)}
//                   >
//                     {deleteOrgMutation.isPending ? "Deleting..." : "Delete"}
//                   </Button>
//                   <Button type="button" variant="outline" onClick={() => setSelectedOrg(null)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Building2, Users, Settings, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Organization {
  id: number;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  settings?: any;
  createdAt: string;
  userCount?: number;
  buildingCount?: number;
  image1Url?: string;
  image2Url?: string;
}

export default function AdminOrganizations() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const { toast } = useToast();

  const API_URL = import.meta.env.API_URL || "";

  const { data: organizations, isLoading } = useQuery({
    queryKey: [`${API_URL}/api/admin/organizations`],
  });

  const createOrgMutation = useMutation({
    mutationFn: (orgData: any) => {
      return fetch(`${API_URL}/api/admin/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgData),
      }).then(res => {
        if (!res.ok) throw new Error("Failed to create organization");
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_URL}/api/admin/organizations`] });
      setShowCreateForm(false);
      toast({ title: "Organization created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating organization",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateOrgMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => {
      return fetch(`${API_URL}/api/admin/organizations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) throw new Error("Failed to update organization");
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_URL}/api/admin/organizations`] });
      setSelectedOrg(null);
      toast({ title: "Organization updated successfully" });
    },
  });

  const deleteOrgMutation = useMutation({
    mutationFn: (id: number) => {
      return fetch(`${API_URL}/api/admin/organizations/${id}`, {
        method: "DELETE",
      }).then(async res => {
        if (!res.ok) throw new Error("Failed to delete organization");
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_URL}/api/admin/organizations`] });
      setSelectedOrg(null);
      toast({ title: "Organization deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting organization",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const handleCreateOrg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orgData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      domain: formData.get("domain") || null,
      logoUrl: formData.get("logoUrl") || null,
      image1Url: formData.get("image1Url") || null,
      image2Url: formData.get("image2Url") || null,
    };
    createOrgMutation.mutate(orgData);
  };

  const handleUpdateOrg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrg) return;

    const formData = new FormData(e.currentTarget);
    const orgData = {
      id: selectedOrg.id,
      name: formData.get("name"),
      domain: formData.get("domain") || null,
      logoUrl: formData.get("logoUrl") || null,
      image1Url: formData.get("image1Url") || null,
      image2Url: formData.get("image2Url") || null,
    };
    updateOrgMutation.mutate(orgData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
        {/* Header Section - Responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Organization Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage client organizations and their settings</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="w-full sm:w-auto"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        </div>

        {/* Create Organization Form - Responsive */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Create New Organization</CardTitle>
                  <CardDescription className="text-sm">
                    Add a new client organization to the system
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                  className="sm:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOrg} className="space-y-4">
                {/* Primary Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Organization Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      required 
                      placeholder="Acme School District"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-medium">URL Slug *</Label>
                    <Input 
                      id="slug" 
                      name="slug" 
                      required 
                      placeholder="acme-school"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain" className="text-sm font-medium">Email Domain</Label>
                    <Input 
                      id="domain" 
                      name="domain" 
                      placeholder="acmeschool.edu"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl" className="text-sm font-medium">Logo URL</Label>
                    <Input 
                      id="logoUrl" 
                      name="logoUrl" 
                      placeholder="https://..."
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Image URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image1Url" className="text-sm font-medium">Image 1 URL</Label>
                    <Input 
                      id="image1Url" 
                      name="image1Url" 
                      placeholder="https://..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image2Url" className="text-sm font-medium">Image 2 URL</Label>
                    <Input 
                      id="image2Url" 
                      name="image2Url" 
                      placeholder="https://..."
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createOrgMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {createOrgMutation.isPending ? "Creating..." : "Create Organization"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Organizations Grid - Responsive */}
        <div className="space-y-4">
          {organizations && Array.isArray(organizations) ? organizations.map((org: Organization) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Organization Info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      {org.logoUrl ? (
                        <img 
                          src={org.logoUrl || "/placeholder.svg"} 
                          alt={org.name} 
                          className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                    </div>

                    {/* Organization Details */}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg sm:text-xl truncate">{org.name}</CardTitle>
                      <CardDescription className="text-sm space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {org.slug}
                          </span>
                          {org.domain && (
                            <span className="text-gray-500">
                              • {org.domain}
                            </span>
                          )}
                        </div>
                      </CardDescription>
                    </div>

                    {/* Additional Images - Hidden on mobile, shown on larger screens */}
                    {(org.image1Url || org.image2Url) && (
                      <div className="hidden lg:flex gap-2 flex-shrink-0">
                        {org.image1Url && (
                          <img 
                            src={org.image1Url || "/placeholder.svg"} 
                            alt={`${org.name} image 1`} 
                            className="h-12 w-12 rounded-lg object-cover border"
                          />
                        )}
                        {org.image2Url && (
                          <img 
                            src={org.image2Url || "/placeholder.svg"} 
                            alt={`${org.name} image 2`} 
                            className="h-12 w-12 rounded-lg object-cover border"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Manage Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrg(org)}
                    className="w-full sm:w-auto flex-shrink-0"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Stats and Info */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>{org.userCount || 0} Users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span>{org.buildingCount || 0} Buildings</span>
                  </div>
                  <div className="text-xs sm:text-sm">
                    Created: {new Date(org.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Mobile Images - Show on mobile only */}
                {(org.image1Url || org.image2Url) && (
                  <div className="flex gap-2 mt-3 lg:hidden">
                    {org.image1Url && (
                      <img 
                        src={org.image1Url || "/placeholder.svg"} 
                        alt={`${org.name} image 1`} 
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                    )}
                    {org.image2Url && (
                      <img 
                        src={org.image2Url || "/placeholder.svg"} 
                        alt={`${org.name} image 2`} 
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No organizations found</p>
              <p className="text-gray-400 text-sm">Create your first organization to get started</p>
            </div>
          )}
        </div>

        {/* Edit Organization Dialog - Responsive */}
        <Dialog open={!!selectedOrg} onOpenChange={() => setSelectedOrg(null)}>
          <DialogContent className="w-full max-w-md sm:max-w-lg mx-4">
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
              <DialogDescription>Update organization settings</DialogDescription>
            </DialogHeader>
            
            {selectedOrg && (
              <form onSubmit={handleUpdateOrg} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium">Organization Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={selectedOrg.name}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-domain" className="text-sm font-medium">Email Domain</Label>
                  <Input
                    id="edit-domain"
                    name="domain"
                    defaultValue={selectedOrg.domain || ""}
                    placeholder="organization.edu"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-logoUrl" className="text-sm font-medium">Logo URL</Label>
                  <Input
                    id="edit-logoUrl"
                    name="logoUrl"
                    defaultValue={selectedOrg.logoUrl || ""}
                    placeholder="https://..."
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-image1Url" className="text-sm font-medium">Image 1 URL</Label>
                    <Input
                      id="edit-image1Url"
                      name="image1Url"
                      defaultValue={selectedOrg.image1Url || ""}
                      placeholder="https://..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-image2Url" className="text-sm font-medium">Image 2 URL</Label>
                    <Input
                      id="edit-image2Url"
                      name="image2Url"
                      defaultValue={selectedOrg.image2Url || ""}
                      placeholder="https://..."
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={updateOrgMutation.isPending}
                    className="w-full sm:flex-1"
                  >
                    {updateOrgMutation.isPending ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    type="button"
                    disabled={deleteOrgMutation.isPending}
                    variant="destructive"
                    onClick={() => selectedOrg && deleteOrgMutation.mutate(selectedOrg.id)}
                    className="w-full sm:w-auto"
                  >
                    {deleteOrgMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedOrg(null)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
