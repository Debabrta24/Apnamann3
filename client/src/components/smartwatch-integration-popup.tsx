import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Watch, Heart, Activity, Zap, Wifi, CheckCircle } from "lucide-react";

interface SmartWatchDevice {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  supported: boolean;
}

const smartWatchDevices: SmartWatchDevice[] = [
  {
    id: "apple-watch",
    name: "Apple Watch",
    description: "Monitor heart rate, activity, and wellness metrics",
    icon: "⌚",
    features: ["Heart Rate", "Activity Tracking", "Sleep Monitoring", "Stress Detection"],
    supported: true
  },
  {
    id: "fitbit",
    name: "Fitbit",
    description: "Track fitness goals and health insights",
    icon: "⌚",
    features: ["Step Counting", "Heart Rate", "Sleep Quality", "Exercise Tracking"],
    supported: true
  },
  {
    id: "samsung-galaxy-watch",
    name: "Samsung Galaxy Watch",
    description: "Comprehensive health and fitness tracking",
    icon: "⌚",
    features: ["Health Monitoring", "Fitness Tracking", "Sleep Analysis", "Stress Management"],
    supported: true
  },
  {
    id: "garmin",
    name: "Garmin",
    description: "Advanced sports and health metrics",
    icon: "⌚", 
    features: ["Advanced Metrics", "GPS Tracking", "Health Monitoring", "Recovery Analysis"],
    supported: false
  }
];

interface SmartWatchIntegrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartWatchIntegrationPopup({ isOpen, onClose }: SmartWatchIntegrationPopupProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [step, setStep] = useState<'selection' | 'connecting' | 'connected'>('selection');

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
  };

  const handleConnect = () => {
    if (!selectedDevice) return;
    
    const device = smartWatchDevices.find(d => d.id === selectedDevice);
    if (!device?.supported) {
      // Show coming soon message
      return;
    }

    setStep('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setStep('connected');
    }, 2000);
  };

  const handleFinish = () => {
    setStep('selection');
    setSelectedDevice(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-bold flex items-center justify-center gap-2">
            <Watch className="h-6 w-6 text-primary" />
            Smart Watch Integration
          </DialogTitle>
          <DialogDescription className="text-sm mt-2">
            Connect your wearable device to track health metrics and enhance your wellness journey
          </DialogDescription>
        </DialogHeader>

        {step === 'selection' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {smartWatchDevices.map((device) => (
                <Card
                  key={device.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
                    selectedDevice === device.id
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/50"
                  } ${!device.supported ? "opacity-60" : ""}`}
                  onClick={() => device.supported && handleDeviceSelect(device.id)}
                  data-testid={`card-device-${device.id}`}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="text-3xl mb-2" data-testid={`emoji-device-${device.id}`}>
                      {device.icon}
                    </div>
                    <CardTitle className="text-lg flex items-center justify-center gap-2">
                      {device.name}
                      {selectedDevice === device.id && (
                        <CheckCircle className="h-5 w-5 text-primary" data-testid={`check-device-${device.id}`} />
                      )}
                      {!device.supported && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                          Coming Soon
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center text-sm mb-3">
                      {device.description}
                    </CardDescription>
                    <div className="space-y-1">
                      {device.features.slice(0, 3).map((feature, index) => (
                        <div key={feature} className="flex items-center gap-2 text-xs">
                          <Activity className="h-3 w-3 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={onClose}
                data-testid="button-cancel-integration"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleConnect}
                disabled={!selectedDevice || !smartWatchDevices.find(d => d.id === selectedDevice)?.supported}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-connect-device"
              >
                {selectedDevice ? "Connect Device" : "Select a Device"}
              </Button>
            </div>
          </>
        )}

        {step === 'connecting' && (
          <div className="text-center py-8">
            <div className="mb-4">
              <Wifi className="h-12 w-12 text-primary mx-auto animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connecting to your device...</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please follow the authentication steps on your {smartWatchDevices.find(d => d.id === selectedDevice)?.name}
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        )}

        {step === 'connected' && (
          <div className="text-center py-8">
            <div className="mb-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Successfully Connected!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your {smartWatchDevices.find(d => d.id === selectedDevice)?.name} is now integrated with ApnaMann. 
              We'll start collecting your health metrics to provide personalized wellness insights.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Heart Rate</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span>Activity</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Energy</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleFinish}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8"
              data-testid="button-finish-integration"
            >
              Start Tracking
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}