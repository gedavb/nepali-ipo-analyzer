import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CompanyAnalysis } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Icons from "../icons";

const CompanyAnalysisSection: React.FC = () => {
  // For the MVP, we're just showing Pure Energy's analysis
  const { data: analysis, isLoading } = useQuery<CompanyAnalysis>({
    queryKey: ["/api/company-analysis/1"],
  });
  
  const getScoreLabel = (score?: number) => {
    if (!score) return "N/A";
    if (score >= 80) return "Strong";
    if (score >= 65) return "Good";
    if (score >= 50) return "Average";
    return "Weak";
  };
  
  const getScoreColor = (score?: number) => {
    if (!score) return "text-neutral-500";
    if (score >= 80) return "text-success";
    if (score >= 65) return "text-info";
    if (score >= 50) return "text-warning";
    return "text-danger";
  };
  
  const getScoreBarColor = (score?: number) => {
    if (!score) return "bg-neutral-300";
    if (score >= 80) return "bg-success";
    if (score >= 65) return "bg-info";
    if (score >= 50) return "bg-warning";
    return "bg-danger";
  };
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-poppins font-semibold">Company Analysis</h2>
        <Link href="/companies" className="text-primary text-sm font-medium flex items-center">
          View all companies
          <Icons.arrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200">
        <CardContent className="p-5">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Icons.logo className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-poppins font-semibold text-lg">{analysis?.company.name}</h3>
                    <p className="text-sm text-neutral-600">NEPSE: {analysis?.company.symbol}</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Button asChild>
                    <Link href={`/company/${1}`}>Full Analysis</Link>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Financial Metrics */}
                <div>
                  <h4 className="font-medium text-neutral-800 mb-3">Financial Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">EPS (TTM)</span>
                      <span className="font-medium">Rs. {analysis?.financials?.eps?.toFixed(2) || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">P/E Ratio</span>
                      <span className="font-medium">{analysis?.financials?.peRatio?.toFixed(2) || "N/A"}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">ROE</span>
                      <span className="font-medium">{analysis?.financials?.roe?.toFixed(1) || "N/A"}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Debt to Equity</span>
                      <span className="font-medium">{analysis?.financials?.debtToEquity?.toFixed(2) || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Net Worth</span>
                      <span className="font-medium">Rs. {analysis?.financials?.netWorth?.toFixed(2) || "N/A"}B</span>
                    </div>
                  </div>
                </div>
                
                {/* Analysis Scores */}
                <div>
                  <h4 className="font-medium text-neutral-800 mb-3">Analysis Scores</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-neutral-600">Fundamental</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis?.analysis.fundamentalScore)}`}>
                          {getScoreLabel(analysis?.analysis.fundamentalScore)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${getScoreBarColor(analysis?.analysis.fundamentalScore)} h-2 rounded-full`} 
                          style={{ width: `${analysis?.analysis.fundamentalScore || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-neutral-600">Valuation</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis?.analysis.valuationScore)}`}>
                          {getScoreLabel(analysis?.analysis.valuationScore)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${getScoreBarColor(analysis?.analysis.valuationScore)} h-2 rounded-full`} 
                          style={{ width: `${analysis?.analysis.valuationScore || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-neutral-600">Sector Outlook</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis?.analysis.sectorOutlookScore)}`}>
                          {getScoreLabel(analysis?.analysis.sectorOutlookScore)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${getScoreBarColor(analysis?.analysis.sectorOutlookScore)} h-2 rounded-full`} 
                          style={{ width: `${analysis?.analysis.sectorOutlookScore || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-neutral-600">Management</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis?.analysis.managementScore)}`}>
                          {getScoreLabel(analysis?.analysis.managementScore)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${getScoreBarColor(analysis?.analysis.managementScore)} h-2 rounded-full`} 
                          style={{ width: `${analysis?.analysis.managementScore || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recommendation */}
                <div>
                  <h4 className="font-medium text-neutral-800 mb-3">NepalIPO Recommendation</h4>
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        {analysis?.analysis.recommendation === "Strong Buy" && (
                          <Icons.check className="h-5 w-5 mr-2 text-success" />
                        )}
                        {analysis?.analysis.recommendation === "Buy" && (
                          <Icons.thumbsUp className="h-5 w-5 mr-2 text-info" />
                        )}
                        {analysis?.analysis.recommendation === "Hold" && (
                          <Icons.scale className="h-5 w-5 mr-2 text-warning" />
                        )}
                        {analysis?.analysis.recommendation === "Avoid" && (
                          <Icons.alert className="h-5 w-5 mr-2 text-danger" />
                        )}
                        <span className="font-poppins font-semibold">{analysis?.analysis.recommendation}</span>
                      </div>
                      <p className="text-sm text-neutral-600">{analysis?.analysis.analysis}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Expected Listing Gain</span>
                        <span className="font-medium text-success">{analysis?.analysis.expectedListingGain}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Long-term Potential</span>
                        <span className="font-medium text-success">{analysis?.analysis.longTermPotential}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:hidden mt-4">
                <Button asChild className="w-full">
                  <Link href={`/company/${1}`}>Full Analysis</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default CompanyAnalysisSection;
