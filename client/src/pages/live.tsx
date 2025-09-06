import { useState, useEffect } from "react";
import { Radio, Users, Calendar, Clock, Mic, Video, MessageSquare, Heart, Share2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useAppContext } from "@/context/AppContext";
import { BackButton } from "@/components/ui/back-button";

const liveStreams = [
  {
    id: 1,
    title: "Morning Mindfulness Session",
    host: "Dr. Priya Sharma",
    viewers: 234,
    status: "live",
    category: "Meditation",
    description: "Start your day with guided meditation and breathing exercises",
    startTime: "08:00 AM",
    thumbnail: "/api/placeholder/300/200",
    isAudio: false
  },
  {
    id: 2,
    title: "Study Together - Focus Hour",
    host: "StudyBuddy Community",
    viewers: 567,
    status: "live",
    category: "Study",
    description: "Virtual study room with ambient sounds and pomodoro breaks",
    startTime: "10:00 AM",
    thumbnail: "/api/placeholder/300/200",
    isAudio: true
  },
  {
    id: 3,
    title: "Mental Health Check-in",
    host: "Wellness Team",
    viewers: 89,
    status: "live",
    category: "Support",
    description: "Weekly community support session for mental wellness",
    startTime: "03:00 PM",
    thumbnail: "/api/placeholder/300/200",
    isAudio: false
  }
];

const upcomingStreams = [
  {
    id: 4,
    title: "Evening Yoga Flow",
    host: "Yoga Instructor Maya",
    scheduledTime: "06:00 PM",
    category: "Wellness",
    description: "Gentle yoga session to unwind after a busy day"
  },
  {
    id: 5,
    title: "Career Guidance Session",
    host: "Dr. Rajesh Kumar",
    scheduledTime: "07:30 PM",
    category: "Education",
    description: "Tips for managing career stress and academic pressure"
  }
];

export default function Live() {
  const { currentUser } = useAppContext();
  const [selectedStream, setSelectedStream] = useState(liveStreams[0]);
  const [chatMessage, setChatMessage] = useState("");
  const [volume, setVolume] = useState([75]);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Alex M.", message: "This is really helpful, thanks!", time: "2 mins ago" },
    { id: 2, user: "Priya S.", message: "Can you share the breathing technique again?", time: "3 mins ago" },
    { id: 3, user: "Raj K.", message: "Joining from Mumbai 👋", time: "5 mins ago" },
  ]);

  useEffect(() => {
    // Simulate connection status
    const timer = setTimeout(() => setIsConnected(true), 1000);
    return () => clearTimeout(timer);
  }, [selectedStream]);

  const handleSendMessage = () => {
    if (chatMessage.trim() && currentUser) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: `${currentUser.firstName} ${currentUser.lastName}`,
        message: chatMessage,
        time: "now"
      };
      setChatMessages([newMessage, ...chatMessages]);
      setChatMessage("");
    }
  };

  const handleJoinStream = (stream: any) => {
    setSelectedStream(stream);
    setIsConnected(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Radio className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Live Sessions</h1>
              <p className="text-muted-foreground">Join live mental health and wellness sessions</p>
            </div>
            <Badge variant="destructive" className="animate-pulse ml-auto">
              <Radio className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Video/Audio Player */}
          <div className="xl:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-0">
                {/* Video/Audio Player */}
                <div className="relative bg-black rounded-t-lg">
                  {selectedStream.isAudio ? (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Volume2 className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Audio Stream</h3>
                        <p className="text-muted-foreground">Listen to the live session</p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Video Stream</p>
                        {!isConnected && (
                          <div className="mt-4">
                            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-2 text-sm">Connecting...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Live indicator */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="animate-pulse">
                      <Radio className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  </div>
                  
                  {/* Viewer count */}
                  <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                    <Users className="h-4 w-4 inline mr-1" />
                    {selectedStream.viewers} watching
                  </div>
                </div>

                {/* Player Controls */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold" data-testid="text-stream-title">
                        {selectedStream.title}
                      </h2>
                      <p className="text-muted-foreground">Hosted by {selectedStream.host}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" data-testid="button-share-stream">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" data-testid="button-like-stream">
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{selectedStream.description}</p>
                  
                  {/* Volume Control */}
                  <div className="flex items-center gap-4">
                    <Volume2 className="h-4 w-4" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1 max-w-32"
                    />
                    <span className="text-sm text-muted-foreground w-10">{volume[0]}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Live Streams */}
            <Card>
              <CardHeader>
                <CardTitle>Other Live Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveStreams
                    .filter(stream => stream.id !== selectedStream.id)
                    .map((stream) => (
                    <Card 
                      key={stream.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-red-500"
                      onClick={() => handleJoinStream(stream)}
                      data-testid={`card-stream-${stream.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">{stream.category}</Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {stream.viewers}
                          </div>
                        </div>
                        <h3 className="font-semibold mb-1">{stream.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{stream.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{stream.host}</span>
                          <Badge variant="destructive" className="text-xs">LIVE</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="xl:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-3 pb-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs">{msg.user}</span>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-foreground">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Chat Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      data-testid="input-chat-message"
                    />
                    <Button onClick={handleSendMessage} size="sm" data-testid="button-send-message">
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Streams */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingStreams.map((stream) => (
                    <div key={stream.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{stream.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stream.scheduledTime}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{stream.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{stream.description}</p>
                      <p className="text-xs font-medium">{stream.host}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}