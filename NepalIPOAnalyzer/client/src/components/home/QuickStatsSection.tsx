import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MarketStatistics } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Icons from "../icons";

const QuickStatsSection: React.FC = () => {
  const { data: statistics, isLoading } = useQuery<MarketStatistics>({
    queryKey: ["/api/market-statistics"],
  });

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NEPSE Index Card */}
        <Card className="border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-neutral-600 text-sm font-medium">NEPSE Index</h3>
              <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">Updated 5m ago</span>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                <div className="h-12 bg-neutral-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="flex items-baseline">
                  <span className="text-2xl font-semibold">{statistics?.nepseIndex.toFixed(2)}</span>
                  <span className={`ml-2 text-sm font-medium flex items-center ${statistics?.nepseChange >= 0 ? 'text-success' : 'text-danger'}`}>
                    <Icons.arrowUp className="h-4 w-4 mr-1" />
                    {statistics?.nepseChange > 0 ? "+" : ""}{statistics?.nepseChange.toFixed(2)}%
                  </span>
                </div>
                
                <div className="mt-3 h-12 w-full bg-neutral-50 rounded overflow-hidden">
                  <div className="w-full h-full relative">
                    <svg viewBox="0 0 100 20" className="w-full h-full">
                      <path 
                        d="M0,10 L10,8 L20,12 L30,10 L40,13 L50,11 L60,14 L70,13 L80,15 L90,12 L100,13" 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* IPO Stats Card */}
        <Card className="border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-neutral-600 text-sm font-medium">Current IPOs</h3>
              <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                {new Date().toLocaleString('ne-NP', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Ongoing</span>
                  <span className="font-semibold">{statistics?.ongoingCount} IPOs</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Coming Soon</span>
                  <span className="font-semibold">{statistics?.upcomingCount} IPOs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Recently Closed</span>
                  <span className="font-semibold">{statistics?.closedCount} IPOs</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Market Sentiment Card */}
        <Card className="border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-neutral-600 text-sm font-medium">Market Sentiment</h3>
              <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">Last 7 days</span>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-12 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center h-12 mb-2">
                  <div className="relative w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-info" 
                      style={{ width: `${statistics?.marketSentiment}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-danger">Bearish</span>
                  <span className="text-neutral-500">Neutral</span>
                  <span className="text-success">Bullish</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuickStatsSection;
