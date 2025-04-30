// IPO Types
export interface Ipo {
  id: number;
  companyName: string;
  symbol?: string;
  sector: string;
  issueManager: string;
  issueSize: number;
  issuePrice: number;
  openDate: string | Date;
  closeDate: string | Date;
  allotmentDate: string | Date;
  status: "upcoming" | "ongoing" | "closed";
  recommendationRating?: "Strong Buy" | "Buy" | "Hold" | "Avoid";
  fundamentalScore?: number;
  valuationScore?: number;
  sectorOutlookScore?: number;
  managementScore?: number;
  expectedListingGain?: string;
  longTermPotential?: string;
  subscriptionRate: number;
  analysis?: string;
}

// Company Financials
export interface CompanyFinancials {
  id: number;
  ipoId: number;
  eps?: number;
  peRatio?: number;
  roe?: number;
  debtToEquity?: number;
  netWorth?: number;
  bookValue?: number;
  revenue?: number;
  netProfit?: number;
  year?: number;
}

// Educational Resource
export interface EducationalResource {
  id: number;
  title: string;
  description: string;
  type: "article" | "video" | "guide";
  level: "beginner" | "intermediate" | "advanced";
  content?: string;
  thumbnailUrl?: string;
  createdAt: string | Date;
}

// Company Analysis
export interface CompanyAnalysis {
  company: {
    name: string;
    symbol?: string;
    sector: string;
  };
  financials: CompanyFinancials | null;
  analysis: {
    recommendation?: string;
    fundamentalScore?: number;
    valuationScore?: number;
    sectorOutlookScore?: number;
    managementScore?: number;
    expectedListingGain?: string;
    longTermPotential?: string;
    analysis?: string;
  };
}

// Market Statistics
export interface MarketStatistics {
  ongoingCount: number;
  upcomingCount: number;
  closedCount: number;
  marketSentiment: number;
  nepseIndex: number;
  nepseChange: number;
}

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  preferences?: any;
}

// Watchlist item
export interface WatchlistItem {
  id: number;
  userId: number;
  ipoId: number;
  addedAt: string | Date;
  ipo?: Ipo;
}
