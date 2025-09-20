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
import logoUrl from '@assets/logo (1)_1758315813528.png';

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
    <div className="h-[100svh] bg-gradient-to-br from-primary/10 via-background to-secondary/20 flex items-center justify-center p-3">
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[92svh] overflow-hidden flex flex-col bg-card/90 backdrop-blur-xl border border-border shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <CardHeader className="py-2 sm:py-3 text-center flex-shrink-0">
          <div className="mx-auto mb-1 sm:mb-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
            <img src={logoUrl} alt="ApnaMann Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" data-testid="img-logo-login" />
          </div>
          <CardTitle className="text-base sm:text-lg font-bold text-foreground">ApnaMann</CardTitle>
          <p className="text-xs sm:text-[13px] text-muted-foreground leading-tight">Mental Health Support • Sign in to access your platform</p>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-4 flex-1 overflow-y-auto">
          <div className="space-y-3 sm:space-y-4">
            {/* Main Login Form */}
            <div className="space-y-2">
              <form onSubmit={handleLogin} className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[13px] font-medium text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@student.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-9 text-[13px] bg-muted/30 backdrop-blur-sm border-border hover:border-primary/30 hover:bg-muted/50 focus:border-primary focus:ring-0 focus:ring-offset-0 text-foreground transition-all duration-200"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-[13px] font-medium text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-9 text-[13px] bg-muted/30 backdrop-blur-sm border-border hover:border-primary/30 hover:bg-muted/50 focus:border-primary focus:ring-0 focus:ring-offset-0 text-foreground transition-all duration-200"
                      data-testid="input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted/50"
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-1" data-testid="row-auth-buttons">
                  <Button
                    type="submit"
                    className="h-10 text-sm sm:text-xs bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 hover:scale-105 active:scale-95 text-white font-medium shadow-lg hover:shadow-slate-500/30 hover:shadow-xl transition-all duration-200"
                    disabled={isLoading}
                    data-testid="button-signin"
                  >
                    {isLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                  <Button
                    type="button"
                    className="h-10 text-sm sm:text-xs bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 hover:scale-105 active:scale-95 text-white font-medium shadow-lg hover:shadow-teal-500/30 hover:shadow-xl transition-all duration-200"
                    onClick={handleLogin}
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 text-sm sm:text-xs bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:bg-gray-100 hover:scale-105 active:scale-95 text-gray-700 font-medium shadow-lg hover:shadow-gray-400/20 hover:shadow-xl transition-all duration-200"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    data-testid="button-google-login"
                  >
                    <FaGoogle className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="hidden sm:inline">Google</span>
                    <span className="sm:hidden">Sign in with Google</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Additional Info Sections */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-center text-xs sm:text-[13px] text-slate-600 p-2 sm:p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 backdrop-blur-sm rounded-lg border border-slate-200">
                <p className="font-medium mb-0.5 sm:mb-1 text-slate-800">New User?</p>
                <p className="leading-tight">Contact student services for account setup</p>
              </div>

              <div 
                className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm rounded-lg text-xs sm:text-[13px] border border-blue-200 text-center cursor-pointer hover:from-blue-100 hover:to-blue-150 hover:border-blue-300 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => window.open('/privacy', '_blank', 'noopener,noreferrer')}
                data-testid="div-privacy-security"
              >
                <h4 className="font-medium text-slate-800 mb-0.5 sm:mb-1 flex items-center justify-center">
                  <Lock className="h-3 w-3 mr-1 text-blue-600" />
                  Privacy & Security
                </h4>
                <p className="text-slate-600 leading-tight">
                  <span className="font-bold text-slate-800">Nobody knows details - your parents, institute, or no one.</span>
                </p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5 sm:mt-1 font-medium">Click for full details →</p>
              </div>

              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm rounded-lg text-xs sm:text-[13px] border border-purple-200">
                <div className="text-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-purple-600 mb-0.5 sm:mb-1" />
                  <h4 className="font-medium text-slate-800 mb-0.5 sm:mb-1">Parent Guide</h4>
                  <p className="text-slate-600 mb-1.5 sm:mb-2 leading-tight">
                    <span className="font-bold text-slate-800">Register as a student parent</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 sm:h-8 text-[10px] sm:text-xs bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:bg-purple-100 hover:scale-105 active:scale-95 text-purple-700 font-medium shadow-md hover:shadow-purple-400/20 hover:shadow-lg transition-all duration-200"
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