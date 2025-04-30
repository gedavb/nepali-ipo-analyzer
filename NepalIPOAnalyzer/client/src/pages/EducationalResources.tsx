import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { EducationalResource } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Icons from "@/components/icons";
import { marked } from "marked";

const EducationalResources: React.FC = () => {
  const [matchResource, params] = useRoute("/education/:id");
  const resourceId = params?.id ? parseInt(params.id) : undefined;
  
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { data: resources, isLoading } = useQuery<EducationalResource[]>({
    queryKey: ["/api/educational-resources"],
  });
  
  const { data: singleResource, isLoading: isLoadingSingle } = useQuery<EducationalResource>({
    queryKey: [resourceId ? `/api/educational-resources/${resourceId}` : null],
    enabled: !!resourceId,
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
  
  const filteredResources = resources?.filter(resource => {
    if (activeTab === "all") return true;
    return resource.type === activeTab;
  });
  
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
  
  if (matchResource && resourceId) {
    if (isLoadingSingle) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-6" />
          <Skeleton className="h-[30rem] w-full" />
        </div>
      );
    }
    
    if (!singleResource) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center py-12">
              <Icons.alert className="h-12 w-12 text-danger mb-4" />
              <h2 className="text-xl font-semibold mb-2">Resource Not Found</h2>
              <p className="text-neutral-600 mb-4">The educational resource you are looking for could not be found.</p>
              <Link href="/education" className="text-primary font-medium">
                Back to Educational Resources
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/education" className="text-primary flex items-center mb-4">
            <Icons.arrowRight className="h-4 w-4 mr-1 transform rotate-180" />
            Back to Educational Resources
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-poppins font-bold mb-2">{singleResource.title}</h1>
          
          <div className="flex items-center mb-4">
            <span className={`inline-block text-xs px-2 py-1 rounded-full mr-2 ${getResourceTypeColor(singleResource.type)}`}>
              {singleResource.type.charAt(0).toUpperCase() + singleResource.type.slice(1)}
            </span>
            <span className={`inline-block text-xs px-2 py-1 rounded-full mr-4 ${getLevelColor(singleResource.level)}`}>
              {singleResource.level.charAt(0).toUpperCase() + singleResource.level.slice(1)}
            </span>
            
            <span className="text-sm text-neutral-500">
              {new Date(singleResource.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </div>
          
          <p className="text-neutral-600 text-lg">{singleResource.description}</p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            {singleResource.type === "video" ? (
              <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                {singleResource.content && singleResource.content.includes('youtube.com/embed/') ? (
                  <iframe 
                    className="w-full h-full" 
                    src={singleResource.content} 
                    title={singleResource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    frameBorder="0"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Icons.play className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-neutral-600">Video not available or invalid URL format</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="prose prose-neutral max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: singleResource.content 
                    ? marked.parse(singleResource.content)
                    : '<p>No content available.</p>' 
                }} />
              </div>
            )}
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-poppins font-semibold mb-4">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              {renderSkeleton()}
              {renderSkeleton()}
              {renderSkeleton()}
            </>
          ) : resources && resources.length > 0 ? (
            resources
              .filter(r => r.id !== resourceId && r.type === singleResource.type)
              .slice(0, 3)
              .map(renderResourceCard)
          ) : (
            <p className="col-span-3 text-center py-8 text-neutral-500">No related resources available.</p>
          )}
        </div>
      </div>
    );
  }
  
  // Main Educational Resources List View
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold mb-2">IPO Education Hub</h1>
        <p className="text-neutral-600">
          Learn about IPO investments in Nepal with our educational resources.
        </p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4 border-b border-neutral-200 w-full justify-start">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            All Resources
          </TabsTrigger>
          <TabsTrigger 
            value="article" 
            className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Articles
          </TabsTrigger>
          <TabsTrigger 
            value="video" 
            className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Videos
          </TabsTrigger>
          <TabsTrigger 
            value="guide" 
            className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Guides
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              {renderSkeleton()}
              {renderSkeleton()}
              {renderSkeleton()}
              {renderSkeleton()}
              {renderSkeleton()}
              {renderSkeleton()}
            </>
          ) : filteredResources && filteredResources.length > 0 ? (
            filteredResources.map(renderResourceCard)
          ) : (
            <p className="col-span-3 text-center py-8 text-neutral-500">
              No educational resources available for this category.
            </p>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default EducationalResources;
