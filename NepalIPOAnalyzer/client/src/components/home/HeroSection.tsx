import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HeroSection: React.FC = () => {
  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden shadow-lg">
        <div className="md:flex items-center">
          <div className="p-6 md:p-8 md:w-3/5">
            <h2 className="text-white font-poppins text-2xl md:text-3xl font-bold mb-4">
              Make Informed IPO Investment Decisions in Nepal
            </h2>
            <p className="text-white/90 mb-6">
              Analyze upcoming IPOs, get personalized recommendations, and track your portfolio - all tailored for Nepal's unique market.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/ipo-calendar">
                <Button variant="secondary" className="bg-white text-primary hover:bg-neutral-100">
                  Explore IPOs
                </Button>
              </Link>
              <Link href="/education">
                <Button variant="outline" className="bg-white/20 text-white hover:bg-white/30 border-white/40">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block md:w-2/5 p-8">
            <svg 
              viewBox="0 0 500 300" 
              className="w-full h-auto rounded-lg shadow-md"
            >
              <rect x="0" y="0" width="500" height="300" fill="#f5f5f5" rx="8" />
              
              {/* NEPSE line chart */}
              <g transform="translate(50, 50)">
                <text x="0" y="-20" fontSize="16" fontWeight="bold" fill="#333">NEPSE Index Trend</text>
                <line x1="0" y1="0" x2="400" y2="0" stroke="#ddd" strokeWidth="1" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="#ddd" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#ddd" strokeWidth="1" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#ddd" strokeWidth="1" />
                
                <text x="-10" y="5" fontSize="12" textAnchor="end" fill="#666">2400</text>
                <text x="-10" y="55" fontSize="12" textAnchor="end" fill="#666">2300</text>
                <text x="-10" y="105" fontSize="12" textAnchor="end" fill="#666">2200</text>
                <text x="-10" y="155" fontSize="12" textAnchor="end" fill="#666">2100</text>
                
                <path 
                  d="M0,80 L40,90 L80,70 L120,85 L160,65 L200,50 L240,60 L280,40 L320,30 L360,20 L400,30" 
                  fill="none" 
                  stroke="#DC143C" 
                  strokeWidth="3" 
                />
                
                {/* Dots for data points */}
                <circle cx="0" cy="80" r="4" fill="#DC143C" />
                <circle cx="40" cy="90" r="4" fill="#DC143C" />
                <circle cx="80" cy="70" r="4" fill="#DC143C" />
                <circle cx="120" cy="85" r="4" fill="#DC143C" />
                <circle cx="160" cy="65" r="4" fill="#DC143C" />
                <circle cx="200" cy="50" r="4" fill="#DC143C" />
                <circle cx="240" cy="60" r="4" fill="#DC143C" />
                <circle cx="280" cy="40" r="4" fill="#DC143C" />
                <circle cx="320" cy="30" r="4" fill="#DC143C" />
                <circle cx="360" cy="20" r="4" fill="#DC143C" />
                <circle cx="400" cy="30" r="4" fill="#DC143C" />
              </g>
              
              {/* Nepal IPO Sector Distribution */}
              <g transform="translate(250, 250)">
                <text x="0" y="-160" fontSize="14" fontWeight="bold" fill="#333" textAnchor="middle">IPO Sector Distribution</text>
                
                {/* Pie chart */}
                <g>
                  <path d="M0,0 L0,-60 A60,60 0 0,1 52,-30 z" fill="#00337C" />
                  <path d="M0,0 L52,-30 A60,60 0 0,1 30,52 z" fill="#DC143C" />
                  <path d="M0,0 L30,52 A60,60 0 0,1 -52,30 z" fill="#10B981" />
                  <path d="M0,0 L-52,30 A60,60 0 0,1 -30,-52 z" fill="#F59E0B" />
                  <path d="M0,0 L-30,-52 A60,60 0 0,1 0,-60 z" fill="#3B82F6" />
                </g>
                
                {/* Legend */}
                <g transform="translate(80, -30)">
                  <rect x="0" y="0" width="10" height="10" fill="#00337C" />
                  <text x="15" y="9" fontSize="10" fill="#666">Hydropower (35%)</text>
                  
                  <rect x="0" y="15" width="10" height="10" fill="#DC143C" />
                  <text x="15" y="24" fontSize="10" fill="#666">Microfinance (25%)</text>
                  
                  <rect x="0" y="30" width="10" height="10" fill="#10B981" />
                  <text x="15" y="39" fontSize="10" fill="#666">Banking (20%)</text>
                  
                  <rect x="0" y="45" width="10" height="10" fill="#F59E0B" />
                  <text x="15" y="54" fontSize="10" fill="#666">Insurance (15%)</text>
                  
                  <rect x="0" y="60" width="10" height="10" fill="#3B82F6" />
                  <text x="15" y="69" fontSize="10" fill="#666">Other (5%)</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
