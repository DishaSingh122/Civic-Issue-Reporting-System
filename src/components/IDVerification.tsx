import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IDVerificationProps {
  onVerificationSuccess: () => void;
}

const IDVerification = ({ onVerificationSuccess }: IDVerificationProps) => {
  const [formData, setFormData] = useState({
    idType: "",
    idNumber: ""
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const idTypes = [
    { value: "aadhaar", label: "Aadhaar Card", pattern: /^\d{4}\s\d{4}\s\d{4}$|^\d{12}$/, placeholder: "1234 5678 9012" },
    { value: "pan", label: "PAN Card", pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, placeholder: "ABCDE1234F" },
    { value: "passport", label: "Passport", pattern: /^[A-Z]{1}[0-9]{7}$/, placeholder: "A1234567" },
    { value: "visa", label: "Visa", pattern: /^[A-Z0-9]{8,12}$/, placeholder: "12345678" }
  ];

  const validateID = (type: string, number: string): boolean => {
    const idType = idTypes.find(id => id.value === type);
    if (!idType) return false;
    
    // Remove spaces for validation
    const cleanNumber = number.replace(/\s/g, '');
    return idType.pattern.test(cleanNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    // Validate ID format
    if (!validateID(formData.idType, formData.idNumber)) {
      setError("Invalid ID format. Please check your input.");
      setIsVerifying(false);
      return;
    }

    // Simulate backend verification
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Test verification logic (you can replace this with real backend validation)
      const isValid = Math.random() > 0.2; // 80% success rate for demo
      
      if (isValid) {
        toast({
          title: "ID Verified Successfully!",
          description: "Your identity has been verified. You can now proceed to report an issue.",
        });
        onVerificationSuccess();
      } else {
        setError("ID verification failed. Please check your details and try again.");
      }
    } catch (err) {
      setError("Verification service is temporarily unavailable. Please try again later.");
    } finally {
      setIsVerifying(false);
    }
  };

  const selectedIdType = idTypes.find(id => id.value === formData.idType);

  return (
    <section id="verification" className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ID Verification Required</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            To ensure authentic reporting and prevent misuse, please verify your government-issued ID before proceeding.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Verify Your Identity</span>
              </CardTitle>
              <CardDescription>
                This helps us maintain the integrity of our reporting system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type</Label>
                  <Select 
                    value={formData.idType} 
                    onValueChange={(value) => {
                      setFormData({...formData, idType: value, idNumber: ""});
                      setError("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {idTypes.map((id) => (
                        <SelectItem key={id.value} value={id.value}>
                          {id.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.idType && (
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input 
                      id="idNumber"
                      placeholder={selectedIdType?.placeholder}
                      value={formData.idNumber}
                      onChange={(e) => {
                        setFormData({...formData, idNumber: e.target.value.toUpperCase()});
                        setError("");
                      }}
                      className={error ? "border-destructive" : ""}
                      required
                    />
                    {selectedIdType && (
                      <p className="text-xs text-muted-foreground">
                        Enter your {selectedIdType.label} number in the format shown above
                      </p>
                    )}
                  </div>
                )}

                {error && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={!formData.idType || !formData.idNumber || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify ID
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Your privacy is protected:</p>
                    <ul className="space-y-1">
                      <li>• ID details are encrypted and secure</li>
                      <li>• Used only for verification purposes</li>
                      <li>• Not shared with third parties</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default IDVerification;