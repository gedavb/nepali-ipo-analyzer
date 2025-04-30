import React from "react";
import HeroSection from "@/components/home/HeroSection";
import QuickStatsSection from "@/components/home/QuickStatsSection";
import IPOCalendarSection from "@/components/home/IPOCalendarSection";
import CompanyAnalysisSection from "@/components/home/CompanyAnalysisSection";
import EducationalResourcesSection from "@/components/home/EducationalResourcesSection";
import DownloadSection from "@/components/home/DownloadSection";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <HeroSection />
      <QuickStatsSection />
      <IPOCalendarSection />
      <CompanyAnalysisSection />
      <EducationalResourcesSection />
      <DownloadSection />
    </div>
  );
};

export default Home;
