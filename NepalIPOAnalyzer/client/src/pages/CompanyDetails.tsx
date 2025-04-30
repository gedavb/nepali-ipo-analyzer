import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { CompanyAnalysis } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Icons from "@/components/icons";

const CompanyDetails: React.FC = () => {
  const [, params] = useRoute("/company/:id");
  const companyId = params?.id ? parseInt(params.id) : 1;
  
  const { data: analysis, isLoading } = useQuery<CompanyAnalysis>({
    queryKey: [`/api/company-analysis/${companyId}`],
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
  
  const getRecommendationColor = (rating?: string) => {
    switch (rating) {
      case "Strong Buy":
        return "bg-success text-white";
      case "Buy":
        return "bg-info text-white";
      case "Hold":
        return "bg-warning text-white";
      case "Avoid":
        return "bg-danger text-white";
      default:
        return "bg-neutral-200 text-neutral-700";
    }
  };
  
  const getRecommendationIcon = (rating?: string) => {
    switch (rating) {
      case "Strong Buy":
        return <Icons.check className="h-5 w-5" />;
      case "Buy":
        return <Icons.thumbsUp className="h-5 w-5" />;
      case "Hold":
        return <Icons.scale className="h-5 w-5" />;
      case "Avoid":
        return <Icons.alert className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Card>
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-60" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center py-12">
            <Icons.alert className="h-12 w-12 text-danger mb-4" />
            <h2 className="text-xl font-semibold mb-2">Company Not Found</h2>
            <p className="text-neutral-600">The company information you are looking for could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Company Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-poppins font-bold mb-2 flex items-center">
          {analysis.company.name}
          {analysis.company.symbol && (
            <span className="ml-3 text-sm bg-neutral-200 text-neutral-700 py-1 px-3 rounded-full">
              NEPSE: {analysis.company.symbol}
            </span>
          )}
        </h1>
        <p className="text-neutral-600 text-lg">{analysis.company.sector}</p>
      </div>
      
      {/* Recommendation Badge */}
      <div className="mb-6">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-semibold ${getRecommendationColor(analysis.analysis.recommendation)}`}>
          {getRecommendationIcon(analysis.analysis.recommendation)}
          {analysis.analysis.recommendation || "No Recommendation"}
        </span>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4 border-b border-neutral-200 w-full justify-start">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="financials" 
            className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Financials
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Analysis
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Key Information */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-poppins font-semibold mb-4">Company Overview</h2>
                  <p className="text-neutral-600 mb-4">{analysis.analysis.analysis || "No overview information available."}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="font-medium text-lg mb-3">Key Information</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-neutral-600">Sector</span>
                          <span className="font-medium">{analysis.company.sector}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-neutral-600">Issue Size</span>
                          <span className="font-medium">65 lakh shares</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-neutral-600">Issue Price</span>
                          <span className="font-medium">Rs. 100/share</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-neutral-600">Issue Manager</span>
                          <span className="font-medium">NIBL Ace Capital</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-3">Expected Performance</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-neutral-600">Listing Gain</span>
                          <span className="font-medium text-success">{analysis.analysis.expectedListingGain || "N/A"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-neutral-600">Long-term Potential</span>
                          <span className="font-medium text-success">{analysis.analysis.longTermPotential || "N/A"}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recommendation */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-poppins font-semibold mb-4">NepalIPO Recommendation</h2>
                  
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 mb-4">
                    <div className="flex items-center mb-3">
                      {getRecommendationIcon(analysis.analysis.recommendation)}
                      <span className="ml-2 font-poppins font-semibold">{analysis.analysis.recommendation}</span>
                    </div>
                    <p className="text-sm text-neutral-600">{analysis.analysis.analysis}</p>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-3">Analysis Scores</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-neutral-600">Fundamental</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis.analysis.fundamentalScore)}`}>
                          {getScoreLabel(analysis.analysis.fundamentalScore)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${getScoreBarColor(analysis.analysis.fundamentalScore)} h-2 rounded-full`} 
                          style={{ width: `${analysis.analysis.fundamentalScore || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-neutral-600">Valuation</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis.analysis.valuationScore)}`}>
                          {getScoreLabel(analysis.analysis.valuationScore)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${getScoreBarColor(analysis.analysis.valuationScore)} h-2 rounded-full`} 
                          style={{ width: `${analysis.analysis.valuationScore || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-neutral-600">Sector Outlook</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis.analysis.sectorOutlookScore)}`}>
                          {getScoreLabel(analysis.analysis.sectorOutlookScore)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${getScoreBarColor(analysis.analysis.sectorOutlookScore)} h-2 rounded-full`} 
                          style={{ width: `${analysis.analysis.sectorOutlookScore || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-neutral-600">Management</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis.analysis.managementScore)}`}>
                          {getScoreLabel(analysis.analysis.managementScore)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${getScoreBarColor(analysis.analysis.managementScore)} h-2 rounded-full`} 
                          style={{ width: `${analysis.analysis.managementScore || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4">
                <Button className="w-full mb-3">
                  Apply for IPO
                </Button>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Icons.bookmark className="h-4 w-4 mr-2" />
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Financials Tab */}
        <TabsContent value="financials" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-poppins font-semibold mb-4">Financial Performance</h2>
              
              {analysis.financials ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium text-lg mb-3">Key Ratios</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Ratio</th>
                            <th className="px-3 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Value</th>
                            <th className="px-3 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Industry Avg</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          <tr>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600">EPS (TTM)</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">Rs. {analysis.financials.eps?.toFixed(2) || "N/A"}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right">Rs. 8.20</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600">P/E Ratio</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">{analysis.financials.peRatio?.toFixed(2) || "N/A"}x</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right">12.5x</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600">ROE</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">{analysis.financials.roe?.toFixed(1) || "N/A"}%</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right">12.5%</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600">Debt to Equity</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">{analysis.financials.debtToEquity?.toFixed(2) || "N/A"}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right">0.65</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600">Net Worth</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">Rs. {analysis.financials.netWorth?.toFixed(2) || "N/A"}B</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right">Rs. 0.85B</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Financial Highlights</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-neutral-600">Revenue (Last FY)</span>
                          <span className="font-medium">Rs. {analysis.financials.revenue?.toFixed(2) || "N/A"}M</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-neutral-600">Net Profit (Last FY)</span>
                          <span className="font-medium">Rs. {analysis.financials.netProfit?.toFixed(2) || "N/A"}M</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "70%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-neutral-600">Book Value per Share</span>
                          <span className="font-medium">Rs. {analysis.financials.bookValue?.toFixed(2) || "N/A"}</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <Icons.alert className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                  <p>Financial data is not available for this company.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analysis Tab */}
        <TabsContent value="analysis" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-poppins font-semibold mb-4">Detailed Analysis</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Investment Recommendation</h3>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center mb-2">
                    {getRecommendationIcon(analysis.analysis.recommendation)}
                    <span className="ml-2 font-poppins font-semibold">{analysis.analysis.recommendation}</span>
                  </div>
                  <p className="text-neutral-600">{analysis.analysis.analysis}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-lg mb-3">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                    <li>Strong financial performance with high EPS</li>
                    <li>Leading position in the hydropower sector</li>
                    <li>Good track record of project execution</li>
                    <li>Potential for dividend growth in coming years</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Risks</h3>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                    <li>Regulatory changes in hydropower sector</li>
                    <li>Weather dependency affecting power generation</li>
                    <li>Potential for higher competition in the future</li>
                    <li>Currency risks for equipment imports</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-lg mb-3">Performance Projections</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Metric</th>
                        <th className="px-3 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">1 Year</th>
                        <th className="px-3 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">3 Years</th>
                        <th className="px-3 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">5 Years</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      <tr>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600">Projected EPS</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">Rs. 14.50</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">Rs. 18.25</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">Rs. 22.10</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600">Expected ROE</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">16.8%</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">17.5%</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">18.2%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600">Expected Dividend</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">5%</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">8%</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">10%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Apply Button (Fixed at bottom on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200">
        <Button className="w-full">Apply for IPO</Button>
      </div>
    </div>
  );
};

export default CompanyDetails;
