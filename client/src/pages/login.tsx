import { useState, useEffect } from "react";
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
  const { login, isAuthenticated, isOnboarding } = useAppContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect to dashboard when user is authenticated and not in onboarding
  useEffect(() => {
    if (isAuthenticated && !isOnboarding) {
      setLocation("/");
    }
  }, [isAuthenticated, isOnboarding, setLocation]);

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
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] rounded-2xl">
        <CardHeader className="py-4 sm:py-6 text-center flex-shrink-0">
          <div className="mx-auto mb-1 sm:mb-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
            <img src={logoUrl} alt="ApnaMann Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" data-testid="img-logo-login" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">ApnaMann</CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Mental Health Support • Sign in to access your platform</p>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 flex-1">
          <div className="space-y-4 sm:space-y-6">
            {/* Main Login Form */}
            <div className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@student.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-foreground placeholder:text-muted-foreground transition-all duration-200 rounded-md"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-foreground placeholder:text-muted-foreground transition-all duration-200 rounded-md"
                      data-testid="input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2" data-testid="row-auth-buttons">
                  <Button
                    type="submit"
                    className="h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 active:scale-95 text-white shadow-lg hover:shadow-blue-500/30 hover:shadow-xl transition-all duration-300 rounded-lg"
                    disabled={isLoading}
                    data-testid="button-signin"
                  >
                    {isLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                  <Button
                    type="button"
                    className="h-14 text-base font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 hover:scale-105 active:scale-95 text-white shadow-lg hover:shadow-emerald-500/30 hover:shadow-xl transition-all duration-300 rounded-lg"
                    onClick={handleLogin}
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 text-base font-semibold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-gray-400/20 hover:shadow-xl transition-all duration-300 rounded-lg"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    data-testid="button-google-login"
                  >
                    <FaGoogle className="h-4 w-4 mr-2 text-red-500" />
                    <span className="hidden sm:inline">Google</span>
                    <span className="sm:hidden">Sign in with Google</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Additional Info Sections */}
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center text-sm sm:text-base text-teal-700 dark:text-teal-300 p-3 sm:p-4 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/50 dark:to-teal-900/30 backdrop-blur-sm rounded-lg border border-teal-200 dark:border-teal-800">
                <p className="font-medium mb-1 sm:mb-2 text-teal-800 dark:text-teal-200">New User?</p>
                <p className="leading-tight">Contact student services for account setup</p>
              </div>

              <div 
                className="p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 backdrop-blur-sm rounded-lg text-sm sm:text-base border border-emerald-200 dark:border-emerald-800 text-center cursor-pointer hover:from-emerald-100 hover:to-emerald-200 hover:border-emerald-300 dark:hover:from-emerald-900/70 dark:hover:to-emerald-800/50 dark:hover:border-emerald-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => window.open('/privacy', '_blank', 'noopener,noreferrer')}
                data-testid="div-privacy-security"
              >
                <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-1 sm:mb-2 flex items-center justify-center">
                  <Lock className="h-3 w-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                  Privacy & Security
                </h4>
                <p className="text-emerald-700 dark:text-emerald-300 leading-tight">
                  <span className="font-bold text-emerald-800 dark:text-emerald-200">Nobody knows details - your parents, institute, or no one.</span>
                </p>
                <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 mt-1 sm:mt-2 font-medium">Click for full details →</p>
              </div>

              <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30 backdrop-blur-sm rounded-lg text-sm sm:text-base border border-orange-200 dark:border-orange-800">
                <div className="text-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-orange-600 dark:text-orange-400 mb-0.5 sm:mb-1" />
                  <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1 sm:mb-2">Parent Guide</h4>
                  <p className="text-orange-700 dark:text-orange-300 mb-2 sm:mb-3 leading-relaxed">
                    <span className="font-bold text-orange-800 dark:text-orange-200">Register as a student parent</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/30 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-800/40 hover:scale-105 active:scale-95 text-orange-700 dark:text-orange-300 font-medium shadow-md hover:shadow-orange-400/20 hover:shadow-lg transition-all duration-200"
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