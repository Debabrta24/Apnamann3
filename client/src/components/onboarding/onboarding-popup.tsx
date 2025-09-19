import { useState, useEffect } from "react";
import { User, GraduationCap, Heart, ArrowRight, ArrowLeft } from "lucide-react";
import logoUrl from '@/assets/logo.png';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  firstName: string;
  lastName: string;
  institution: string;
  course: string;
  year: number;
  language: string;
  // Screening questions
  mood: string;
  stress: string;
  sleep: string;
  support: string;
  previousHelp: string;
}

interface OnboardingPopupProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
}

export default function OnboardingPopup({ isOpen, onComplete }: OnboardingPopupProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    institution: "",
    course: "",
    year: 1,
    language: "en",
    mood: "",
    stress: "",
    sleep: "",
    support: "",
    previousHelp: "",
  });
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1) {
      if (!data.firstName || !data.lastName) {
        toast({
          title: "Missing information",
          description: "Please enter your first and last name",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!data.institution || !data.course) {
        toast({
          title: "Missing information", 
          description: "Please complete your academic information",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    if (!data.mood || !data.stress || !data.sleep) {
      toast({
        title: "Missing information",
        description: "Please answer all screening questions",
        variant: "destructive",
      });
      return;
    }
    
    onComplete(data);
  };

  const updateData = (field: keyof OnboardingData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };


  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="p-0 w-full max-w-[95vw] sm:max-w-xl lg:max-w-2xl overflow-hidden my-2 sm:my-8 mx-2 sm:mx-4 rounded-lg sm:rounded-xl">
        {/* Scrollable Content Area */}
        <div className="max-h-[80vh] sm:max-h-[75vh] overflow-y-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 sm:pb-3">
          <DialogHeader className="pb-3 sm:pb-2">
            <div className="flex items-center justify-center mb-2 sm:mb-2">
              <img src={logoUrl} alt="ApnaMann Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover" data-testid="img-logo-onboarding" />
            </div>
            <DialogTitle className="flex items-center justify-center text-base sm:text-lg font-semibold">
              <User className="h-4 w-4 mr-2" />
              Welcome! Let's get you started
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-center px-1">
              We need some information to personalize your experience
            </DialogDescription>
          </DialogHeader>

        <div className="space-y-3 sm:space-y-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] sm:text-xs px-1 py-1 mr-2">
              <span className="font-medium">Step {step} of {totalSteps}</span>
              <span className="font-medium text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2 sm:h-1.5" />
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card className="rounded-lg border-0 shadow-sm bg-card/50">
              <CardHeader className="pb-2 sm:pb-2">
                <CardTitle className="text-sm sm:text-base flex items-center font-medium">
                  <User className="h-4 w-4 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-2 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={data.firstName}
                      onChange={(e) => updateData("firstName", e.target.value)}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={data.lastName}
                      onChange={(e) => updateData("lastName", e.target.value)}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preferred Language</Label>
                  <Select value={data.language} onValueChange={(value) => updateData("language", value)}>
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Academic Information */}
          {step === 2 && (
            <Card className="rounded-lg border-0 shadow-sm bg-card/50">
              <CardHeader className="pb-2 sm:pb-2">
                <CardTitle className="text-sm sm:text-base flex items-center font-medium">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-2 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-sm font-medium">Institution</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., IIT Delhi, Delhi University"
                    value={data.institution}
                    onChange={(e) => updateData("institution", e.target.value)}
                    data-testid="input-institution"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course" className="text-sm font-medium">Course/Major</Label>
                  <Input
                    id="course"
                    placeholder="e.g., Computer Science, Psychology"
                    value={data.course}
                    onChange={(e) => updateData("course", e.target.value)}
                    data-testid="input-course"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Year of Study</Label>
                  <Select value={data.year.toString()} onValueChange={(value) => updateData("year", parseInt(value))}>
                    <SelectTrigger data-testid="select-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="5">5th Year</SelectItem>
                      <SelectItem value="6">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Initial Screening Questions */}
          {step === 3 && (
            <Card className="rounded-lg border-0 shadow-sm bg-card/50">
              <CardHeader className="pb-2 sm:pb-2">
                <CardTitle className="text-sm sm:text-base flex items-center font-medium">
                  <Heart className="h-4 w-4 mr-2" />
                  Quick Wellness Check
                </CardTitle>
                <p className="text-xs text-muted-foreground px-1">
                  These questions help us understand how to best support you
                </p>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-2 pt-2">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">How has your mood been lately?</Label>
                  <RadioGroup value={data.mood} onValueChange={(value) => updateData("mood", value)}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id="mood-excellent" />
                        <Label htmlFor="mood-excellent" className="text-xs">Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="mood-good" />
                        <Label htmlFor="mood-good" className="text-xs">Good</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id="mood-fair" />
                        <Label htmlFor="mood-fair" className="text-xs">Fair</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id="mood-poor" />
                        <Label htmlFor="mood-poor" className="text-xs">Poor</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">How would you rate your current stress level?</Label>
                  <RadioGroup value={data.stress} onValueChange={(value) => updateData("stress", value)}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="stress-low" />
                        <Label htmlFor="stress-low" className="text-xs">Low</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="stress-moderate" />
                        <Label htmlFor="stress-moderate" className="text-xs">Moderate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="stress-high" />
                        <Label htmlFor="stress-high" className="text-xs">High</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very-high" id="stress-very-high" />
                        <Label htmlFor="stress-very-high" className="text-xs">Very High</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">How has your sleep been?</Label>
                  <RadioGroup value={data.sleep} onValueChange={(value) => updateData("sleep", value)}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id="sleep-excellent" />
                        <Label htmlFor="sleep-excellent" className="text-xs">Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="sleep-good" />
                        <Label htmlFor="sleep-good" className="text-xs">Good</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id="sleep-fair" />
                        <Label htmlFor="sleep-fair" className="text-xs">Fair</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id="sleep-poor" />
                        <Label htmlFor="sleep-poor" className="text-xs">Poor</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Have you sought mental health support before?</Label>
                  <RadioGroup value={data.previousHelp} onValueChange={(value) => updateData("previousHelp", value)}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="help-yes" />
                        <Label htmlFor="help-yes" className="text-xs">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="help-no" />
                        <Label htmlFor="help-no" className="text-xs">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer-not-to-say" id="help-prefer-not" />
                        <Label htmlFor="help-prefer-not" className="text-xs">Prefer not to say</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
        </div>

        {/* Navigation Buttons - Sticky Footer */}
        <div className="sticky bottom-0 -mx-2 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-3 pb-[env(safe-area-inset-bottom,12px)] bg-background/95 backdrop-blur-sm border-t flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-b-lg sm:rounded-b-xl">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            data-testid="button-previous"
            className="w-full sm:w-auto min-w-[100px] sm:min-w-[120px] h-10 sm:h-9 text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext} data-testid="button-next" className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm">
              Next
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} data-testid="button-complete" className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm">
              Complete Setup
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}