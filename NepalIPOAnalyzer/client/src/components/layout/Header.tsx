import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import Icons from "../icons";

const Header: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <Icons.logo className="h-6 w-6" />
            </div>
            <Link href="/" className="font-medium font-poppins text-xl text-primary">
              NepalIPO
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`text-neutral-600 hover:text-primary text-sm font-medium transition ${location === "/" ? "text-primary" : ""}`}>
              Home
            </Link>
            <Link href="/ipo-calendar" className={`text-neutral-600 hover:text-primary text-sm font-medium transition ${location === "/ipo-calendar" ? "text-primary" : ""}`}>
              IPO Calendar
            </Link>
            <Link href="/companies" className={`text-neutral-600 hover:text-primary text-sm font-medium transition ${location === "/companies" ? "text-primary" : ""}`}>
              Companies
            </Link>
            <Link href="/education" className={`text-neutral-600 hover:text-primary text-sm font-medium transition ${location === "/education" ? "text-primary" : ""}`}>
              Learn
            </Link>
            <Link href="/market-updates" className={`text-neutral-600 hover:text-primary text-sm font-medium transition ${location === "/market-updates" ? "text-primary" : ""}`}>
              Market Updates
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button className="hidden md:block" variant="default">
              Sign In
            </Button>
            <button 
              className="md:hidden text-neutral-600" 
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <Icons.menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-neutral-200">
          <Link href="/" className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50 rounded-md">
            Home
          </Link>
          <Link href="/ipo-calendar" className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50 rounded-md">
            IPO Calendar
          </Link>
          <Link href="/companies" className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50 rounded-md">
            Companies
          </Link>
          <Link href="/education" className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50 rounded-md">
            Learn
          </Link>
          <Link href="/market-updates" className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50 rounded-md">
            Market Updates
          </Link>
          <Button className="w-full" variant="default">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
