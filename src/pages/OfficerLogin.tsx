import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog, LogIn, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const OfficerLogin = () => {
  const [credentials, setCredentials] = useState({ officerId: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      if (credentials.officerId === "officer123" && credentials.password === "pass123") {
        localStorage.setItem("officerToken", "officer-authenticated");
        localStorage.setItem("officerData", JSON.stringify({
          id: "officer123",
          name: "John Smith",
          department: "Roads Department",
          role: "Municipal Officer"
        }));
        toast({
          title: "Login Successful",
          description: "Welcome to the Municipal Officer Portal. Redirecting...",
        });
        setTimeout(() => navigate("/officer-dashboard"), 1000);
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid Officer ID or password. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserCog className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Municipal Officer Portal</CardTitle>
          <CardDescription>
            Secure access for municipal officers and staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="officerId">Officer ID</Label>
              <Input
                id="officerId"
                type="text"
                placeholder="Enter your Officer ID"
                value={credentials.officerId}
                onChange={(e) => setCredentials({...credentials, officerId: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Test Credentials:</strong><br />
                  Officer ID: officer123<br />
                  Password: pass123
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficerLogin;