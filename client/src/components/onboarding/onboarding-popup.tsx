import { useState, useEffect } from "react";
import { User, GraduationCap, Heart, ArrowRight, ArrowLeft } from "lucide-react";
import logoUrl from '@assets/logo (1)_1758315813528.png';
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
      <DialogContent className="p-0 w-full max-w-[95vw] sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-hidden my-2 sm:my-8 mx-2 sm:mx-4 rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
        {/* Scrollable Content Area */}
        <div className="px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4 pb-1 sm:pb-2 overflow-y-auto flex-1 min-h-0">
          <DialogHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-center mb-2 sm:mb-2">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <img src={logoUrl} alt="ApnaMann Logo" className="w-6 h-6 sm:w-8 sm:h-8 rounded-md object-cover" data-testid="img-logo-onboarding" />
              </div>
            </div>
            <DialogTitle className="flex items-center justify-center text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100">
              <User className="h-3 w-3 mr-1 text-slate-600 dark:text-slate-400" />
              Welcome! Let's get you started
            </DialogTitle>
            <DialogDescription className="text-xs text-center px-2 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              We need some information to personalize your mental health journey
            </DialogDescription>
          </DialogHeader>

        <div className="space-y-1 sm:space-y-2">
          <div className="space-y-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-1.5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">Step {step} of {totalSteps}</span>
              <span className="font-medium text-slate-600 dark:text-slate-400">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card className="rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
              <CardHeader className="pb-1 sm:pb-2 bg-slate-800 dark:bg-slate-800 text-white rounded-t-lg">
                <CardTitle className="text-xs sm:text-sm flex items-center font-semibold">
                  <User className="h-4 w-4 mr-2 text-slate-300" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 sm:space-y-2 pt-1.5 pb-2 bg-slate-50 dark:bg-slate-800 rounded-b-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-xs font-medium text-slate-700 dark:text-slate-300">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={data.firstName}
                      onChange={(e) => updateData("firstName", e.target.value)}
                      data-testid="input-first-name"
                      className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-slate-900 transition-all duration-200 rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-xs font-medium text-slate-700 dark:text-slate-300">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={data.lastName}
                      onChange={(e) => updateData("lastName", e.target.value)}
                      data-testid="input-last-name"
                      className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-slate-900 transition-all duration-200 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Preferred Language</Label>
                  <Select value={data.language} onValueChange={(value) => updateData("language", value)}>
                    <SelectTrigger data-testid="select-language" className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-slate-900 transition-all duration-200 rounded-md">
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
            <Card className="rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
              <CardHeader className="pb-2 sm:pb-3 bg-slate-700 dark:bg-slate-700 text-white rounded-t-xl">
                <CardTitle className="text-xs sm:text-sm flex items-center font-semibold">
                  <GraduationCap className="h-4 w-4 mr-2 text-slate-300" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 sm:space-y-2 pt-1.5 pb-2 bg-slate-50 dark:bg-slate-800 rounded-b-lg">
                <div className="space-y-1">
                  <Label htmlFor="institution" className="text-xs font-medium text-slate-700 dark:text-slate-300">Institution</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., IIT Delhi, Delhi University"
                    value={data.institution}
                    onChange={(e) => updateData("institution", e.target.value)}
                    data-testid="input-institution"
                    className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-slate-900 transition-all duration-200 rounded-md"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="course" className="text-xs font-medium text-slate-700 dark:text-slate-300">Course/Major</Label>
                  <Input
                    id="course"
                    placeholder="e.g., Computer Science, Psychology"
                    value={data.course}
                    onChange={(e) => updateData("course", e.target.value)}
                    data-testid="input-course"
                    className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-slate-900 transition-all duration-200 rounded-md"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Year of Study</Label>
                  <Select value={data.year.toString()} onValueChange={(value) => updateData("year", parseInt(value))}>
                    <SelectTrigger data-testid="select-year" className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-slate-900 transition-all duration-200 rounded-md">
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
            <Card className="rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
              <CardHeader className="pb-2 sm:pb-3 bg-slate-600 dark:bg-slate-600 text-white rounded-t-xl">
                <CardTitle className="text-xs sm:text-sm flex items-center font-semibold">
                  <Heart className="h-4 w-4 mr-2 text-slate-300" />
                  Quick Wellness Check
                </CardTitle>
                <p className="text-xs text-slate-200 px-1">
                  These questions help us understand how to best support your mental health journey
                </p>
              </CardHeader>
              <CardContent className="space-y-1.5 sm:space-y-2 pt-1.5 pb-2 bg-slate-50 dark:bg-slate-800 rounded-b-lg">
                <div className="space-y-1 p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    How has your mood been lately?
                  </Label>
                  <RadioGroup value={data.mood} onValueChange={(value) => updateData("mood", value)}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("mood", "excellent")}>
                        <RadioGroupItem value="excellent" id="mood-excellent" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="mood-excellent" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("mood", "good")}>
                        <RadioGroupItem value="good" id="mood-good" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="mood-good" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Good</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("mood", "fair")}>
                        <RadioGroupItem value="fair" id="mood-fair" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="mood-fair" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Fair</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("mood", "poor")}>
                        <RadioGroupItem value="poor" id="mood-poor" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="mood-poor" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Poor</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1 p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    How would you rate your current stress level?
                  </Label>
                  <RadioGroup value={data.stress} onValueChange={(value) => updateData("stress", value)}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("stress", "low")}>
                        <RadioGroupItem value="low" id="stress-low" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="stress-low" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Low</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("stress", "moderate")}>
                        <RadioGroupItem value="moderate" id="stress-moderate" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="stress-moderate" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Moderate</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("stress", "high")}>
                        <RadioGroupItem value="high" id="stress-high" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="stress-high" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">High</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("stress", "very-high")}>
                        <RadioGroupItem value="very-high" id="stress-very-high" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="stress-very-high" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Very High</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1 p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    How has your sleep been?
                  </Label>
                  <RadioGroup value={data.sleep} onValueChange={(value) => updateData("sleep", value)}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("sleep", "excellent")}>
                        <RadioGroupItem value="excellent" id="sleep-excellent" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="sleep-excellent" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("sleep", "good")}>
                        <RadioGroupItem value="good" id="sleep-good" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="sleep-good" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Good</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("sleep", "fair")}>
                        <RadioGroupItem value="fair" id="sleep-fair" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="sleep-fair" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Fair</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("sleep", "poor")}>
                        <RadioGroupItem value="poor" id="sleep-poor" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="sleep-poor" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Poor</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1 p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    Have you sought mental health support before?
                  </Label>
                  <RadioGroup value={data.previousHelp} onValueChange={(value) => updateData("previousHelp", value)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("previousHelp", "yes")}>
                        <RadioGroupItem value="yes" id="help-yes" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="help-yes" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-1 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => updateData("previousHelp", "no")}>
                        <RadioGroupItem value="no" id="help-no" className="border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-400" />
                        <Label htmlFor="help-no" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">No</Label>
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
        <div className="flex-shrink-0 px-2 sm:px-4 lg:px-6 py-1.5 pb-[env(safe-area-inset-bottom,6px)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-1.5 rounded-b-lg">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            data-testid="button-previous"
            className="w-full sm:w-auto min-w-[100px] h-9 sm:h-8 text-xs font-medium border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-500 transition-all"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext} data-testid="button-next" className="w-full sm:w-auto min-w-[100px] h-9 sm:h-8 text-xs font-medium bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-sm transition-all">
              Next
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleComplete} data-testid="button-complete" className="w-full sm:w-auto min-w-[100px] h-9 sm:h-8 text-xs font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white shadow-sm transition-all">
              Complete Setup
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}