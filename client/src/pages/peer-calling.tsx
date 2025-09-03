import { useState, useEffect, useRef } from "react";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users,
  Heart,
  Clock,
  MessageCircle,
  Settings,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PeerUser {
  id: string;
  firstName: string;
  lastName: string;
  institution: string;
  year: number;
  anxietyLevel: "mild" | "moderate" | "high";
  isOnline: boolean;
  matchScore: number;
  languages: string[];
  interests: string[];
  lastOnline: string;
}

interface CallSession {
  id: string;
  partnerId: string;
  partnerName: string;
  status: "waiting" | "connecting" | "active" | "ended";
  startTime: string;
  duration?: number;
  type: "audio" | "video";
}

export default function PeerCalling() {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch available peers
  const { data: availablePeers = [], isLoading: isLoadingPeers } = useQuery<PeerUser[]>({
    queryKey: ["/api/peer-calling/available-peers", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  // Fetch call history
  const { data: callHistory = [] } = useQuery<any[]>({
    queryKey: ["/api/peer-calling/history", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  // Find peer match mutation
  const findPeerMutation = useMutation({
    mutationFn: async (preferences: { type: "audio" | "video"; anxietyLevel?: string }) => {
      return await apiRequest("POST", "/api/peer-calling/find-peer", {
        userId: currentUser?.id,
        ...preferences,
      });
    },
    onSuccess: (data: any) => {
      setActiveCall({
        id: data.sessionId || 'fake-session-' + Date.now(),
        partnerId: data.partnerId || 'peer-' + Date.now(),
        partnerName: data.partnerName || 'Anonymous Student',
        status: "connecting",
        startTime: new Date().toISOString(),
        type: isVideoEnabled ? "video" : "audio",
      });
      toast({
        title: "Found a peer!",
        description: `Connecting with ${data.partnerName || 'Anonymous Student'}...`,
      });
    },
    onError: () => {
      toast({
        title: "No peers available",
        description: "Try again in a few minutes or adjust your preferences",
        variant: "destructive",
      });
    },
  });

  // End call mutation
  const endCallMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await apiRequest("POST", `/api/peer-calling/end-call/${sessionId}`, {});
    },
    onSuccess: () => {
      setActiveCall(null);
      setCallDuration(0);
      setWaitingTime(0);
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
      }
      toast({
        title: "Call ended",
        description: "Thank you for supporting each other!",
      });
    },
  });

  // Handle call duration tracking
  useEffect(() => {
    if (activeCall?.status === "active") {
      callIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else if (activeCall?.status === "connecting") {
      callIntervalRef.current = setInterval(() => {
        setWaitingTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
      }
    };
  }, [activeCall?.status]);

  // Simulate call connection after waiting
  useEffect(() => {
    if (activeCall?.status === "connecting" && waitingTime >= 3) {
      setActiveCall(prev => prev ? { ...prev, status: "active" } : null);
      setWaitingTime(0);
      toast({
        title: "Connected!",
        description: "You're now connected with your peer. Be kind and supportive!",
      });
    }
  }, [activeCall?.status, waitingTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startCall = (type: "audio" | "video") => {
    setIsVideoEnabled(type === "video");
    findPeerMutation.mutate({ type });
  };

  const endCall = () => {
    if (activeCall) {
      endCallMutation.mutate(activeCall.id);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  if (activeCall) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Call Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {activeCall.status === "connecting" ? "Connecting..." : activeCall.partnerName}
                    </h2>
                    <p className="text-muted-foreground">
                      {activeCall.status === "connecting" ? "Finding your peer..." : "1:1 Peer Support Call"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono">
                    {activeCall.status === "connecting" 
                      ? formatDuration(waitingTime) 
                      : formatDuration(callDuration)
                    }
                  </div>
                  <Badge variant={activeCall.status === "active" ? "default" : "secondary"}>
                    {activeCall.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Video/Audio Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Local Video */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
                  {isVideoEnabled ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover rounded-lg"
                      autoPlay
                      muted
                      playsInline
                    />
                  ) : (
                    <div className="text-center">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Audio Only</p>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">You</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remote Video */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
                  {activeCall.status === "connecting" ? (
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Connecting...</p>
                    </div>
                  ) : isVideoEnabled ? (
                    <video
                      ref={remoteVideoRef}
                      className="w-full h-full object-cover rounded-lg"
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div className="text-center">
                      <Heart className="h-16 w-16 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{activeCall.partnerName}</p>
                    </div>
                  )}
                  {activeCall.status === "active" && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="default">{activeCall.partnerName}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant={isAudioEnabled ? "default" : "destructive"}
                  size="lg"
                  className="w-12 h-12 rounded-full p-0"
                  onClick={toggleAudio}
                  data-testid="button-toggle-audio"
                >
                  {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </Button>

                <Button
                  variant={isVideoEnabled ? "default" : "secondary"}
                  size="lg"
                  className="w-12 h-12 rounded-full p-0"
                  onClick={toggleVideo}
                  data-testid="button-toggle-video"
                >
                  {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  className="w-16 h-16 rounded-full p-0"
                  onClick={endCall}
                  data-testid="button-end-call"
                >
                  <PhoneOff className="h-8 w-8" />
                </Button>
              </div>
              
              {activeCall.status === "active" && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Remember: This is a safe space for mutual support. Be kind, listen actively, and respect boundaries.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Peer Support Calling</h1>
        <p className="text-muted-foreground">
          Connect 1:1 with fellow students for mutual anxiety support and understanding
        </p>
      </div>

      <Tabs defaultValue="start-call" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="start-call" data-testid="tab-start-call">Start Call</TabsTrigger>
          <TabsTrigger value="available-peers" data-testid="tab-available-peers">Available Peers</TabsTrigger>
          <TabsTrigger value="call-history" data-testid="tab-call-history">Call History</TabsTrigger>
        </TabsList>

        <TabsContent value="start-call" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Call Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Quick Connect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full h-16 text-lg"
                  onClick={() => startCall("audio")}
                  disabled={findPeerMutation.isPending}
                  data-testid="button-start-audio-call"
                >
                  <Mic className="h-6 w-6 mr-3" />
                  Audio Call
                  <ChevronRight className="h-5 w-5 ml-3" />
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full h-16 text-lg"
                  onClick={() => startCall("video")}
                  disabled={findPeerMutation.isPending}
                  data-testid="button-start-video-call"
                >
                  <Video className="h-6 w-6 mr-3" />
                  Video Call
                  <ChevronRight className="h-5 w-5 ml-3" />
                </Button>

                <p className="text-sm text-muted-foreground">
                  We'll match you with a peer based on your anxiety level and preferences
                </p>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Support Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p className="text-sm">Listen actively and without judgment</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p className="text-sm">Share your experiences respectfully</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p className="text-sm">Respect privacy and boundaries</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p className="text-sm">End the call if you feel uncomfortable</p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Remember:</strong> This is peer support, not professional therapy. 
                    For crisis situations, use our emergency resources.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{availablePeers.length}</div>
                <p className="text-sm text-muted-foreground">Peers Online</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{Array.isArray(callHistory) ? callHistory.length : 0}</div>
                <p className="text-sm text-muted-foreground">Total Calls</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">~3 min</div>
                <p className="text-sm text-muted-foreground">Avg Wait Time</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="available-peers" className="space-y-4">
          {isLoadingPeers ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p>Loading available peers...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePeers.map((peer) => (
                <Card key={peer.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-sm font-medium">
                            {peer.firstName[0]}{peer.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{peer.firstName}</p>
                          <p className="text-xs text-muted-foreground">{peer.institution}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Match Score</span>
                        <span className="font-medium">{peer.matchScore}%</span>
                      </div>
                      <Progress value={peer.matchScore} className="h-1" />
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        Year {peer.year}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {peer.anxietyLevel} anxiety
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="call-history" className="space-y-4">
          {!Array.isArray(callHistory) || callHistory.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No calls yet. Start your first peer support call!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Array.isArray(callHistory) && callHistory.map((call: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Anonymous Peer</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(call.date).toLocaleDateString()} • {call.duration} minutes
                          </p>
                        </div>
                      </div>
                      <Badge variant={call.type === "video" ? "default" : "secondary"}>
                        {call.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}