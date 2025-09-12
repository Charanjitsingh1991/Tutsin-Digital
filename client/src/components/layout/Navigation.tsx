import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X, User, Clock } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useTimeBasedTheme } from "@/hooks/useTimeBasedTheme";

export function Navigation() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { client, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAutoTheme, setIsAutoTheme] = useState(true);
  const { isDay, currentTime } = useTimeBasedTheme(isAutoTheme);

  // Disable auto theme when user manually toggles
  const toggleTheme = () => {
    setIsAutoTheme(false);
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleAutoTheme = () => {
    setIsAutoTheme(!isAutoTheme);
  };

  // Re-enable auto theme when toggled back on
  useEffect(() => {
    if (isAutoTheme) {
      // The useTimeBasedTheme hook will handle the theme switching
    }
  }, [isAutoTheme]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/web-design", label: "Web Design" },
    { href: "/hosting", label: "Hosting" },
    { href: "/blog", label: "Blog" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-2 cursor-pointer">
              <img 
                src="/logo.png" 
                alt="Tutsin Digital Logo" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-gradient">Tutsin</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}>
                <span
                  className={`cursor-pointer transition-colors ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAutoTheme}
              data-testid="button-auto-theme-toggle"
              className={`p-2 ${isAutoTheme ? 'text-yellow-500' : 'text-muted-foreground'}`}
              title={isAutoTheme ? 'Auto theme enabled (based on time)' : 'Auto theme disabled'}
            >
              <Clock className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              className="p-2"
              disabled={isAutoTheme}
              title={isAutoTheme ? 'Manual theme control disabled' : 'Toggle theme manually'}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            
            {client ? (
              <div className="flex items-center space-x-2">
                <Link href="/client-portal" data-testid="link-client-portal">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{client.firstName}</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/client-login" data-testid="link-client-login">
                  <Button variant="outline">
                    Client Login
                  </Button>
                </Link>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-get-started"
                >
                  Get Started
                </Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} data-testid={`link-mobile-${item.label.toLowerCase().replace(" ", "-")}`}>
                  <div
                    className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-secondary"
                        : "text-foreground hover:text-primary hover:bg-secondary/50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
