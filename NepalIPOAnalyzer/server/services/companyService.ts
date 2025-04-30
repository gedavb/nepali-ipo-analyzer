import { storage } from "../storage";
import { CompanyFinancials, InsertCompanyFinancials } from "@shared/schema";

export async function getCompanyFinancials(ipoId: number): Promise<CompanyFinancials[]> {
  return storage.getCompanyFinancials(ipoId);
}

export async function createCompanyFinancials(financials: InsertCompanyFinancials): Promise<CompanyFinancials> {
  return storage.createCompanyFinancials(financials);
}

export async function getCompanyAnalysis(ipoId: number) {
  const ipo = await storage.getIpo(ipoId);
  const financials = await storage.getCompanyFinancials(ipoId);
  
  if (!ipo) {
    throw new Error("IPO not found");
  }
  
  return {
    company: {
      name: ipo.companyName,
      symbol: ipo.symbol,
      sector: ipo.sector
    },
    financials: financials.length > 0 ? financials[0] : null,
    analysis: {
      recommendation: ipo.recommendationRating,
      fundamentalScore: ipo.fundamentalScore,
      valuationScore: ipo.valuationScore,
      sectorOutlookScore: ipo.sectorOutlookScore,
      managementScore: ipo.managementScore,
      expectedListingGain: ipo.expectedListingGain,
      longTermPotential: ipo.longTermPotential,
      analysis: ipo.analysis
    }
  };
}
