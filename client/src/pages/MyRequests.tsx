import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestCard from "@/components/requests/RequestCard";

export default function MyRequests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: requests, isLoading } = useQuery({
    queryKey: ["/api/requests/my", activeTab !== "all" ? activeTab : undefined],
    queryFn: async () => {
      const url = `/api/requests/my${activeTab !== "all" ? `?status=${activeTab}` : ""}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    },
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-heading font-bold text-gray-900">My Requests</h1>
          <div className="space-x-2">
            <Button onClick={() => navigate("/new-facilities-request")}>New Labor Request</Button>
            <Button variant="outline" onClick={() => navigate("/new-building-request")}>New Repair Request</Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse h-20 bg-gray-100 rounded"></div>
                  ))}
                </div>
              ) : requests?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {requests.map((request: any) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No {activeTab !== "all" ? activeTab : ""} requests found</p>
                  <div className="space-x-2 mt-4">
                    <Button 
                      variant="default"
                      onClick={() => navigate("/new-facilities-request")}
                    >
                      Create Labor Request
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/new-building-request")}
                    >
                      Create Repair Request
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
