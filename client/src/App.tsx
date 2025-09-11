import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import WebDesign from "@/pages/WebDesign";
import Hosting from "@/pages/Hosting";
import Blog from "@/pages/Blog";
import Terms from "@/pages/Terms";
import Admin from "@/pages/Admin";
import ClientAuth from "@/pages/ClientAuth";
import ClientPortal from "@/pages/ClientPortal";
import { Analytics } from "@/pages/Analytics";
import { ProjectManagement } from "@/pages/ProjectManagement";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/web-design" component={WebDesign} />
        <Route path="/hosting" component={Hosting} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={Blog} />
        <Route path="/terms" component={Terms} />
        <Route path="/admin" component={Admin} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/client-login" component={ClientAuth} />
        <Route path="/client-portal" component={ClientPortal} />
        <Route path="/projects" component={ProjectManagement} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="tutsin-ui-theme">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
