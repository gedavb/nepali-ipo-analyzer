import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Ipo } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Icons from "../icons";

const IPOCalendarSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  
  const { data: ongoingIpos, isLoading: isLoadingOngoing } = useQuery<Ipo[]>({
    queryKey: ["/api/ipos/status/ongoing"],
  });
  
  const { data: upcomingIpos, isLoading: isLoadingUpcoming } = useQuery<Ipo[]>({
    queryKey: ["/api/ipos/status/upcoming"],
  });
  
  const { data: closedIpos, isLoading: isLoadingClosed } = useQuery<Ipo[]>({
    queryKey: ["/api/ipos/status/closed"],
  });
  
  const getRecommendationColor = (rating?: string) => {
    switch (rating) {
      case "Strong Buy":
        return "bg-success";
      case "Buy":
        return "bg-info";
      case "Hold":
        return "bg-warning";
      case "Avoid":
        return "bg-danger";
      default:
        return "bg-neutral-500";
    }
  };
  
  const getRecommendationIcon = (rating?: string) => {
    switch (rating) {
      case "Strong Buy":
        return <Icons.check className="h-4 w-4 mr-1" />;
      case "Buy":
        return <Icons.thumbsUp className="h-4 w-4 mr-1" />;
      case "Hold":
        return <Icons.scale className="h-4 w-4 mr-1" />;
      case "Avoid":
        return <Icons.alert className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  const formatDateRemaining = (closeDate: string | Date) => {
    const today = new Date();
    const close = new Date(closeDate);
    const diffTime = close.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Closed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days`;
  };
  
  const getTimeColor = (days: number) => {
    if (days <= 2) return "text-danger";
    if (days <= 5) return "text-warning";
    return "text-info";
  };
  
  const renderIPOCard = (ipo: Ipo) => {
    return (
      <Card key={ipo.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200 hover:shadow-md transition">
        <div className="bg-primary p-3">
          <div className="flex justify-between">
            <span className="text-white bg-white/20 rounded-full text-xs px-3 py-1">{ipo.sector}</span>
            {ipo.recommendationRating && (
              <span className={`text-white ${getRecommendationColor(ipo.recommendationRating)} rounded-full text-xs px-3 py-1 flex items-center`}>
                {getRecommendationIcon(ipo.recommendationRating)}
                {ipo.recommendationRating}
              </span>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-poppins font-semibold text-lg mb-1">{ipo.companyName}</h3>
          <p className="text-sm text-neutral-600 mb-3">
            {(ipo.issueSize / 100000).toFixed(2)} lakh shares at Rs. {ipo.issuePrice}/share
          </p>
          
          <div className="flex justify-between text-sm mb-4">
            <div>
              <div className="text-neutral-500">Issue Manager</div>
              <div className="font-medium">{ipo.issueManager}</div>
            </div>
            <div className="text-right">
              <div className="text-neutral-500">
                {activeTab === "closed" ? "Closed On" : "Closes In"}
              </div>
              <div className={`font-medium ${activeTab === "closed" ? "" : getTimeColor(parseInt(formatDateRemaining(ipo.closeDate)))}`}>
                {activeTab === "closed" 
                  ? new Date(ipo.closeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) 
                  : formatDateRemaining(ipo.closeDate)
                }
              </div>
            </div>
          </div>
          
          {activeTab !== "upcoming" && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subscription Rate</span>
                <span className="font-medium">{ipo.subscriptionRate}x</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className={`${ipo.subscriptionRate > 3 ? "bg-success" : ipo.subscriptionRate > 1.5 ? "bg-info" : "bg-warning"} h-2 rounded-full`} 
                  style={{ width: `${Math.min(ipo.subscriptionRate * 20, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <Link href={`/company/${ipo.id}`}>
              <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                Company Details
              </Button>
            </Link>
            
            {activeTab !== "closed" && (
              <Button className="bg-primary text-white hover:bg-primary-dark flex items-center">
                <Icons.package className="h-4 w-4 mr-1" />
                Apply Now
              </Button>
            )}
            
            {activeTab === "closed" && (
              <Button variant="outline" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200">
                View Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderSkeleton = () => {
    return Array(3).fill(0).map((_, index) => (
      <Card key={index} className="border border-neutral-200">
        <div className="bg-primary p-3">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
            <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
          </div>
        </div>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          </div>
          
          <Skeleton className="h-12 w-full rounded" />
          
          <div className="flex justify-between">
            <Skeleton className="h-10 w-32 rounded" />
            <Skeleton className="h-10 w-32 rounded" />
          </div>
        </CardContent>
      </Card>
    ));
  };
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-poppins font-semibold">IPO Calendar</h2>
        <Link href="/ipo-calendar" className="text-primary text-sm font-medium flex items-center">
          View all
          <Icons.arrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <Tabs defaultValue="ongoing" value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="mb-4 border-b border-neutral-200 w-full justify-start">
          <TabsTrigger value="ongoing" className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">
            Ongoing
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="closed" className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">
            Closed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingOngoing ? (
              renderSkeleton()
            ) : ongoingIpos && ongoingIpos.length > 0 ? (
              ongoingIpos.map(renderIPOCard)
            ) : (
              <p className="col-span-3 text-center py-8 text-neutral-500">No ongoing IPOs at the moment.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingUpcoming ? (
              renderSkeleton()
            ) : upcomingIpos && upcomingIpos.length > 0 ? (
              upcomingIpos.map(renderIPOCard)
            ) : (
              <p className="col-span-3 text-center py-8 text-neutral-500">No upcoming IPOs at the moment.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="closed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingClosed ? (
              renderSkeleton()
            ) : closedIpos && closedIpos.length > 0 ? (
              closedIpos.map(renderIPOCard)
            ) : (
              <p className="col-span-3 text-center py-8 text-neutral-500">No recently closed IPOs.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default IPOCalendarSection;
