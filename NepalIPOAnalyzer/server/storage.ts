import { 
  users, type User, type InsertUser,
  ipos, type Ipo, type InsertIpo,
  companyFinancials, type CompanyFinancials, type InsertCompanyFinancials,
  educationalResources, type EducationalResource, type InsertEducationalResource,
  watchlists, type Watchlist, type InsertWatchlist
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // IPO methods
  getIpo(id: number): Promise<Ipo | undefined>;
  getIpos(): Promise<Ipo[]>;
  getIposByStatus(status: string): Promise<Ipo[]>;
  createIpo(ipo: InsertIpo): Promise<Ipo>;
  updateIpo(id: number, ipo: Partial<InsertIpo>): Promise<Ipo | undefined>;
  
  // Company Financials methods
  getCompanyFinancials(ipoId: number): Promise<CompanyFinancials[]>;
  createCompanyFinancials(financials: InsertCompanyFinancials): Promise<CompanyFinancials>;
  
  // Educational Resources methods
  getEducationalResources(): Promise<EducationalResource[]>;
  getEducationalResourcesByType(type: string): Promise<EducationalResource[]>;
  getEducationalResource(id: number): Promise<EducationalResource | undefined>;
  createEducationalResource(resource: InsertEducationalResource): Promise<EducationalResource>;
  
  // Watchlist methods
  getWatchlistByUser(userId: number): Promise<Watchlist[]>;
  addToWatchlist(watchlist: InsertWatchlist): Promise<Watchlist>;
  removeFromWatchlist(userId: number, ipoId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ipos: Map<number, Ipo>;
  private companyFinancials: Map<number, CompanyFinancials>;
  private educationalResources: Map<number, EducationalResource>;
  private watchlists: Map<number, Watchlist>;
  
  private currentUserId: number;
  private currentIpoId: number;
  private currentFinancialsId: number;
  private currentResourceId: number;
  private currentWatchlistId: number;

  constructor() {
    this.users = new Map();
    this.ipos = new Map();
    this.companyFinancials = new Map();
    this.educationalResources = new Map();
    this.watchlists = new Map();
    
    this.currentUserId = 1;
    this.currentIpoId = 1;
    this.currentFinancialsId = 1;
    this.currentResourceId = 1;
    this.currentWatchlistId = 1;
    
    // Initialize with sample data for MVP
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // IPO methods
  async getIpo(id: number): Promise<Ipo | undefined> {
    return this.ipos.get(id);
  }
  
  async getIpos(): Promise<Ipo[]> {
    return Array.from(this.ipos.values());
  }
  
  async getIposByStatus(status: string): Promise<Ipo[]> {
    return Array.from(this.ipos.values()).filter(
      (ipo) => ipo.status === status,
    );
  }
  
  async createIpo(insertIpo: InsertIpo): Promise<Ipo> {
    const id = this.currentIpoId++;
    const ipo: Ipo = { ...insertIpo, id };
    this.ipos.set(id, ipo);
    return ipo;
  }
  
  async updateIpo(id: number, ipoUpdate: Partial<InsertIpo>): Promise<Ipo | undefined> {
    const existingIpo = this.ipos.get(id);
    if (!existingIpo) return undefined;
    
    const updatedIpo = { ...existingIpo, ...ipoUpdate };
    this.ipos.set(id, updatedIpo);
    return updatedIpo;
  }
  
  // Company Financials methods
  async getCompanyFinancials(ipoId: number): Promise<CompanyFinancials[]> {
    return Array.from(this.companyFinancials.values()).filter(
      (financials) => financials.ipoId === ipoId,
    );
  }
  
  async createCompanyFinancials(insertFinancials: InsertCompanyFinancials): Promise<CompanyFinancials> {
    const id = this.currentFinancialsId++;
    const financials: CompanyFinancials = { ...insertFinancials, id };
    this.companyFinancials.set(id, financials);
    return financials;
  }
  
  // Educational Resources methods
  async getEducationalResources(): Promise<EducationalResource[]> {
    return Array.from(this.educationalResources.values());
  }
  
  async getEducationalResourcesByType(type: string): Promise<EducationalResource[]> {
    return Array.from(this.educationalResources.values()).filter(
      (resource) => resource.type === type,
    );
  }
  
  async getEducationalResource(id: number): Promise<EducationalResource | undefined> {
    return this.educationalResources.get(id);
  }
  
  async createEducationalResource(insertResource: InsertEducationalResource): Promise<EducationalResource> {
    const id = this.currentResourceId++;
    const now = new Date();
    const resource: EducationalResource = { ...insertResource, id, createdAt: now };
    this.educationalResources.set(id, resource);
    return resource;
  }
  
  // Watchlist methods
  async getWatchlistByUser(userId: number): Promise<Watchlist[]> {
    return Array.from(this.watchlists.values()).filter(
      (watchlist) => watchlist.userId === userId,
    );
  }
  
  async addToWatchlist(insertWatchlist: InsertWatchlist): Promise<Watchlist> {
    const id = this.currentWatchlistId++;
    const now = new Date();
    const watchlist: Watchlist = { ...insertWatchlist, id, addedAt: now };
    this.watchlists.set(id, watchlist);
    return watchlist;
  }
  
  async removeFromWatchlist(userId: number, ipoId: number): Promise<boolean> {
    const watchlistItem = Array.from(this.watchlists.values()).find(
      (w) => w.userId === userId && w.ipoId === ipoId,
    );
    
    if (watchlistItem) {
      this.watchlists.delete(watchlistItem.id);
      return true;
    }
    
    return false;
  }
  
  // Initialize with sample data for MVP
  private initializeData() {
    // Sample IPOs
    const pureEnergyIpo: InsertIpo = {
      companyName: "Pure Energy Ltd.",
      symbol: "PURE",
      sector: "Hydropower",
      issueManager: "NIBL Ace Capital",
      issueSize: 6500000, // 65 lakh shares
      issuePrice: 100,
      openDate: new Date("2024-04-15"),
      closeDate: new Date("2024-04-30"),
      allotmentDate: new Date("2024-05-15"),
      status: "ongoing",
      recommendationRating: "Strong Buy",
      fundamentalScore: 85,
      valuationScore: 70,
      sectorOutlookScore: 90,
      managementScore: 55,
      expectedListingGain: "+35-40%",
      longTermPotential: "High",
      subscriptionRate: 3.8,
      analysis: "Pure Energy shows strong fundamentals with high projected growth in the hydropower sector."
    };
    this.createIpo(pureEnergyIpo).then(ipo => {
      // Add company financials for Pure Energy
      this.createCompanyFinancials({
        ipoId: ipo.id,
        eps: 12.45,
        peRatio: 8.03,
        roe: 15.8,
        debtToEquity: 0.42,
        netWorth: 1.24,
        bookValue: 124.5,
        revenue: 357.2,
        netProfit: 124.5,
        year: 2023
      });
    });
    
    const visionEnergyIpo: InsertIpo = {
      companyName: "Vision Energy & Power",
      symbol: "VEP",
      sector: "Hydropower",
      issueManager: "NIBL Ace Capital",
      issueSize: 5800000, // 58 lakh shares
      issuePrice: 100,
      openDate: new Date("2024-04-18"),
      closeDate: new Date("2024-05-05"),
      allotmentDate: new Date("2024-05-20"),
      status: "ongoing",
      recommendationRating: "Buy",
      fundamentalScore: 65,
      valuationScore: 60,
      sectorOutlookScore: 90,
      managementScore: 70,
      expectedListingGain: "+20-25%",
      longTermPotential: "Medium",
      subscriptionRate: 2.1,
      analysis: "Vision Energy & Power has good financials and is likely to benefit from Nepal's focus on renewable energy."
    };
    this.createIpo(visionEnergyIpo);
    
    const aatmanirbharIpo: InsertIpo = {
      companyName: "Aatmanirbhar Laghubitta",
      symbol: "ALB",
      sector: "Microfinance",
      issueManager: "Sunrise Capital Ltd.",
      issueSize: 203380,
      issuePrice: 100,
      openDate: new Date("2024-04-20"),
      closeDate: new Date("2024-05-08"),
      allotmentDate: new Date("2024-05-25"),
      status: "ongoing",
      recommendationRating: "Hold",
      fundamentalScore: 55,
      valuationScore: 50,
      sectorOutlookScore: 60,
      managementScore: 60,
      expectedListingGain: "+10-15%",
      longTermPotential: "Medium",
      subscriptionRate: 1.2,
      analysis: "Aatmanirbhar Laghubitta shows average performance metrics with moderate growth potential in the microfinance sector."
    };
    this.createIpo(aatmanirbharIpo);
    
    // Add upcoming IPOs
    const tradeTowerIpo: InsertIpo = {
      companyName: "Trade Tower Ltd.",
      symbol: "TTL",
      sector: "Trading",
      issueManager: "Nabil Investment Banking Ltd.",
      issueSize: 4000000, // 40 lakh shares
      issuePrice: 100,
      openDate: new Date("2024-05-01"), // 8th Baishakh, 2082
      closeDate: new Date("2024-05-10"),
      allotmentDate: new Date("2024-05-30"),
      status: "upcoming",
      recommendationRating: "Buy",
      fundamentalScore: 70,
      valuationScore: 65,
      sectorOutlookScore: 75,
      managementScore: 80,
      expectedListingGain: "+25-30%",
      longTermPotential: "Medium",
      subscriptionRate: 0,
      analysis: "Trade Tower has strong management and is positioned well in Nepal's growing trading sector."
    };
    this.createIpo(tradeTowerIpo);
    
    // Add a recently closed IPO
    const nepalMicroInsuranceIpo: InsertIpo = {
      companyName: "Nepal Micro Insurance Company",
      symbol: "NMIC",
      sector: "Insurance",
      issueManager: "Prabhu Capital",
      issueSize: 3500000,
      issuePrice: 100,
      openDate: new Date("2024-03-15"),
      closeDate: new Date("2024-03-30"),
      allotmentDate: new Date("2024-04-15"),
      status: "closed",
      recommendationRating: "Buy",
      fundamentalScore: 75,
      valuationScore: 70,
      sectorOutlookScore: 85,
      managementScore: 65,
      expectedListingGain: "+30-35%",
      longTermPotential: "High",
      subscriptionRate: 4.2,
      analysis: "Nepal Micro Insurance Company has shown excellent subscription rates and strong sector outlook."
    };
    this.createIpo(nepalMicroInsuranceIpo);
    
    // Add educational resources
    this.createEducationalResource({
      title: "Complete Guide to IPO Applications in Nepal",
      description: "Learn how to apply for IPOs through the ASBA/C-ASBA system, including documentation requirements.",
      type: "article",
      level: "beginner",
      content: "# How to Apply for IPOs in Nepal\n\n## Introduction\n\nAn Initial Public Offering (IPO) is a process by which a private company offers its shares to the public for the first time. In Nepal, the IPO application process is streamlined through the ASBA (Applications Supported by Blocked Amount) and C-ASBA (Centralized ASBA) systems.\n\n## Prerequisites for IPO Application\n\n1. **DEMAT Account**: You must have a DEMAT (Dematerialized) account to hold shares electronically. You can open one through any depository participant (DP) registered with CDSC.\n\n2. **Bank Account**: You need a bank account linked to your DEMAT account. Most commercial banks in Nepal offer this service.\n\n3. **MeroShare Account**: Register for a MeroShare account (https://meroshare.cdsc.com.np) which is linked to your DEMAT account for electronic applications.\n\n## Step-by-Step Application Process\n\n### Through C-ASBA (Online Method)\n\n1. **Login to MeroShare**: Access your MeroShare account using your credentials\n\n2. **Navigate to My ASBA**: Click on 'My ASBA' from the dashboard\n\n3. **Select IPO**: Choose the 'Apply for IPO' option and select the available IPO\n\n4. **Fill Application Details**:\n   - Select your bank\n   - Enter the number of units (must be in multiples of 10 and minimum 10 units)\n   - Choose CRN number (if applicable)\n   - Accept the terms and conditions\n\n5. **Confirm Application**: Verify your details and submit the application\n\n6. **Verification**: You'll receive an OTP for verification. Enter it to complete your application\n\n### Through ASBA (Bank Visit Method)\n\n1. **Visit Your Bank**: Go to any branch of your bank where you have an account\n\n2. **Fill ASBA Form**: Complete the physical ASBA form with your details\n   - Your name and details as per your bank account\n   - DEMAT account number\n   - Number of shares applying for\n   - IPO details\n\n3. **Submit Documents**: Submit the form along with your ID proof\n\n4. **Amount Blocked**: The bank will block the amount equivalent to the shares you applied for\n\n## Important IPO Tips for Nepali Investors\n\n1. **Research the Company**: Always study the company's prospectus before investing\n\n2. **Check Fundamentals**: Evaluate financial performance, management quality, and business model\n\n3. **Apply Early**: Sometimes IPOs close early due to oversubscription\n\n4. **Realistic Expectations**: Understand that not all IPOs guarantee allotment or listing gains\n\n5. **Diversify Applications**: If applying with family members, use different banks to increase chances of allotment\n\n## After Application: What Next?\n\n1. **Allotment Process**: Shares are allotted through a lottery system if oversubscribed\n\n2. **Results Check**: Check allotment results through MeroShare or your DP\n\n3. **Fund Release**: If not allotted, blocked amount is automatically released back to your account\n\n4. **Share Credit**: Allotted shares will be credited to your DEMAT account\n\nBy following these steps, you can successfully apply for IPOs in Nepal and potentially benefit from new investment opportunities in the market.",
      thumbnailUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f"
    });
    
    this.createEducationalResource({
      title: "How to Analyze Financial Statements for IPO Investment",
      description: "Understand key financial ratios and how to interpret company financials before investing.",
      type: "article",
      level: "intermediate",
      content: "# Financial Statement Analysis for IPO Investments\n\n## Introduction\n\nBefore investing in an Initial Public Offering (IPO) in Nepal, it's crucial to analyze the company's financial health and performance. This guide will help you understand how to read and interpret financial statements to make informed investment decisions.\n\n## Key Financial Statements to Analyze\n\n### 1. Balance Sheet\n\nThe balance sheet provides a snapshot of a company's financial position at a specific point in time.\n\n**Key Components to Analyze:**\n\n- **Assets**: What the company owns\n  - Current Assets (cash, inventory, receivables)\n  - Non-current Assets (property, equipment, investments)\n\n- **Liabilities**: What the company owes\n  - Current Liabilities (payable within one year)\n  - Long-term Liabilities (debt spanning multiple years)\n\n- **Shareholders' Equity**: Net worth of the company\n  - Share Capital\n  - Retained Earnings\n\n**What to Look For:**\n- Strong asset position compared to liabilities\n- Reasonable debt levels\n- Growing shareholders' equity\n\n### 2. Income Statement\n\nThe income statement shows the company's revenues, expenses, and profits over a specific period.\n\n**Key Components to Analyze:**\n\n- **Revenue**: Total income from sales\n- **Gross Profit**: Revenue minus cost of goods sold\n- **Operating Profit**: Profit from core business operations\n- **Net Profit**: Final profit after all expenses and taxes\n\n**What to Look For:**\n- Consistent revenue growth\n- Stable or improving profit margins\n- Comparison with industry peers\n\n### 3. Cash Flow Statement\n\nThe cash flow statement tracks how cash enters and leaves the business.\n\n**Key Components to Analyze:**\n\n- **Operating Cash Flow**: Cash generated from core business\n- **Investing Cash Flow**: Cash used for investments\n- **Financing Cash Flow**: Cash from funding activities\n\n**What to Look For:**\n- Positive operating cash flow\n- Sustainable cash generation\n- How the company is using its cash\n\n## Essential Financial Ratios for IPO Analysis\n\n### Profitability Ratios\n\n1. **Return on Equity (ROE)**\n   - Formula: Net Income ÷ Shareholders' Equity\n   - What it shows: How efficiently a company uses equity to generate profits\n   - Good benchmark: Above 15% for Nepali companies\n\n2. **Net Profit Margin**\n   - Formula: Net Profit ÷ Revenue × 100\n   - What it shows: Percentage of revenue converted to profit\n   - Good benchmark: Compare with industry average\n\n### Liquidity Ratios\n\n1. **Current Ratio**\n   - Formula: Current Assets ÷ Current Liabilities\n   - What it shows: Ability to pay short-term obligations\n   - Good benchmark: Above 1.5\n\n2. **Quick Ratio (Acid Test)**\n   - Formula: (Current Assets - Inventory) ÷ Current Liabilities\n   - What it shows: Immediate solvency position\n   - Good benchmark: Above 1.0\n\n### Valuation Ratios\n\n1. **Price-to-Earnings (P/E) Ratio**\n   - Formula: Share Price ÷ Earnings Per Share\n   - What it shows: How much investors are willing to pay for each rupee of earnings\n   - Good benchmark: Compare with sector average and growth prospects\n\n2. **Price-to-Book (P/B) Ratio**\n   - Formula: Share Price ÷ Book Value Per Share\n   - What it shows: Relationship between market value and book value\n   - Good benchmark: Below 3 for value investments\n\n3. **Earnings Per Share (EPS)**\n   - Formula: Net Income ÷ Outstanding Shares\n   - What it shows: Profit allocated to each share\n   - Good benchmark: Growing year-over-year\n\n## Analyzing IPO Prospectus\n\nThe IPO prospectus contains vital information beyond just financial statements:\n\n1. **Business Model**: Understand how the company makes money\n\n2. **Use of IPO Proceeds**: Check what the company plans to do with the raised funds\n\n3. **Risk Factors**: Analyze potential challenges the company might face\n\n4. **Management Team**: Assess experience and track record\n\n5. **Promoter Shareholding**: Understand ownership structure before and after IPO\n\n## Red Flags to Watch For\n\n1. **Inconsistent Financials**: Erratic growth patterns without explanation\n\n2. **High Debt Levels**: Excessive debt compared to industry standards\n\n3. **Qualified Audit Reports**: Auditor concerns in financial statements\n\n4. **Related Party Transactions**: Excessive business with related entities\n\n5. **Overvaluation**: IPO price much higher than industry peers based on P/E or P/B ratios\n\n## Nepali Market Context\n\nWhen analyzing IPOs in Nepal, consider these additional factors:\n\n1. **Sector Regulations**: Understand regulatory framework for the industry\n\n2. **Dividend History**: For existing companies going public, check past dividend patterns\n\n3. **Book Value**: Many Nepali investors focus on book value as a key metric\n\n4. **Right Share History**: For existing companies, assess past capital raising patterns\n\nBy thoroughly analyzing financial statements and understanding these key metrics, you'll be better positioned to make informed decisions about IPO investments in Nepal's market.",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    });
    
    this.createEducationalResource({
      title: "How to Setup Your DEMAT Account in Nepal",
      description: "Step-by-step video guide to creating and managing your DEMAT account with CDS.",
      type: "video",
      level: "beginner",
      content: "https://www.youtube.com/embed/SQyFDKiCtqo",
      thumbnailUrl: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9"
    });
    
    this.createEducationalResource({
      title: "Understanding IPO Valuation Methods",
      description: "Learn different valuation methods used to determine the offering price of an IPO.",
      type: "article",
      level: "advanced",
      content: "# Understanding IPO Valuation Methods\n\n## Introduction\n\nValuation is one of the most critical aspects of an Initial Public Offering (IPO). The offering price directly impacts investor interest, fundraising success, and post-listing performance. This guide explores various methods used to value companies for IPOs in Nepal's context.\n\n## Common IPO Valuation Methods\n\n### 1. Price-to-Earnings (P/E) Multiple Method\n\nThe P/E multiple approach is widely used in Nepal due to its simplicity and reliance on comparable companies.\n\n**Process:**\n- Calculate the company's earnings per share (EPS)\n- Identify P/E ratios of similar listed companies\n- Apply an appropriate P/E multiple to the company's EPS\n\n**Example:**\n- Company A has an EPS of Rs. 12\n- Similar companies trade at P/E multiples of 15-18x\n- Reasonable IPO price range: Rs. 180-216 per share\n\n**Nepali Context:**\n- Banking sector typically trades at 10-15x P/E\n- Hydropower companies often trade at 20-30x P/E\n- Insurance companies may see 15-25x P/E multiples\n\n**Advantages:**\n- Simple to calculate and explain\n- Market-based approach using real trading data\n\n**Limitations:**\n- Requires comparable listed companies\n- May not work well for companies with negative earnings\n- Doesn't account for growth prospects adequately\n\n### 2. Discounted Cash Flow (DCF) Method\n\nDCF values a company based on projected future cash flows, discounted to present value.\n\n**Process:**\n- Project future cash flows (5-10 years)\n- Calculate terminal value\n- Determine appropriate discount rate\n- Discount all values to present\n\n**Example for a Nepali Hydropower IPO:**\n- Project cash flows based on power purchase agreement (PPA) rates\n- Use Nepal's risk-free rate plus risk premium for discount rate\n- Calculate per-share value based on total DCF valuation\n\n**Advantages:**\n- Accounts for future growth potential\n- Not dependent on market comparables\n- Considers time value of money\n\n**Limitations:**\n- Highly sensitive to assumptions\n- Complex to explain to average investors\n- Challenging in Nepal's volatile economic environment\n\n### 3. Book Value Method\n\nThis approach is particularly relevant in Nepal, where many investors focus on book value.\n\n**Process:**\n- Calculate net asset value (assets minus liabilities)\n- Divide by number of shares\n- Apply a premium or discount based on growth prospects\n\n**Example:**\n- Company has net assets of Rs. 100 crore\n- 1 crore shares to be outstanding after IPO\n- Book value: Rs. 100 per share\n- Premium applied for growth prospects: 30%\n- IPO price: Rs. 130 per share\n\n**Advantages:**\n- Straightforward to calculate\n- Based on tangible assets\n- Popular with Nepali investors\n\n**Limitations:**\n- Ignores intangible assets and growth potential\n- Historical cost basis may not reflect current values\n- Different accounting practices can affect comparison\n\n### 4. Dividend Discount Model (DDM)\n\nRelevant for dividend-paying sectors like banking and finance in Nepal.\n\n**Process:**\n- Project future dividends\n- Discount to present value using required rate of return\n\n**Example:**\n- Bank expected to pay Rs. 15 dividend next year\n- Historical dividend growth rate: 5%\n- Required return: 15%\n- Price = Rs. 15 ÷ (0.15 - 0.05) = Rs. 150\n\n**Advantages:**\n- Effective for stable dividend-paying companies\n- Considers return to shareholders directly\n\n**Limitations:**\n- Not useful for growth companies without dividends\n- Sensitive to growth assumptions\n\n## IPO Pricing Strategies in Nepal\n\n### 1. Par Value Pricing\n\nMany Nepali IPOs, especially from financial institutions, are issued at par value (Rs. 100).\n\n**Advantages:**\n- Regulatory simplicity\n- Easier for retail investors to understand\n- Lower pricing reduces initial investment hurdle\n\n**Disadvantages:**\n- Often leads to heavy oversubscription\n- May leave money on the table for the issuer\n- Can result in volatile post-listing trading\n\n### 2. Premium Pricing\n\nIncreasingly common for established companies with strong financials.\n\n**Considerations:**\n- Premium must be justified by financials\n- SEBON (Securities Board of Nepal) requirements\n- Market sentiment and absorption capacity\n\n**Examples from Nepali Market:**\n- Some hydropower companies have issued at Rs. 100-300\n- Select microfinance institutions have used premium pricing\n\n## Factors Affecting IPO Valuation in Nepal\n\n### 1. Regulatory Environment\n\n- SEBON guidelines and restrictions\n- Sector-specific regulations\n- Disclosure requirements\n\n### 2. Market Conditions\n\n- Overall NEPSE index performance\n- Sector performance trends\n- Liquidity in the market\n- Recent IPO performance\n\n### 3. Company-Specific Factors\n\n- Financial performance track record\n- Growth prospects and project pipeline\n- Management quality\n- Unique competitive advantages\n\n### 4. Investor Sentiment\n\n- Retail investor appetite\n- Institutional investor interest\n- Market cycles (bull vs. bear)\n\n## Case Study: Hydropower IPO Valuation\n\nHydropower companies represent a significant portion of Nepal's IPO market:\n\n1. **Revenue Predictability**:\n   - Long-term PPAs with Nepal Electricity Authority\n   - Seasonality factors in generation\n\n2. **Cost Structure**:\n   - High initial capital expenditure\n   - Relatively low operational costs\n\n3. **Valuation Approach**:\n   - DCF based on PPA terms and generation capacity\n   - Comparable company analysis (P/E, P/B ratios)\n   - Book value plus premium for quality projects\n\n4. **Typical Metrics in Nepal**:\n   - P/E ratios of 20-30x\n   - P/B ratios of 1.5-3x\n   - Project cost per MW as a reference point\n\n## Conclusion\n\nValuing an IPO involves both science and art, combining quantitative methods with qualitative assessments. In Nepal's evolving capital market, understanding these valuation approaches helps investors make more informed decisions when participating in IPOs. While methods like P/E multiples and book value remain popular due to their simplicity, sophisticated investors should consider multiple valuation techniques to develop a comprehensive perspective on an IPO's fair value.",
      thumbnailUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
    });
    
    this.createEducationalResource({
      title: "IPO Allotment Process and Strategies",
      description: "Understand how IPO shares are allotted in Nepal and strategies to improve your chances.",
      type: "guide",
      level: "beginner",
      content: "# IPO Allotment Process and Strategies in Nepal\n\n## Understanding the IPO Allotment Process\n\nThe IPO allotment process in Nepal follows a systematic approach designed to distribute shares fairly among applicants, especially when issues are oversubscribed.\n\n### IPO Allotment System in Nepal\n\n#### 1. Collection of Applications\n\n- Applications are collected through the ASBA (Application Supported by Blocked Amount) system\n- Each application must meet the minimum requirement (typically 10 shares) and be in multiples of 10\n- Applicants can apply through their respective banks or C-ASBA (online through MeroShare)\n\n#### 2. Categorization of Applicants\n\nNepal's securities regulations typically divide IPO applicants into categories:\n\n- **General Public**: The largest portion (usually 75-80%) reserved for individual investors\n- **Employees**: A small percentage (typically 5%) for company employees\n- **Mutual Funds**: About 5% reserved for mutual funds\n- **Foreign Investors**: Applicable in some cases\n- **Affected Communities**: For hydropower and certain infrastructure projects, locals from affected areas get priority allocation\n\n#### 3. Allotment Methods\n\nWhen an IPO is oversubscribed (which is common in Nepal), the following allotment methods are used:\n\n**a) Lottery System (Random Selection)**\n\nThis is the most common method used in Nepal:\n\n- A computerized random selection process assigns shares\n- Each applicant has an equal probability of receiving the minimum allotment\n- Applications are selected randomly until all shares are allocated\n\n**b) Pro-rata Allotment**\n\nSometimes used for specific categories:\n\n- Each qualified applicant receives shares proportional to their application\n- Formula: (Total shares available ÷ Total shares applied for) × Individual application\n- Example: If the issue is oversubscribed 5 times, you might receive 20% of your application\n\n#### 4. Results Announcement\n\n- Results are typically announced within 30 days of the issue closing\n- Issue manager publishes results on their website\n- Results are also available through MeroShare and the Nepal Stock Exchange website\n- SMS notifications may be sent to applicants\n\n#### 5. Refund and Share Crediting\n\n- For unsuccessful applicants, blocked amounts are released automatically\n- Successful applicants have their DEMAT accounts credited with allotted shares\n- Shares typically list on the exchange 1-2 weeks after allotment\n\n## IPO Application Strategies to Improve Allotment Chances\n\n### 1. Multiple Applications Through Different Routes\n\n**Strategy:** Apply through different family members using different banks\n\n**Why it works:**\n- Each application is treated as a separate entry in the lottery\n- Using different banks may improve chances as some banks might have fewer applications\n\n**How to implement:**\n- Each family member should have their own DEMAT account\n- Apply through different banks where you and your family members have accounts\n- Ensure all applications are legitimately in the name of actual family members\n\n### 2. Timing Your Application\n\n**Strategy:** Consider when to submit your application\n\n**Options:**\n- **Early Application:** Apply in the first few days to avoid technical issues or early closures\n- **Mid-Period Application:** Apply during less busy periods when server loads may be lower\n- **Last-Day Application:** Some believe this might affect random selection (though officially this shouldn't matter)\n\n### 3. Application Size Optimization\n\n**Strategy:** Apply for an optimal number of shares\n\n**Considerations:**\n- Applying for the minimum (usually 10 shares) maximizes the number of applications you can submit with your capital\n- For certain categories or pro-rata allocations, larger applications might be advantageous\n\n### 4. Target Less Popular Issues\n\n**Strategy:** Focus on IPOs with potentially lower subscription rates\n\n**How to identify these:**\n- Issues during market downturns\n- Companies in less popular sectors\n- Issues with very large offering sizes\n- IPOs with less publicity\n\n### 5. Special Categories Application\n\n**Strategy:** Apply under special categories if eligible\n\n**Examples:**\n- If you're an employee of the issuing company\n- For hydropower projects, if you reside in the affected districts\n- Institutional categories if applicable\n\n## Common Myths About IPO Allotment\n\n### Myth #1: Application Size Affects Selection Probability\n\n**Reality:** In a true lottery system, each valid application has an equal probability regardless of size\n\n### Myth #2: Specific Banks Have Better Allotment Rates\n\n**Reality:** The allotment process is centralized and shouldn't favor applications from specific banks\n\n### Myth #3: Application Timing Influences Selection\n\n**Reality:** Official random selection should not be influenced by when you applied\n\n## IPO Calendar and Notification Services\n\nTo stay updated on upcoming IPOs:\n\n1. **Official Sources:**\n   - SEBON website (www.sebon.gov.np)\n   - Nepal Stock Exchange (www.nepalstock.com)\n\n2. **Financial News Portals:**\n   - ShareSansar\n   - Merolagani\n   - NepaliPaisa\n\n3. **Brokerage Services:**\n   - Many brokers provide IPO alerts\n   - DP institutions offer notification services\n\n4. **Mobile Apps:**\n   - Several Nepali stock market apps provide IPO alerts\n\n## Conclusion\n\nWhile IPO allotment in Nepal largely depends on luck due to the lottery system, understanding the process and employing strategic approaches can help improve your overall success rate. Remember that with highly oversubscribed issues, even the best strategies may result in relatively low allotment success, so it's important to apply for multiple IPOs over time and view IPO investments as just one part of a diversified investment strategy.",
      thumbnailUrl: "https://images.unsplash.com/photo-1559526324-593bc073d938"
    });
    
    this.createEducationalResource({
      title: "Understanding IPO Listing Gains and Post-IPO Investment Strategies",
      description: "Learn how to evaluate listing gains and develop strategies for post-IPO investment decisions.",
      type: "video",
      level: "intermediate",
      content: "https://www.youtube.com/embed/3TK8Ra4JaL0",
      thumbnailUrl: "https://images.unsplash.com/photo-1616803140344-7862904e6f2b"
    });
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // IPO methods
  async getIpo(id: number): Promise<Ipo | undefined> {
    const [ipo] = await db.select().from(ipos).where(eq(ipos.id, id));
    return ipo || undefined;
  }
  
  async getIpos(): Promise<Ipo[]> {
    return await db.select().from(ipos);
  }
  
  async getIposByStatus(status: string): Promise<Ipo[]> {
    return await db.select().from(ipos).where(eq(ipos.status, status));
  }
  
  async createIpo(insertIpo: InsertIpo): Promise<Ipo> {
    const [ipo] = await db.insert(ipos).values(insertIpo).returning();
    return ipo;
  }
  
  async updateIpo(id: number, ipoUpdate: Partial<InsertIpo>): Promise<Ipo | undefined> {
    const [updatedIpo] = await db
      .update(ipos)
      .set(ipoUpdate)
      .where(eq(ipos.id, id))
      .returning();
    return updatedIpo || undefined;
  }
  
  // Company Financials methods
  async getCompanyFinancials(ipoId: number): Promise<CompanyFinancials[]> {
    return await db
      .select()
      .from(companyFinancials)
      .where(eq(companyFinancials.ipoId, ipoId));
  }
  
  async createCompanyFinancials(insertFinancials: InsertCompanyFinancials): Promise<CompanyFinancials> {
    const [financials] = await db
      .insert(companyFinancials)
      .values(insertFinancials)
      .returning();
    return financials;
  }
  
  // Educational Resources methods
  async getEducationalResources(): Promise<EducationalResource[]> {
    return await db.select().from(educationalResources);
  }
  
  async getEducationalResourcesByType(type: string): Promise<EducationalResource[]> {
    return await db
      .select()
      .from(educationalResources)
      .where(eq(educationalResources.type, type));
  }
  
  async getEducationalResource(id: number): Promise<EducationalResource | undefined> {
    const [resource] = await db
      .select()
      .from(educationalResources)
      .where(eq(educationalResources.id, id));
    return resource || undefined;
  }
  
  async createEducationalResource(insertResource: InsertEducationalResource): Promise<EducationalResource> {
    const [resource] = await db
      .insert(educationalResources)
      .values({ ...insertResource, createdAt: new Date() })
      .returning();
    return resource;
  }
  
  // Watchlist methods
  async getWatchlistByUser(userId: number): Promise<Watchlist[]> {
    // Join watchlists with ipos to include IPO data
    const results = await db
      .select({
        watchlist: watchlists,
        ipo: ipos
      })
      .from(watchlists)
      .where(eq(watchlists.userId, userId))
      .leftJoin(ipos, eq(watchlists.ipoId, ipos.id));
    
    // Transform the results to match the expected return type
    return results.map(({ watchlist, ipo }) => ({
      ...watchlist,
      ipo: ipo
    }));
  }
  
  async addToWatchlist(insertWatchlist: InsertWatchlist): Promise<Watchlist> {
    const [watchlist] = await db
      .insert(watchlists)
      .values({ ...insertWatchlist, addedAt: new Date() })
      .returning();
    return watchlist;
  }
  
  async removeFromWatchlist(userId: number, ipoId: number): Promise<boolean> {
    const result = await db
      .delete(watchlists)
      .where(
        and(
          eq(watchlists.userId, userId),
          eq(watchlists.ipoId, ipoId)
        )
      );
    
    return result.rowCount > 0;
  }
}

// Using database storage instead of in-memory storage
export const storage = new DatabaseStorage();
