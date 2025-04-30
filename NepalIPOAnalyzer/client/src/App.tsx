import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import IPOCalendar from "@/pages/IPOCalendar";
import CompanyDetails from "@/pages/CompanyDetails";
import EducationalResources from "@/pages/EducationalResources";
import Companies from "@/pages/Companies";
import MarketUpdates from "@/pages/MarketUpdates";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/ipo-calendar" component={IPOCalendar} />
        <Route path="/company/:id" component={CompanyDetails} />
        <Route path="/companies" component={Companies} />
        <Route path="/education" component={EducationalResources} />
        <Route path="/education/:id" component={EducationalResources} />
        <Route path="/market-updates" component={MarketUpdates} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
