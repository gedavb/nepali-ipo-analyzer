import React from "react";
import { Link } from "wouter";
import Icons from "../icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Icons.logo className="h-4 w-4" />
              </div>
              <h1 className="font-poppins font-bold text-lg text-primary">NepalIPO</h1>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Your trusted companion for making informed IPO investment decisions in Nepal's stock market.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-neutral-600 hover:text-primary">
                <Icons.facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-600 hover:text-primary">
                <Icons.twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-600 hover:text-primary">
                <Icons.mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-neutral-600 hover:text-primary">Home</Link>
              </li>
              <li>
                <Link href="/ipo-calendar" className="text-sm text-neutral-600 hover:text-primary">IPO Calendar</Link>
              </li>
              <li>
                <Link href="/companies" className="text-sm text-neutral-600 hover:text-primary">Companies</Link>
              </li>
              <li>
                <Link href="/education" className="text-sm text-neutral-600 hover:text-primary">Educational Resources</Link>
              </li>
              <li>
                <Link href="/market-updates" className="text-sm text-neutral-600 hover:text-primary">Market Updates</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/education/ipo-application-guide" className="text-sm text-neutral-600 hover:text-primary">IPO Application Guide</Link>
              </li>
              <li>
                <Link href="/education/demat-setup" className="text-sm text-neutral-600 hover:text-primary">DEMAT Account Setup</Link>
              </li>
              <li>
                <Link href="/education/glossary" className="text-sm text-neutral-600 hover:text-primary">Financial Glossary</Link>
              </li>
              <li>
                <Link href="/education/faqs" className="text-sm text-neutral-600 hover:text-primary">IPO FAQs</Link>
              </li>
              <li>
                <Link href="/education/investment-strategies" className="text-sm text-neutral-600 hover:text-primary">Investment Strategies</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-neutral-600 hover:text-primary">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-neutral-600 hover:text-primary">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-neutral-600 hover:text-primary">Disclaimer</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-neutral-600 hover:text-primary">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-600 hover:text-primary">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-500">© {new Date().getFullYear()} NepalIPO. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <p className="text-xs text-neutral-500">Data Sources: Nepal Stock Exchange (NEPSE), Securities Board of Nepal (SEBON), Company Prospectuses</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
