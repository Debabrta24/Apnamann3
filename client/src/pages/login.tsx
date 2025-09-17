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
    <div className="h-[100svh] bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-3">
      <Card className="w-full max-w-3xl h-[92svh] overflow-hidden flex flex-col bg-card/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:bg-card/50 dark:border-white/5">
        <CardHeader className="py-3 text-center flex-shrink-0">
          <div className="mx-auto mb-2 w-10 h-10 rounded-full flex items-center justify-center">
            <img src={logoUrl} alt="ApnaMann Logo" className="w-10 h-10 rounded-full object-cover" />
          </div>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">ApnaMann</CardTitle>
          <p className="text-[13px] text-muted-foreground leading-tight">Mental Health Support • Sign in to access your platform</p>
        </CardHeader>
        
        <CardContent className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4 h-full">
            {/* Left Column - Main Login */}
            <div className="space-y-2">
              <form onSubmit={handleLogin} className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[13px] font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@student.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-9 text-[13px] bg-background/50 backdrop-blur-sm border-white/20 focus:border-primary/50"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-[13px] font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-9 text-[13px] bg-background/50 backdrop-blur-sm border-white/20 focus:border-primary/50"
                      data-testid="input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-primary/10"
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

                <div className="grid grid-cols-2 gap-2" data-testid="row-auth-buttons">
                  <Button
                    type="submit"
                    className="h-9 text-xs bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary font-medium"
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 text-xs bg-background/30 backdrop-blur-sm border-white/20 hover:bg-primary/5 font-medium"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    data-testid="button-google-login"
                  >
                    <FaGoogle className="h-3 w-3 mr-1 text-red-500" />
                    Google
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-2">
              <div className="text-center text-[13px] text-muted-foreground p-3 bg-gradient-to-br from-muted/40 to-muted/20 backdrop-blur-sm rounded-lg border border-white/10">
                <p className="font-medium mb-1 text-foreground">New User?</p>
                <p className="leading-tight">Contact student services for account setup</p>
              </div>

              <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-lg text-[13px] border border-primary/20">
                <h4 className="font-medium text-foreground mb-1 flex items-center">
                  <Lock className="h-3 w-3 mr-1 text-primary" />
                  Privacy & Security
                </h4>
                <p className="text-muted-foreground leading-tight">
                  End-to-end encrypted conversations with strict confidentiality protocols.
                </p>
              </div>

              <div className="p-3 bg-gradient-to-br from-secondary/10 to-secondary/5 backdrop-blur-sm rounded-lg text-[13px] border border-secondary/20">
                <div className="text-center">
                  <Users className="h-5 w-5 mx-auto text-secondary mb-1" />
                  <h4 className="font-medium text-foreground mb-1">Parent Portal</h4>
                  <p className="text-muted-foreground mb-2 leading-tight">
                    Monitor your child's mental health journey
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-xs bg-background/30 backdrop-blur-sm border-white/20 hover:bg-secondary/10"
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