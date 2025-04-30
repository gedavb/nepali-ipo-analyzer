import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FiBarChart2, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { Ipo } from "@/lib/types";
import { cn } from "@/lib/utils";

const Companies: React.FC = () => {
  const { data: ongoingIpos, isLoading: ongoingLoading } = useQuery<Ipo[]>({
    queryKey: ["/api/ipos/status/ongoing"],
  });

  const { data: upcomingIpos, isLoading: upcomingLoading } = useQuery<Ipo[]>({
    queryKey: ["/api/ipos/status/upcoming"],
  });

  const { data: closedIpos, isLoading: closedLoading } = useQuery<Ipo[]>({
    queryKey: ["/api/ipos/status/closed"],
  });

  const renderIpoCard = (ipo: Ipo) => {
    return (
      <Card key={ipo.id} className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-1 text-xl">{ipo.companyName}</CardTitle>
              <CardDescription className="text-sm">
                {ipo.symbol && <span className="font-mono">{ipo.symbol}</span>} • {ipo.sector}
              </CardDescription>
            </div>
            <Badge
              className={cn(
                "font-normal",
                ipo.recommendationRating === "Strong Buy" && "bg-green-600",
                ipo.recommendationRating === "Buy" && "bg-green-500",
                ipo.recommendationRating === "Hold" && "bg-yellow-500",
                ipo.recommendationRating === "Avoid" && "bg-red-500"
              )}
            >
              {ipo.recommendationRating || "Not Rated"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 py-2 flex-grow">
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground">Issue Size</div>
            <div className="font-medium">{(ipo.issueSize / 1000000).toFixed(2)} M shares</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground">Issue Price</div>
            <div className="font-medium">NPR {ipo.issuePrice}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground">Subscription Rate</div>
            <div className="font-medium">
              {ipo.status === "upcoming" ? "Pending" : `${ipo.subscriptionRate}x`}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground">Issue Manager</div>
            <div className="font-medium text-sm truncate" title={ipo.issueManager}>
              {ipo.issueManager}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <div className="flex space-x-3">
            <div className="flex items-center space-x-1 text-green-600">
              <FiTrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">{ipo.fundamentalScore}/100</span>
            </div>
            <div className="flex items-center space-x-1 text-violet-600">
              <FiBarChart2 className="h-4 w-4" />
              <span className="text-xs font-medium">{ipo.sectorOutlookScore}/100</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-600">
              <FiDollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">{ipo.valuationScore}/100</span>
            </div>
          </div>
          <Link href={`/company/${ipo.id}`} className="text-sm font-medium text-primary hover:underline">
            View Details
          </Link>
        </CardFooter>
      </Card>
    );
  };

  const renderSkeletons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <Card key={index} className="h-full">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-2/3 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 py-2">
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </CardFooter>
        </Card>
      ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive list of companies with active, upcoming, and past IPOs in Nepal
        </p>
      </div>

      <Tabs defaultValue="ongoing" className="max-w-5xl mx-auto">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="ongoing">Ongoing IPOs</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming IPOs</TabsTrigger>
            <TabsTrigger value="closed">Past IPOs</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="ongoing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingLoading
              ? renderSkeletons(3)
              : ongoingIpos && ongoingIpos.length > 0
              ? ongoingIpos.map((ipo: Ipo) => renderIpoCard(ipo))
              : <div className="col-span-full text-center py-12 text-gray-500">No ongoing IPOs at the moment</div>}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingLoading
              ? renderSkeletons(3)
              : upcomingIpos && upcomingIpos.length > 0
              ? upcomingIpos.map((ipo: Ipo) => renderIpoCard(ipo))
              : <div className="col-span-full text-center py-12 text-gray-500">No upcoming IPOs at the moment</div>}
          </div>
        </TabsContent>

        <TabsContent value="closed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {closedLoading
              ? renderSkeletons(3)
              : closedIpos && closedIpos.length > 0
              ? closedIpos.map((ipo: Ipo) => renderIpoCard(ipo))
              : <div className="col-span-full text-center py-12 text-gray-500">No past IPOs available</div>}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 max-w-4xl mx-auto bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Financial Terms Explained</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Fundamental Score</h4>
            <p className="text-blue-900">Measures the company's financial health, growth potential, and business model strength on a scale of 0-100.</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Sector Outlook Score</h4>
            <p className="text-blue-900">Evaluates the growth prospects and stability of the industry sector on a scale of 0-100.</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Valuation Score</h4>
            <p className="text-blue-900">Assesses whether the IPO is fairly priced relative to peers and financial metrics on a scale of 0-100.</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Subscription Rate</h4>
            <p className="text-blue-900">Shows how many times an IPO was oversubscribed. A higher rate indicates stronger demand from investors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;