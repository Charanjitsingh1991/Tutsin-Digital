import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, Settings, LogOut, Folder, TrendingUp } from "lucide-react";

export default function ClientPortal() {
  const { client, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access the client portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient" data-testid="text-portal-title">
              Welcome, {client.firstName}!
            </h1>
            <p className="text-muted-foreground mt-2" data-testid="text-portal-description">
              Manage your projects and track progress from your client portal
            </p>
          </div>
          <Button 
            onClick={logout} 
            variant="outline"
            data-testid="button-portal-logout"
          >
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:scale-105 transition-all duration-300" data-testid="card-profile">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="text-primary mr-3 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                View and manage your account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {client.firstName} {client.lastName}</div>
                <div><strong>Email:</strong> {client.email}</div>
                {client.company && <div><strong>Company:</strong> {client.company}</div>}
                {client.phone && <div><strong>Phone:</strong> {client.phone}</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all duration-300" data-testid="card-projects">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Folder className="text-primary mr-3 h-5 w-5" />
                My Projects
              </CardTitle>
              <CardDescription>
                View your active and completed projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track project progress, milestones, and collaborate with your team.
              </p>
              <Link href="/projects">
                <Button className="w-full gradient-bg text-white hover:opacity-90" data-testid="button-view-projects">
                  View Projects
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all duration-300" data-testid="card-invoices">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="text-primary mr-3 h-5 w-5" />
                Invoices & Payments
              </CardTitle>
              <CardDescription>
                Manage your billing and payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Payment system coming soon! For billing inquiries, please contact our team.
              </p>
              <Button className="mt-4 w-full" variant="outline" data-testid="button-billing-support">
                Billing Support
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Card data-testid="card-support">
            <CardHeader>
              <CardTitle className="text-center">Need Help?</CardTitle>
              <CardDescription className="text-center">
                Our team is here to assist you with any questions or concerns
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <i className="fas fa-phone text-2xl text-primary mb-2"></i>
                  <div className="text-sm font-medium">Phone Support</div>
                  <div className="text-sm text-muted-foreground">+91 9876543210</div>
                </div>
                <div className="flex flex-col items-center">
                  <i className="fas fa-envelope text-2xl text-primary mb-2"></i>
                  <div className="text-sm font-medium">Email Support</div>
                  <div className="text-sm text-muted-foreground">support@tutsin.in</div>
                </div>
                <div className="flex flex-col items-center">
                  <i className="fas fa-comments text-2xl text-primary mb-2"></i>
                  <div className="text-sm font-medium">Live Chat</div>
                  <div className="text-sm text-muted-foreground">Available 24/7</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}