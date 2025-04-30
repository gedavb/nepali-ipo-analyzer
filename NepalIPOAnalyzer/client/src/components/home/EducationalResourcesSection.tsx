import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { EducationalResource } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Icons from "../icons";

const EducationalResourcesSection: React.FC = () => {
  const { data: resources, isLoading } = useQuery<EducationalResource[]>({
    queryKey: ["/api/educational-resources"],
  });
  
  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-primary/10 text-primary";
      case "video":
        return "bg-info/10 text-info";
      case "guide":
        return "bg-success/10 text-success";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-primary/10 text-primary";
      case "intermediate":
        return "bg-secondary/10 text-secondary";
      case "advanced":
        return "bg-warning/10 text-warning";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };
  
  const renderResourceCard = (resource: EducationalResource) => {
    const isVideo = resource.type === "video";
    
    return (
      <Card key={resource.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200 hover:shadow-md transition">
        <div className="relative">
          <div 
            className="w-full h-40 bg-neutral-200"
            style={{ 
              backgroundImage: resource.thumbnailUrl ? `url(${resource.thumbnailUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 p-3 rounded-full">
                <Icons.play className="h-5 w-5 text-primary" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex mb-2">
            <span className={`inline-block text-xs px-2 py-1 rounded-full mr-2 ${getResourceTypeColor(resource.type)}`}>
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </span>
            <span className={`inline-block text-xs px-2 py-1 rounded-full ${getLevelColor(resource.level)}`}>
              {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
            </span>
          </div>
          <h3 className="font-poppins font-semibold text-lg mb-2">{resource.title}</h3>
          <p className="text-sm text-neutral-600 mb-3">{resource.description}</p>
          <Link href={`/education/${resource.id}`} className="text-primary text-sm font-medium flex items-center">
            {isVideo ? "Watch video" : "Read guide"}
            <Icons.arrowRight className="h-4 w-4 ml-1" />
          </Link>
        </CardContent>
      </Card>
    );
  };
  
  const renderSkeleton = () => (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200">
      <Skeleton className="w-full h-40" />
      <CardContent className="p-4 space-y-3">
        <div className="flex">
          <Skeleton className="h-6 w-20 rounded-full mr-2" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-28" />
      </CardContent>
    </Card>
  );

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-poppins font-semibold">IPO Education Hub</h2>
        <Link href="/education" className="text-primary text-sm font-medium flex items-center">
          View all resources
          <Icons.arrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {renderSkeleton()}
            {renderSkeleton()}
            {renderSkeleton()}
          </>
        ) : resources && resources.length > 0 ? (
          resources.slice(0, 3).map(renderResourceCard)
        ) : (
          <p className="col-span-3 text-center py-8 text-neutral-500">No educational resources available.</p>
        )}
      </div>
    </section>
  );
};

export default EducationalResourcesSection;
