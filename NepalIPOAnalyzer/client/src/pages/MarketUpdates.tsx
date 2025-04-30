import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  FiArrowUp, 
  FiArrowDown, 
  FiActivity, 
  FiCalendar, 
  FiClock,
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiBookOpen,
  FiFileText,
  FiExternalLink,
  FiSearch,
  FiCheckCircle
} from "react-icons/fi";
import { MarketStatistics } from "@/lib/types";

const MarketUpdates: React.FC = () => {
  const { data: marketStats, isLoading } = useQuery<MarketStatistics>({
    queryKey: ["/api/market-statistics"],
  });

  // Format date as "April 26, 2025"
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-l-4 border-gray-300">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-48 mb-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-48 mb-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const [activeNewsTab, setActiveNewsTab] = useState("daily");
  
  const stats: MarketStatistics = marketStats || {
    ongoingCount: 0,
    upcomingCount: 0,
    closedCount: 0,
    marketSentiment: 0,
    nepseIndex: 0,
    nepseChange: 0
  };
  
  // Mock news data for demonstration
  const marketNews = {
    daily: [
      {
        id: 1,
        title: "NEPSE surges 10 points after positive macroeconomic indicators",
        summary: "The Nepal Stock Exchange (NEPSE) index surged by 10 points on Tuesday, reaching 1,340.25, following the release of positive macroeconomic indicators by Nepal Rastra Bank.",
        source: "ShareSansar",
        date: "April 26, 2025",
        category: "Market Report"
      },
      {
        id: 2,
        title: "Finance Minister announces new policies to boost capital market",
        summary: "In a press conference today, Nepal's Finance Minister announced a series of new policies aimed at boosting the capital market and attracting foreign investment.",
        source: "Mero Lagani",
        date: "April 26, 2025",
        category: "Policy"
      },
      {
        id: 3,
        title: "Pure Energy IPO attracts record applications on day one",
        summary: "Pure Energy Ltd's Initial Public Offering (IPO) has attracted a record number of applications on its first day, with subscription exceeding 1.5 times by end of day.",
        source: "Nepal Stock Review",
        date: "April 26, 2025",
        category: "IPO News"
      }
    ],
    analysis: [
      {
        id: 1,
        title: "Hydropower Sector Analysis: Why investors are bullish",
        summary: "Hydropower companies have seen significant growth in their stock prices over the past quarter. This analysis explores the key drivers behind investor optimism in this sector.",
        author: "Ram Sharma",
        date: "April 24, 2025",
        readTime: "8 min read",
      },
      {
        id: 2,
        title: "Banking Sector Q1 2025 Review: Slow growth amid high liquidity",
        summary: "Our review of Q1 2025 performance of the banking sector in Nepal indicates slow growth despite high market liquidity. What does this mean for investors?",
        author: "Sita Karki",
        date: "April 22, 2025",
        readTime: "10 min read",
      }
    ],
    blog: [
      {
        id: 1,
        title: "Understanding IPO Valuation Methods in Nepal",
        summary: "This comprehensive guide explains the various IPO valuation methods used in Nepal and how retail investors can assess whether an IPO is fairly priced.",
        author: "Binod Thapa",
        date: "April 25, 2025",
        readTime: "12 min read",
        category: "Education"
      },
      {
        id: 2,
        title: "The Impact of Remittance Flows on Nepal's Stock Market",
        summary: "Remittance is a major contributor to Nepal's economy. This article examines the correlation between remittance flows and stock market performance.",
        author: "Anita Gurung",
        date: "April 21, 2025",
        readTime: "9 min read",
        category: "Research"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nepal Market Updates</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Current market trends, IPO statistics and investment climate analysis
        </p>
      </div>

      <div className="flex items-center justify-center mb-8 text-sm">
        <FiCalendar className="text-primary mr-2" />
        <span className="font-medium">{currentDate}</span>
        <span className="mx-3 text-gray-300">|</span>
        <FiClock className="text-primary mr-2" />
        <span className="font-medium">Latest update: Daily at 3:45 PM NPT</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="pb-2">
            <p className="text-xs text-gray-500 uppercase font-medium">NEPSE Index</p>
            <div className="flex items-center">
              <CardTitle className="text-2xl">{stats.nepseIndex.toFixed(2)}</CardTitle>
              <div className={`ml-2 flex items-center ${stats.nepseChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.nepseChange >= 0 ? (
                  <FiArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <FiArrowDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(stats.nepseChange).toFixed(2)} ({(Math.abs(stats.nepseChange) / stats.nepseIndex * 100).toFixed(2)}%)
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Current value of Nepal Stock Exchange Index</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-green-500">
          <CardHeader className="pb-2">
            <p className="text-xs text-gray-500 uppercase font-medium">Ongoing IPOs</p>
            <CardTitle className="text-2xl">{stats.ongoingCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Number of IPOs currently open for subscription</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-yellow-500">
          <CardHeader className="pb-2">
            <p className="text-xs text-gray-500 uppercase font-medium">Upcoming IPOs</p>
            <CardTitle className="text-2xl">{stats.upcomingCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Number of IPOs scheduled to open soon</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-purple-500">
          <CardHeader className="pb-2">
            <p className="text-xs text-gray-500 uppercase font-medium">Market Sentiment</p>
            <div className="flex items-center">
              <CardTitle className="text-2xl">{stats.marketSentiment}%</CardTitle>
              {stats.marketSentiment > 50 ? (
                <FiTrendingUp className="ml-2 h-5 w-5 text-green-600" />
              ) : (
                <FiTrendingDown className="ml-2 h-5 w-5 text-red-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Overall investor sentiment based on market indicators</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FiActivity className="mr-2 text-primary" />
              Recent IPO Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 mb-4">
                Most recently closed IPOs have shown strong subscription rates, indicating continued interest from investors despite market fluctuations. The average subscription rate stands at 4.2x for recently concluded issues.
              </p>
              <ul className="space-y-2">
                <li className="flex justify-between items-center text-sm">
                  <span>Average Day 1 Listing Gain:</span>
                  <span className="font-medium text-green-600">+25.8%</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span>Average Subscription Rate:</span>
                  <span className="font-medium">4.2x</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span>Most Oversubscribed IPO:</span>
                  <span className="font-medium">Nepal Micro Insurance (4.2x)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FiBarChart2 className="mr-2 text-primary" />
              Sector Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Hydropower</span>
                  <span className="font-medium text-green-600">Strong</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Banking</span>
                  <span className="font-medium text-yellow-600">Neutral</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Microfinance</span>
                  <span className="font-medium text-yellow-600">Neutral</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "55%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Insurance</span>
                  <span className="font-medium text-green-600">Strong</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Nepal Market News & Analysis</h2>
        
        <Tabs defaultValue={activeNewsTab} onValueChange={setActiveNewsTab} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="daily" className="text-sm">
              <FiFileText className="mr-2" /> Daily News
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-sm">
              <FiBarChart2 className="mr-2" /> Market Analysis
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-sm">
              <FiBookOpen className="mr-2" /> Blog Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {marketNews.daily.map(news => (
                <Card key={news.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-5 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs font-normal bg-neutral-50">
                          {news.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{news.date}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{news.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{news.summary}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Source: {news.source}</span>
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary flex items-center">
                          Read full article <FiExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="analysis">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {marketNews.analysis.map(analysis => (
                <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="px-3 py-1 font-normal">
                        In-depth Analysis
                      </Badge>
                      <span className="text-xs text-gray-500">{analysis.date}</span>
                    </div>
                    <h3 className="font-semibold text-xl mb-3">{analysis.title}</h3>
                    <p className="text-gray-600 mb-5">{analysis.summary}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                          {analysis.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium">{analysis.author}</p>
                          <p className="text-xs text-gray-500">{analysis.readTime}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-primary">
                        Read Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="blog">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {marketNews.blog.map(blog => (
                <Card key={blog.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gradient-to-r from-primary/80 to-secondary/80 flex items-center justify-center text-white">
                    <FiBookOpen className="h-12 w-12 opacity-50" />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">
                        {blog.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{blog.date}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{blog.summary}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {blog.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="ml-2 text-sm">{blog.author}</span>
                      </div>
                      <span className="text-xs text-gray-500">{blog.readTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="px-5 py-3 bg-gray-50 border-t">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Read full article
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Understanding Market Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">NEPSE Index</h4>
            <p className="text-gray-600">The Nepal Stock Exchange (NEPSE) Index is the main stock market index in Nepal, representing the performance of listed companies.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Market Sentiment</h4>
            <p className="text-gray-600">A measure of overall investor confidence and attitude toward the market, calculated based on trading volume, price movements, and other indicators.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Subscription Rate</h4>
            <p className="text-gray-600">Indicates how many times an IPO was oversubscribed. For example, a rate of 4.2x means investors applied for 4.2 times more shares than available.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Listing Gain</h4>
            <p className="text-gray-600">The percentage increase in share price on the first day of trading compared to the IPO price. Higher gains indicate strong investor demand.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 text-white p-6 rounded-lg mb-4">
        <div className="flex items-center mb-4">
          <FiCheckCircle className="h-6 w-6 text-green-400 mr-3" />
          <h3 className="text-xl font-semibold">Join our Market Newsletter</h3>
        </div>
        <p className="text-gray-300 mb-6">Get daily market updates, IPO alerts, and exclusive analysis directly to your inbox.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketUpdates;