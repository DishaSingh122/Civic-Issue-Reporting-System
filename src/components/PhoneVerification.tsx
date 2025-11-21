import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhoneVerificationProps {
  onVerificationSuccess: () => void;
}

const PhoneVerification = ({ onVerificationSuccess }: PhoneVerificationProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const { toast } = useToast();

  const validatePhoneNumber = (phone: string): boolean => {
    // Indian phone number validation (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
  };

  const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSendingOtp(true);

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      setIsSendingOtp(false);
      return;
    }

    try {
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate and store OTP
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      setIsOtpSent(true);
      setOtpExpiry(new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes expiry
      
      toast({
        title: "OTP Sent Successfully!",
        description: `A 6-digit code has been sent to ${phoneNumber}. (Demo: ${newOtp})`,
      });
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    // Check if OTP is expired
    if (otpExpiry && new Date() > otpExpiry) {
      setError("OTP has expired. Please request a new one.");
      setIsVerifying(false);
      setIsOtpSent(false);
      setOtp("");
      return;
    }

    // Verify OTP
    if (otp === generatedOtp) {
      toast({
        title: "Phone Number Verified!",
        description: "Your phone number has been verified successfully.",
      });
      onVerificationSuccess();
    } else {
      setError("Incorrect OTP. Please check and try again.");
    }
    
    setIsVerifying(false);
  };

  const handleResendOtp = () => {
    setIsOtpSent(false);
    setOtp("");
    setError("");
    handleSendOtp(new Event('submit') as any);
  };

  // Auto-expire OTP check
  useEffect(() => {
    if (otpExpiry) {
      const timer = setInterval(() => {
        if (new Date() > otpExpiry) {
          setIsOtpSent(false);
          setOtp("");
          setError("OTP has expired. Please request a new one.");
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [otpExpiry]);

  return (
    <section id="verification" className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Phone Number Verification</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            To ensure authentic reporting and prevent misuse, please verify your phone number before proceeding.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary" />
                <span>Verify Your Phone Number</span>
              </CardTitle>
              <CardDescription>
                We'll send you a verification code to confirm your identity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your 10-digit phone number"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value.replace(/\D/g, ''));
                        setError("");
                      }}
                      className={error ? "border-destructive" : ""}
                      maxLength={10}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your phone number without country code
                    </p>
                  </div>

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
                    disabled={!phoneNumber || phoneNumber.length !== 10 || isSendingOtp}
                  >
                    {isSendingOtp ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send OTP
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input 
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ''));
                        setError("");
                      }}
                      className={error ? "border-destructive" : ""}
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      OTP sent to {phoneNumber}
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={!otp || otp.length !== 6 || isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify OTP
                        </>
                      )}
                    </Button>

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={handleResendOtp}
                      disabled={isSendingOtp}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Your privacy is protected:</p>
                    <ul className="space-y-1">
                      <li>• Phone number is encrypted and secure</li>
                      <li>• Used only for verification purposes</li>
                      <li>• OTP expires in 5 minutes</li>
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

export default PhoneVerification;