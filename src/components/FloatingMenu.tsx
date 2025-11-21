import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, FileText, BarChart3, Users, Phone, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isStaff, signOut } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "/", external: false, isLink: true },
    { icon: FileText, label: "Report Issue", href: "report", external: false, isLink: false },
    { icon: BarChart3, label: "Track My Report", href: "/track-complaint", external: false, isLink: true },
    { icon: Users, label: "Municipal Login", href: "/officer-login", external: false, isLink: true },
    { icon: Users, label: "About", href: "about", external: false, isLink: false },
    { icon: Phone, label: "Contact", href: "contact", external: false, isLink: false },
  ];

  if (isStaff) {
    menuItems.splice(2, 0, { icon: BarChart3, label: "Dashboard", href: "/dashboard", external: false, isLink: true });
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={toggleMenu}
          size="lg"
          className="w-14 h-14 rounded-full shadow-strong glass hover:glass-dark transition-all duration-300"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Sliding Menu Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 glass-dark border-l border-white/10 z-40 animate-slide-in">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Navigation</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-4 rounded-lg glass border border-white/10">
                  <p className="text-sm text-white/70">Signed in as</p>
                  <p className="font-medium text-white truncate">{user.email}</p>
                  {isStaff && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                      Staff
                    </span>
                  )}
                </div>
              )}

              {/* Menu Items */}
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    {item.isLink ? (
                      <Link
                        to={item.href}
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-white/10 text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-white/10 text-white transition-colors w-full text-left"
                        onClick={() => scrollToSection(item.href)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    )}
                  </div>
                ))}
              </nav>

              {/* Auth Actions */}
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/auth"
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-white/10 text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Users className="w-5 h-5" />
                      <span>Account Settings</span>
                    </Link>
                    <button
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-white/10 text-white transition-colors w-full text-left"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center space-x-3 p-4 rounded-lg hover:bg-white/10 text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FloatingMenu;