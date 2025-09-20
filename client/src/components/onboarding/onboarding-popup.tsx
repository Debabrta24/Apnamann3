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
      <DialogContent className="p-0 w-full max-w-[95vw] sm:max-w-xl lg:max-w-2xl overflow-hidden my-2 sm:my-8 mx-2 sm:mx-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20">
        {/* Scrollable Content Area */}
        <div className="max-h-[80vh] sm:max-h-[75vh] overflow-y-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 sm:pb-3">
          <DialogHeader className="pb-3 sm:pb-2">
            <div className="flex items-center justify-center mb-2 sm:mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <img src={logoUrl} alt="ApnaMann Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover" data-testid="img-logo-onboarding" />
              </div>
            </div>
            <DialogTitle className="flex items-center justify-center text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              <User className="h-4 w-4 mr-2 text-purple-500" />
              Welcome! Let's get you started
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-center px-1 text-slate-600 dark:text-slate-300">
              We need some information to personalize your mental health journey
            </DialogDescription>
          </DialogHeader>

        <div className="space-y-3 sm:space-y-2">
          <div className="space-y-2 bg-white/70 dark:bg-slate-800/70 rounded-xl p-3 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between text-[10px] sm:text-xs px-1 py-1 mr-2">
              <span className="font-medium text-purple-700 dark:text-purple-300">Step {step} of {totalSteps}</span>
              <span className="font-medium text-pink-600 dark:text-pink-400">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-3 sm:h-2.5 bg-purple-100 dark:bg-purple-900" />
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card className="rounded-xl border-2 border-coral-200 dark:border-coral-700 shadow-lg bg-gradient-to-br from-coral-50 to-orange-50 dark:from-coral-900/20 dark:to-orange-900/20">
              <CardHeader className="pb-2 sm:pb-2 bg-gradient-to-r from-coral-500 to-orange-500 text-white rounded-t-xl">
                <CardTitle className="text-sm sm:text-base flex items-center font-medium">
                  <User className="h-5 w-5 mr-2 bg-white/20 p-1 rounded-full" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-2 pt-2 bg-white/60 dark:bg-slate-800/60 rounded-b-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-orange-700 dark:text-orange-300">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={data.firstName}
                      onChange={(e) => updateData("firstName", e.target.value)}
                      data-testid="input-first-name"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 dark:border-orange-600 dark:focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-orange-700 dark:text-orange-300">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={data.lastName}
                      onChange={(e) => updateData("lastName", e.target.value)}
                      data-testid="input-last-name"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 dark:border-orange-600 dark:focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-orange-700 dark:text-orange-300">Preferred Language</Label>
                  <Select value={data.language} onValueChange={(value) => updateData("language", value)}>
                    <SelectTrigger data-testid="select-language" className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 dark:border-orange-600">
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
            <Card className="rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20">
              <CardHeader className="pb-2 sm:pb-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-t-xl">
                <CardTitle className="text-sm sm:text-base flex items-center font-medium">
                  <GraduationCap className="h-5 w-5 mr-2 bg-white/20 p-1 rounded-full" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-2 pt-2 bg-white/60 dark:bg-slate-800/60 rounded-b-xl">
                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-sm font-medium text-blue-700 dark:text-blue-300">Institution</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., IIT Delhi, Delhi University"
                    value={data.institution}
                    onChange={(e) => updateData("institution", e.target.value)}
                    data-testid="input-institution"
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-blue-600 dark:focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course" className="text-sm font-medium text-blue-700 dark:text-blue-300">Course/Major</Label>
                  <Input
                    id="course"
                    placeholder="e.g., Computer Science, Psychology"
                    value={data.course}
                    onChange={(e) => updateData("course", e.target.value)}
                    data-testid="input-course"
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-blue-600 dark:focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">Year of Study</Label>
                  <Select value={data.year.toString()} onValueChange={(value) => updateData("year", parseInt(value))}>
                    <SelectTrigger data-testid="select-year" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-blue-600">
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
            <Card className="rounded-xl border-2 border-purple-200 dark:border-purple-700 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardHeader className="pb-2 sm:pb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-xl">
                <CardTitle className="text-sm sm:text-base flex items-center font-medium">
                  <Heart className="h-5 w-5 mr-2 bg-white/20 p-1 rounded-full animate-pulse" />
                  Quick Wellness Check
                </CardTitle>
                <p className="text-xs text-purple-100 px-1">
                  These questions help us understand how to best support your mental health journey
                </p>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-2 pt-2 bg-white/60 dark:bg-slate-800/60 rounded-b-xl">
                <div className="space-y-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <Label className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center">
                    <span className="mr-2">😊</span> How has your mood been lately?
                  </Label>
                  <RadioGroup value={data.mood} onValueChange={(value) => updateData("mood", value)}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                        <RadioGroupItem value="excellent" id="mood-excellent" className="border-green-400 text-green-600" />
                        <Label htmlFor="mood-excellent" className="text-xs text-green-700 dark:text-green-300">😄 Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                        <RadioGroupItem value="good" id="mood-good" className="border-blue-400 text-blue-600" />
                        <Label htmlFor="mood-good" className="text-xs text-blue-700 dark:text-blue-300">🙂 Good</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                        <RadioGroupItem value="fair" id="mood-fair" className="border-yellow-400 text-yellow-600" />
                        <Label htmlFor="mood-fair" className="text-xs text-yellow-700 dark:text-yellow-300">😐 Fair</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                        <RadioGroupItem value="poor" id="mood-poor" className="border-red-400 text-red-600" />
                        <Label htmlFor="mood-poor" className="text-xs text-red-700 dark:text-red-300">😔 Poor</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <Label className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                    <span className="mr-2">⚡</span> How would you rate your current stress level?
                  </Label>
                  <RadioGroup value={data.stress} onValueChange={(value) => updateData("stress", value)}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                        <RadioGroupItem value="low" id="stress-low" className="border-green-400 text-green-600" />
                        <Label htmlFor="stress-low" className="text-xs text-green-700 dark:text-green-300">😌 Low</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                        <RadioGroupItem value="moderate" id="stress-moderate" className="border-yellow-400 text-yellow-600" />
                        <Label htmlFor="stress-moderate" className="text-xs text-yellow-700 dark:text-yellow-300">😓 Moderate</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
                        <RadioGroupItem value="high" id="stress-high" className="border-orange-400 text-orange-600" />
                        <Label htmlFor="stress-high" className="text-xs text-orange-700 dark:text-orange-300">😰 High</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                        <RadioGroupItem value="very-high" id="stress-very-high" className="border-red-400 text-red-600" />
                        <Label htmlFor="stress-very-high" className="text-xs text-red-700 dark:text-red-300">😵 Very High</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <Label className="text-sm font-medium text-indigo-700 dark:text-indigo-300 flex items-center">
                    <span className="mr-2">💤</span> How has your sleep been?
                  </Label>
                  <RadioGroup value={data.sleep} onValueChange={(value) => updateData("sleep", value)}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                        <RadioGroupItem value="excellent" id="sleep-excellent" className="border-green-400 text-green-600" />
                        <Label htmlFor="sleep-excellent" className="text-xs text-green-700 dark:text-green-300">😴 Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                        <RadioGroupItem value="good" id="sleep-good" className="border-blue-400 text-blue-600" />
                        <Label htmlFor="sleep-good" className="text-xs text-blue-700 dark:text-blue-300">😌 Good</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                        <RadioGroupItem value="fair" id="sleep-fair" className="border-yellow-400 text-yellow-600" />
                        <Label htmlFor="sleep-fair" className="text-xs text-yellow-700 dark:text-yellow-300">😪 Fair</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                        <RadioGroupItem value="poor" id="sleep-poor" className="border-red-400 text-red-600" />
                        <Label htmlFor="sleep-poor" className="text-xs text-red-700 dark:text-red-300">😵‍💫 Poor</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 rounded-lg border border-pink-200 dark:border-pink-700">
                  <Label className="text-sm font-medium text-pink-700 dark:text-pink-300 flex items-center">
                    <span className="mr-2">🤝</span> Have you sought mental health support before?
                  </Label>
                  <RadioGroup value={data.previousHelp} onValueChange={(value) => updateData("previousHelp", value)}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                        <RadioGroupItem value="yes" id="help-yes" className="border-green-400 text-green-600" />
                        <Label htmlFor="help-yes" className="text-xs text-green-700 dark:text-green-300">✅ Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                        <RadioGroupItem value="no" id="help-no" className="border-blue-400 text-blue-600" />
                        <Label htmlFor="help-no" className="text-xs text-blue-700 dark:text-blue-300">❌ No</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700">
                        <RadioGroupItem value="prefer-not-to-say" id="help-prefer-not" className="border-gray-400 text-gray-600" />
                        <Label htmlFor="help-prefer-not" className="text-xs text-gray-700 dark:text-gray-300">🤐 Prefer not to say</Label>
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
        <div className="sticky bottom-0 -mx-2 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-3 pb-[env(safe-area-inset-bottom,12px)] bg-gradient-to-r from-white/95 to-purple-50/95 dark:from-slate-900/95 dark:to-purple-900/95 backdrop-blur-sm border-t border-purple-200 dark:border-purple-700 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-b-lg sm:rounded-b-xl">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            data-testid="button-previous"
            className="w-full sm:w-auto min-w-[100px] sm:min-w-[120px] h-10 sm:h-9 text-xs sm:text-sm border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext} data-testid="button-next" className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
              Next
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} data-testid="button-complete" className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg">
              Complete Setup
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}