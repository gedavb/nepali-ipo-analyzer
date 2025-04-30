import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DayPicker } from "react-day-picker";
import { addDays, format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Ipo } from "@/lib/types";
import Icons from "@/components/icons";

const IPOCalendar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [iposOnSelectedDate, setIposOnSelectedDate] = useState<Ipo[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  
  const { data: ongoingIpos, isLoading: isLoadingOngoing } = useQuery<Ipo[]>({
    queryKey: ["/api/ipos/status/ongoing"],
  });
  
  const { data: upcomingIpos, isLoading: isLoadingUpcoming } = useQuery<Ipo[]>({
    queryKey: ["/api/ipos/status/upcoming"],
  });
  
  const { data: closedIpos, isLoading: isLoadingClosed } = useQuery<Ipo[]>({
    queryKey: ["/api/ipos/status/closed"],
  });
  
  // Collect all IPOs for the calendar
  const allIpos = useMemo(() => {
    return [
      ...(ongoingIpos || []),
      ...(upcomingIpos || []),
      ...(closedIpos || [])
    ];
  }, [ongoingIpos, upcomingIpos, closedIpos]);
  
  // Create calendar highlights
  const ipoDatesByStatus = useMemo(() => {
    const result = {
      openDates: [] as Date[],
      closeDates: [] as Date[],
      allotmentDates: [] as Date[],
      iposByDate: new Map<string, Ipo[]>()
    };
    
    allIpos.forEach(ipo => {
      // Add open dates
      if (ipo.openDate) {
        const openDate = new Date(ipo.openDate);
        result.openDates.push(openDate);
        
        const dateKey = format(openDate, 'yyyy-MM-dd');
        if (!result.iposByDate.has(dateKey)) {
          result.iposByDate.set(dateKey, []);
        }
        result.iposByDate.get(dateKey)?.push(ipo);
      }
      
      // Add close dates
      if (ipo.closeDate) {
        const closeDate = new Date(ipo.closeDate);
        result.closeDates.push(closeDate);
        
        const dateKey = format(closeDate, 'yyyy-MM-dd');
        if (!result.iposByDate.has(dateKey)) {
          result.iposByDate.set(dateKey, []);
        }
        result.iposByDate.get(dateKey)?.push(ipo);
      }
      
      // Add allotment dates
      if (ipo.allotmentDate) {
        const allotmentDate = new Date(ipo.allotmentDate);
        result.allotmentDates.push(allotmentDate);
        
        const dateKey = format(allotmentDate, 'yyyy-MM-dd');
        if (!result.iposByDate.has(dateKey)) {
          result.iposByDate.set(dateKey, []);
        }
        result.iposByDate.get(dateKey)?.push(ipo);
      }
    });
    
    return result;
  }, [allIpos]);
  
  // Update selected date IPOs
  useEffect(() => {
    if (selectedDate) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const ipos = ipoDatesByStatus.iposByDate.get(dateKey) || [];
      setIposOnSelectedDate(ipos);
    } else {
      setIposOnSelectedDate([]);
    }
  }, [selectedDate, ipoDatesByStatus]);
  
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
            <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
              Company Details
            </Button>
            
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
    return Array(6).fill(0).map((_, index) => (
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
  
  // Calendar modifiers
  const modifiers = useMemo(() => {
    return {
      openDates: ipoDatesByStatus.openDates,
      closeDates: ipoDatesByStatus.closeDates,
      allotmentDates: ipoDatesByStatus.allotmentDates
    };
  }, [ipoDatesByStatus]);

  // Calendar modifier styles
  const modifiersStyles = {
    openDates: { backgroundColor: 'rgba(0, 128, 255, 0.2)' },
    closeDates: { backgroundColor: 'rgba(255, 0, 0, 0.2)' },
    allotmentDates: { backgroundColor: 'rgba(0, 128, 0, 0.2)' }
  };

  // Render IPO date legend
  const renderDateLegend = () => (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
      <div className="flex items-center">
        <div className="w-4 h-4 rounded-full bg-blue-200 mr-2"></div>
        <span className="text-sm">Open Date</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 rounded-full bg-red-200 mr-2"></div>
        <span className="text-sm">Close Date</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 rounded-full bg-green-200 mr-2"></div>
        <span className="text-sm">Allotment Date</span>
      </div>
    </div>
  );

  // Render selected date IPOs
  const renderSelectedDateIPOs = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <h3 className="text-lg font-semibold mb-4">
        IPOs on {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
      </h3>
      
      {iposOnSelectedDate.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {iposOnSelectedDate.map(renderIPOCard)}
        </div>
      ) : (
        <p className="text-center py-6 text-neutral-500 bg-neutral-50 rounded-lg border border-neutral-200">
          No IPO events scheduled for this date.
        </p>
      )}
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold mb-2">IPO Calendar</h1>
        <p className="text-neutral-600">
          Track all ongoing, upcoming, and recently closed IPOs in Nepal's stock market.
        </p>
      </div>
      
      <div className="flex justify-end mb-4">
        <div className="bg-white rounded-lg border border-neutral-200 p-1 inline-flex">
          <Button 
            variant={viewMode === "list" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("list")}
            className="flex items-center"
          >
            <Icons.list className="h-4 w-4 mr-1" />
            List View
          </Button>
          <Button 
            variant={viewMode === "calendar" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("calendar")}
            className="flex items-center"
          >
            <Icons.calendar className="h-4 w-4 mr-1" />
            Calendar View
          </Button>
        </div>
      </div>
      
      {viewMode === "list" ? (
        <Tabs defaultValue="ongoing" value={activeTab} onValueChange={setActiveTab} className="mb-6">
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {isLoadingOngoing ? (
                renderSkeleton()
              ) : ongoingIpos && ongoingIpos.length > 0 ? (
                ongoingIpos.map(renderIPOCard)
              ) : (
                <p className="col-span-3 text-center py-8 text-neutral-500">No ongoing IPOs at the moment.</p>
              )}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {isLoadingUpcoming ? (
                renderSkeleton()
              ) : upcomingIpos && upcomingIpos.length > 0 ? (
                upcomingIpos.map(renderIPOCard)
              ) : (
                <p className="col-span-3 text-center py-8 text-neutral-500">No upcoming IPOs at the moment.</p>
              )}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="closed" className="mt-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {isLoadingClosed ? (
                renderSkeleton()
              ) : closedIpos && closedIpos.length > 0 ? (
                closedIpos.map(renderIPOCard)
              ) : (
                <p className="col-span-3 text-center py-8 text-neutral-500">No recently closed IPOs.</p>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h3 className="text-lg font-semibold mb-4">Select a Date</h3>
              <div className="p-4 bg-white rounded-lg border border-neutral-200">
                <style>
                  {`
                    .rdp-day_today:not(.rdp-day_outside) {
                      font-weight: bold;
                      color: #ff00ff;
                    }
                  `}
                </style>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  className="mx-auto"
                />
                {renderDateLegend()}
              </div>
            </div>
            
            <div className="md:w-1/2">
              {renderSelectedDateIPOs()}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IPOCalendar;
