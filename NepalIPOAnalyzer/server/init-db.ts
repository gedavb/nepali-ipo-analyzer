import { db } from "./db";
import {
  ipos, InsertIpo,
  companyFinancials, InsertCompanyFinancials,
  educationalResources, InsertEducationalResource
} from "@shared/schema";

async function initializeDatabase() {
  console.log("Initializing database with sample data...");
  
  try {
    // Check if data already exists
    const existingIpos = await db.select().from(ipos);
    if (existingIpos.length > 0) {
      console.log("Database already has data, skipping initialization.");
      return;
    }

    // Sample IPOs
    console.log("Adding sample IPOs...");
    const pureEnergyIpo: InsertIpo = {
      companyName: "Pure Energy Ltd.",
      symbol: "PURE",
      sector: "Hydropower",
      issueManager: "NIBL Ace Capital",
      issueSize: 6500000, // 65 lakh shares
      issuePrice: 100,
      openDate: new Date("2024-04-15").toISOString(),
      closeDate: new Date("2024-04-30").toISOString(),
      allotmentDate: new Date("2024-05-15").toISOString(),
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
    const [createdPureEnergyIpo] = await db.insert(ipos).values(pureEnergyIpo).returning();
    
    // Add company financials for Pure Energy
    const pureEnergyFinancials: InsertCompanyFinancials = {
      ipoId: createdPureEnergyIpo.id,
      eps: 12.45,
      peRatio: 8.03,
      roe: 15.8,
      debtToEquity: 0.42,
      netWorth: 1.24,
      bookValue: 124.5,
      revenue: 357.2,
      netProfit: 124.5,
      year: 2023
    };
    await db.insert(companyFinancials).values(pureEnergyFinancials);
    
    const visionEnergyIpo: InsertIpo = {
      companyName: "Vision Energy & Power",
      symbol: "VEP",
      sector: "Hydropower",
      issueManager: "NIBL Ace Capital",
      issueSize: 5800000, // 58 lakh shares
      issuePrice: 100,
      openDate: new Date("2024-04-18").toISOString(),
      closeDate: new Date("2024-05-05").toISOString(),
      allotmentDate: new Date("2024-05-20").toISOString(),
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
    await db.insert(ipos).values(visionEnergyIpo);
    
    const aatmanirbharIpo: InsertIpo = {
      companyName: "Aatmanirbhar Laghubitta",
      symbol: "ALB",
      sector: "Microfinance",
      issueManager: "Sunrise Capital Ltd.",
      issueSize: 203380,
      issuePrice: 100,
      openDate: new Date("2024-04-20").toISOString(),
      closeDate: new Date("2024-05-08").toISOString(),
      allotmentDate: new Date("2024-05-25").toISOString(),
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
    await db.insert(ipos).values(aatmanirbharIpo);
    
    // Add upcoming IPOs
    const tradeTowerIpo: InsertIpo = {
      companyName: "Trade Tower Ltd.",
      symbol: "TTL",
      sector: "Trading",
      issueManager: "Nabil Investment Banking Ltd.",
      issueSize: 4000000, // 40 lakh shares
      issuePrice: 100,
      openDate: new Date("2024-05-01").toISOString(), // 8th Baishakh, 2082
      closeDate: new Date("2024-05-10").toISOString(),
      allotmentDate: new Date("2024-05-30").toISOString(),
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
    await db.insert(ipos).values(tradeTowerIpo);
    
    // Add a recently closed IPO
    const nepalMicroInsuranceIpo: InsertIpo = {
      companyName: "Nepal Micro Insurance Company",
      symbol: "NMIC",
      sector: "Insurance",
      issueManager: "Prabhu Capital",
      issueSize: 3500000,
      issuePrice: 100,
      openDate: new Date("2024-03-15").toISOString(),
      closeDate: new Date("2024-03-30").toISOString(),
      allotmentDate: new Date("2024-04-15").toISOString(),
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
    await db.insert(ipos).values(nepalMicroInsuranceIpo);
    
    // Add educational resources
    console.log("Adding educational resources...");
    const educationalResource1: InsertEducationalResource = {
      title: "Complete Guide to IPO Applications in Nepal",
      description: "Learn how to apply for IPOs through the ASBA/C-ASBA system, including documentation requirements.",
      type: "article",
      level: "beginner",
      content: "# How to Apply for IPOs in Nepal\n\n## Introduction\n\nAn Initial Public Offering (IPO) is a process by which a private company offers its shares to the public for the first time. In Nepal, the IPO application process is streamlined through the ASBA (Applications Supported by Blocked Amount) and C-ASBA (Centralized ASBA) systems.\n\n## Prerequisites for IPO Application\n\n1. **DEMAT Account**: You must have a DEMAT (Dematerialized) account to hold shares electronically. You can open one through any depository participant (DP) registered with CDSC.\n\n2. **Bank Account**: You need a bank account linked to your DEMAT account. Most commercial banks in Nepal offer this service.\n\n3. **MeroShare Account**: Register for a MeroShare account (https://meroshare.cdsc.com.np) which is linked to your DEMAT account for electronic applications.\n\n## Step-by-Step Application Process\n\n### Through C-ASBA (Online Method)\n\n1. **Login to MeroShare**: Access your MeroShare account using your credentials\n\n2. **Navigate to My ASBA**: Click on 'My ASBA' from the dashboard\n\n3. **Select IPO**: Choose the 'Apply for IPO' option and select the available IPO\n\n4. **Fill Application Details**:\n   - Select your bank\n   - Enter the number of units (must be in multiples of 10 and minimum 10 units)\n   - Choose CRN number (if applicable)\n   - Accept the terms and conditions\n\n5. **Confirm Application**: Verify your details and submit the application\n\n6. **Verification**: You'll receive an OTP for verification. Enter it to complete your application\n\n### Through ASBA (Bank Visit Method)\n\n1. **Visit Your Bank**: Go to any branch of your bank where you have an account\n\n2. **Fill ASBA Form**: Complete the physical ASBA form with your details\n   - Your name and details as per your bank account\n   - DEMAT account number\n   - Number of shares applying for\n   - IPO details\n\n3. **Submit Documents**: Submit the form along with your ID proof\n\n4. **Amount Blocked**: The bank will block the amount equivalent to the shares you applied for\n\n## Important IPO Tips for Nepali Investors\n\n1. **Research the Company**: Always study the company's prospectus before investing\n\n2. **Check Fundamentals**: Evaluate financial performance, management quality, and business model\n\n3. **Apply Early**: Sometimes IPOs close early due to oversubscription\n\n4. **Realistic Expectations**: Understand that not all IPOs guarantee allotment or listing gains\n\n5. **Diversify Applications**: If applying with family members, use different banks to increase chances of allotment\n\n## After Application: What Next?\n\n1. **Allotment Process**: Shares are allotted through a lottery system if oversubscribed\n\n2. **Results Check**: Check allotment results through MeroShare or your DP\n\n3. **Fund Release**: If not allotted, blocked amount is automatically released back to your account\n\n4. **Share Credit**: Allotted shares will be credited to your DEMAT account\n\nBy following these steps, you can successfully apply for IPOs in Nepal and potentially benefit from new investment opportunities in the market.",
      thumbnailUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f"
    };
    await db.insert(educationalResources).values(educationalResource1);
    
    const educationalResource2: InsertEducationalResource = {
      title: "How to Analyze Financial Statements for IPO Investment",
      description: "Understand key financial ratios and how to interpret company financials before investing.",
      type: "article",
      level: "intermediate",
      content: "# Financial Statement Analysis for IPO Investments\n\n## Introduction\n\nBefore investing in an Initial Public Offering (IPO) in Nepal, it's crucial to analyze the company's financial health and performance. This guide will help you understand how to read and interpret financial statements to make informed investment decisions.\n\n## Key Financial Statements to Analyze\n\n### 1. Balance Sheet\n\nThe balance sheet provides a snapshot of a company's financial position at a specific point in time.\n\n**Key Components to Analyze:**\n\n- **Assets**: What the company owns\n  - Current Assets (cash, inventory, receivables)\n  - Non-current Assets (property, equipment, investments)\n\n- **Liabilities**: What the company owes\n  - Current Liabilities (payable within one year)\n  - Long-term Liabilities (debt spanning multiple years)\n\n- **Shareholders' Equity**: Net worth of the company\n  - Share Capital\n  - Retained Earnings\n\n**What to Look For:**\n- Strong asset position compared to liabilities\n- Reasonable debt levels\n- Growing shareholders' equity\n\n### 2. Income Statement\n\nThe income statement shows the company's revenues, expenses, and profits over a specific period.\n\n**Key Components to Analyze:**\n\n- **Revenue**: Total income from sales\n- **Gross Profit**: Revenue minus cost of goods sold\n- **Operating Profit**: Profit from core business operations\n- **Net Profit**: Final profit after all expenses and taxes\n\n**What to Look For:**\n- Consistent revenue growth\n- Stable or improving profit margins\n- Comparison with industry peers\n\n### 3. Cash Flow Statement\n\nThe cash flow statement tracks how cash enters and leaves the business.\n\n**Key Components to Analyze:**\n\n- **Operating Cash Flow**: Cash generated from core business\n- **Investing Cash Flow**: Cash used for investments\n- **Financing Cash Flow**: Cash from funding activities\n\n**What to Look For:**\n- Positive operating cash flow\n- Sustainable cash generation\n- How the company is using its cash\n\n## Essential Financial Ratios for IPO Analysis\n\n### Profitability Ratios\n\n1. **Return on Equity (ROE)**\n   - Formula: Net Income ÷ Shareholders' Equity\n   - What it shows: How efficiently a company uses equity to generate profits\n   - Good benchmark: Above 15% for Nepali companies\n\n2. **Net Profit Margin**\n   - Formula: Net Profit ÷ Revenue × 100\n   - What it shows: Percentage of revenue converted to profit\n   - Good benchmark: Compare with industry average\n\n### Liquidity Ratios\n\n1. **Current Ratio**\n   - Formula: Current Assets ÷ Current Liabilities\n   - What it shows: Ability to pay short-term obligations\n   - Good benchmark: Above 1.5\n\n2. **Quick Ratio (Acid Test)**\n   - Formula: (Current Assets - Inventory) ÷ Current Liabilities\n   - What it shows: Immediate solvency position\n   - Good benchmark: Above 1.0\n\n### Valuation Ratios\n\n1. **Price-to-Earnings (P/E) Ratio**\n   - Formula: Share Price ÷ Earnings Per Share\n   - What it shows: How much investors are willing to pay for each rupee of earnings\n   - Good benchmark: Compare with sector average and growth prospects\n\n2. **Price-to-Book (P/B) Ratio**\n   - Formula: Share Price ÷ Book Value Per Share\n   - What it shows: Relationship between market value and book value\n   - Good benchmark: Below 3 for value investments\n\n3. **Earnings Per Share (EPS)**\n   - Formula: Net Income ÷ Outstanding Shares\n   - What it shows: Profit allocated to each share\n   - Good benchmark: Growing year-over-year\n\n## Analyzing IPO Prospectus\n\nThe IPO prospectus contains vital information beyond just financial statements:\n\n1. **Business Model**: Understand how the company makes money\n\n2. **Use of IPO Proceeds**: Check what the company plans to do with the raised funds\n\n3. **Risk Factors**: Analyze potential challenges the company might face\n\n4. **Management Team**: Assess experience and track record\n\n5. **Promoter Shareholding**: Understand ownership structure before and after IPO\n\n## Red Flags to Watch For\n\n1. **Inconsistent Financials**: Erratic growth patterns without explanation\n\n2. **High Debt Levels**: Excessive debt compared to industry standards\n\n3. **Qualified Audit Reports**: Auditor concerns in financial statements\n\n4. **Related Party Transactions**: Excessive business with related entities\n\n5. **Overvaluation**: IPO price much higher than industry peers based on P/E or P/B ratios\n\n## Nepali Market Context\n\nWhen analyzing IPOs in Nepal, consider these additional factors:\n\n1. **Sector Regulations**: Understand regulatory framework for the industry\n\n2. **Dividend History**: For existing companies going public, check past dividend patterns\n\n3. **Book Value**: Many Nepali investors focus on book value as a key metric\n\n4. **Right Share History**: For existing companies, assess past capital raising patterns\n\nBy thoroughly analyzing financial statements and understanding these key metrics, you'll be better positioned to make informed decisions about IPO investments in Nepal's market.",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    };
    await db.insert(educationalResources).values(educationalResource2);
    
    const educationalResource3: InsertEducationalResource = {
      title: "How to Setup Your DEMAT Account in Nepal",
      description: "Step-by-step video guide to creating and managing your DEMAT account with CDS.",
      type: "video",
      level: "beginner",
      content: "https://www.youtube.com/embed/SQyFDKiCtqo",
      thumbnailUrl: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9"
    };
    await db.insert(educationalResources).values(educationalResource3);
    
    const educationalResource4: InsertEducationalResource = {
      title: "Understanding IPO Valuation Methods",
      description: "Learn different valuation methods used to determine the offering price of an IPO.",
      type: "article",
      level: "advanced",
      content: "# Understanding IPO Valuation Methods\n\n## Introduction\n\nValuation is one of the most critical aspects of an Initial Public Offering (IPO). The offering price directly impacts investor interest, fundraising success, and post-listing performance. This guide explores various methods used to value companies for IPOs in Nepal's context.\n\n## Common IPO Valuation Methods\n\n### 1. Price-to-Earnings (P/E) Multiple Method\n\nThe P/E multiple approach is widely used in Nepal due to its simplicity and reliance on comparable companies.\n\n**Process:**\n- Calculate the company's earnings per share (EPS)\n- Identify P/E ratios of similar listed companies\n- Apply an appropriate P/E multiple to the company's EPS\n\n**Example:**\n- Company A has an EPS of Rs. 12\n- Similar companies trade at P/E multiples of 15-18x\n- Reasonable IPO price range: Rs. 180-216 per share\n\n**Nepali Context:**\n- Banking sector typically trades at 10-15x P/E\n- Hydropower companies often trade at 20-30x P/E\n- Insurance companies may see 15-25x P/E multiples\n\n**Advantages:**\n- Simple to calculate and explain\n- Market-based approach using real trading data\n\n**Limitations:**\n- Requires comparable listed companies\n- May not work well for companies with negative earnings\n- Doesn't account for growth prospects adequately",
      thumbnailUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
    };
    await db.insert(educationalResources).values(educationalResource4);
    
    const educationalResource5: InsertEducationalResource = {
      title: "IPO Allotment Process and Strategies",
      description: "Understand how IPO shares are allotted in Nepal and strategies to improve your chances.",
      type: "guide",
      level: "beginner",
      content: "# IPO Allotment Process and Strategies in Nepal\n\n## Understanding the IPO Allotment Process\n\nThe IPO allotment process in Nepal follows a systematic approach designed to distribute shares fairly among applicants, especially when issues are oversubscribed.\n\n### IPO Allotment System in Nepal\n\n#### 1. Collection of Applications\n\n- Applications are collected through the ASBA (Application Supported by Blocked Amount) system\n- Each application must meet the minimum requirement (typically 10 shares) and be in multiples of 10\n- Applicants can apply through their respective banks or C-ASBA (online through MeroShare)\n\n#### 2. Categorization of Applicants\n\nNepal's securities regulations typically divide IPO applicants into categories:\n\n- **General Public**: The largest portion (usually 75-80%) reserved for individual investors\n- **Employees**: A small percentage (typically 5%) for company employees\n- **Mutual Funds**: About 5% reserved for mutual funds\n- **Foreign Investors**: Applicable in some cases\n- **Affected Communities**: For hydropower and certain infrastructure projects, locals from affected areas get priority allocation",
      thumbnailUrl: "https://images.unsplash.com/photo-1559526324-593bc073d938"
    };
    await db.insert(educationalResources).values(educationalResource5);
    
    const educationalResource6: InsertEducationalResource = {
      title: "Understanding IPO Listing Gains and Post-IPO Investment Strategies",
      description: "Learn how to evaluate listing gains and develop strategies for post-IPO investment decisions.",
      type: "video",
      level: "intermediate",
      content: "https://www.youtube.com/embed/3TK8Ra4JaL0",
      thumbnailUrl: "https://images.unsplash.com/photo-1616803140344-7862904e6f2b"
    };
    await db.insert(educationalResources).values(educationalResource6);
    
    console.log("Sample data added successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export { initializeDatabase };