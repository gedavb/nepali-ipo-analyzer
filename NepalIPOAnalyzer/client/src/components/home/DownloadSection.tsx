import React from "react";
import { Button } from "@/components/ui/button";
import Icons from "../icons";

const DownloadSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-secondary to-primary rounded-2xl overflow-hidden shadow-lg mb-8">
      <div className="p-6 md:p-8 md:flex items-center justify-between">
        <div className="md:w-3/5 mb-6 md:mb-0">
          <h2 className="text-white font-poppins text-2xl font-bold mb-3">Get the NepalIPO App</h2>
          <p className="text-white/90 mb-4">
            Download our mobile app to track IPOs on the go, receive instant notifications, and manage your portfolio even offline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="bg-black text-white border-black hover:bg-black/80 flex items-center gap-2">
              <Icons.download className="h-5 w-5" />
              <div>
                <div className="text-xs">Download on</div>
                <div className="text-sm font-medium">Play Store</div>
              </div>
            </Button>
            <Button variant="outline" className="bg-black text-white border-black hover:bg-black/80 flex items-center gap-2">
              <Icons.download className="h-5 w-5" />
              <div>
                <div className="text-xs">Download on</div>
                <div className="text-sm font-medium">App Store</div>
              </div>
            </Button>
          </div>
        </div>
        <div className="hidden md:block md:w-2/5">
          <div className="relative w-full max-w-xs mx-auto">
            <svg viewBox="0 0 300 600" className="w-full max-w-xs mx-auto">
              {/* Smartphone frame */}
              <rect x="0" y="0" width="300" height="600" rx="30" fill="#111" />
              <rect x="10" y="10" width="280" height="580" rx="20" fill="#f0f0f0" />
              
              {/* App content mockup */}
              <rect x="10" y="10" width="280" height="80" fill="#DC143C" rx="20 20 0 0" />
              <text x="30" y="50" fill="white" fontSize="24" fontWeight="bold">NepalIPO</text>
              <text x="30" y="75" fill="white" fontSize="14">Your IPO Companion</text>
              
              {/* IPO Cards */}
              <rect x="20" y="100" width="260" height="100" rx="10" fill="white" stroke="#ddd" />
              <text x="35" y="130" fill="#444" fontSize="16" fontWeight="bold">Pure Energy Ltd.</text>
              <text x="35" y="150" fill="#666" fontSize="12">65 lakh shares at Rs. 100</text>
              <text x="35" y="175" fill="#10B981" fontSize="14" fontWeight="bold">Strong Buy</text>
              <rect x="200" y="160" width="60" height="25" rx="5" fill="#DC143C" />
              <text x="210" y="177" fill="white" fontSize="12">Apply</text>
              
              <rect x="20" y="210" width="260" height="100" rx="10" fill="white" stroke="#ddd" />
              <text x="35" y="240" fill="#444" fontSize="16" fontWeight="bold">Vision Energy</text>
              <text x="35" y="260" fill="#666" fontSize="12">58 lakh shares at Rs. 100</text>
              <text x="35" y="285" fill="#3B82F6" fontSize="14" fontWeight="bold">Buy</text>
              <rect x="200" y="270" width="60" height="25" rx="5" fill="#DC143C" />
              <text x="210" y="287" fill="white" fontSize="12">Apply</text>
              
              {/* Navigation bar */}
              <rect x="10" y="550" width="280" height="40" fill="white" rx="0 0 20 20" />
              <circle cx="60" cy="570" r="15" fill="#f5f5f5" stroke="#ddd" />
              <circle cx="150" cy="570" r="15" fill="#DC143C" />
              <circle cx="240" cy="570" r="15" fill="#f5f5f5" stroke="#ddd" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
