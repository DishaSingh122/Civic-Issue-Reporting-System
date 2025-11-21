import { Button } from "@/components/ui/button";
import { MapPin, Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, signOut, isStaff } = useAuth();

  return (
    <header className="w-full bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">College Issue Reporting System</h1>
            <p className="text-xs text-muted-foreground">Report • Track • Improve</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#report" className="text-muted-foreground hover:text-foreground transition-colors">
            Report Issue
          </a>
          <a href="#track" className="text-muted-foreground hover:text-foreground transition-colors">
            Track Issues
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {isStaff && (
                <Link to="/dashboard">
                  <Button size="sm" variant="outline">
                    Staff Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-primary hover:bg-primary-hover">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;