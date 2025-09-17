import { useState } from "react";
import { Brain, Mail, Lock, Eye, EyeOff, Users } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import logoUrl from '@/assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate fake login - accept any email/password
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      login(email); // This will trigger the onboarding flow
      toast({
        title: "Welcome!",
        description: "Please complete your profile setup",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate OAuth redirect time
      
      // Simulate successful Google login with fake user data
      const fakeGoogleEmail = "user@gmail.com";
      login(fakeGoogleEmail);
      
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google. Please complete your profile setup",
      });
    } catch (error) {
      toast({
        title: "Google Sign-in failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-2">
      <Card className="w-full max-w-lg h-[95vh] overflow-hidden flex flex-col">
        <CardHeader className="text-center pb-2 flex-shrink-0">
          <div className="mx-auto mb-1 w-12 h-12 rounded-full flex items-center justify-center">
            <img src={logoUrl} alt="ApnaMann Logo" className="w-12 h-12 rounded-full object-cover" />
          </div>
          <CardTitle className="text-xl font-bold">ApnaMann</CardTitle>
          <p className="text-sm text-muted-foreground">Mental Health Support • Sign in to access your platform</p>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            {/* Left Column - Main Login */}
            <div className="space-y-3">
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@student.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-8 h-8 text-xs"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-8 pr-8 h-8 text-xs"
                      data-testid="input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-8 text-xs"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-8 text-xs"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  data-testid="button-google-login"
                >
                  <FaGoogle className="h-3 w-3 mr-1 text-red-500" />
                  Google
                </Button>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-3">
              <div className="text-center text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                <p className="font-medium mb-1">New User?</p>
                <p>Contact student services for account setup</p>
              </div>

              <div className="p-2 bg-muted/30 rounded text-xs">
                <h4 className="font-medium text-foreground mb-1 flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  Privacy
                </h4>
                <p className="text-muted-foreground leading-tight">
                  Secure, confidential platform with encryption & strict privacy guidelines.
                </p>
              </div>

              <div className="p-2 bg-secondary/10 rounded text-xs border border-secondary/20">
                <div className="text-center">
                  <Users className="h-5 w-5 mx-auto text-primary mb-1" />
                  <h4 className="font-medium text-foreground mb-1">Parent Portal</h4>
                  <p className="text-muted-foreground mb-2 leading-tight">
                    Monitor your child's mental health journey
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-xs"
                    onClick={() => setLocation("/parent-portal")}
                    data-testid="button-parent-portal"
                  >
                    Access Portal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}