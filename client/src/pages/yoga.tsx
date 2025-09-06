import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Timer, Heart, Zap, Moon, Sun } from "lucide-react";

interface YogaPose {
  id: string;
  name: string;
  duration: number;
  description: string;
  benefits: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
}

interface YogaSession {
  id: string;
  name: string;
  description: string;
  duration: number;
  poses: YogaPose[];
  type: 'morning' | 'evening' | 'stress-relief' | 'energy-boost';
}

const yogaPoses: YogaPose[] = [
  {
    id: "mountain-pose",
    name: "Mountain Pose (Tadasana)",
    duration: 60,
    description: "A foundational standing pose that improves posture and balance",
    benefits: ["Improves posture", "Increases awareness", "Strengthens thighs", "Reduces anxiety"],
    difficulty: "Beginner",
    instructions: [
      "Stand with feet hip-width apart",
      "Ground down through all four corners of your feet",
      "Engage your leg muscles and lengthen your spine",
      "Relax your shoulders away from your ears",
      "Breathe deeply and hold"
    ]
  },
  {
    id: "child-pose",
    name: "Child's Pose (Balasana)",
    duration: 90,
    description: "A resting pose that calms the mind and relieves stress",
    benefits: ["Relieves stress", "Calms the mind", "Stretches hips", "Reduces anxiety"],
    difficulty: "Beginner",
    instructions: [
      "Kneel on the floor with big toes touching",
      "Separate your knees about hip-width apart",
      "Fold forward, extending your arms in front",
      "Rest your forehead on the ground",
      "Breathe deeply and relax"
    ]
  },
  {
    id: "cat-cow",
    name: "Cat-Cow Pose",
    duration: 120,
    description: "A gentle flow that warms up the spine and relieves tension",
    benefits: ["Improves spine flexibility", "Relieves back tension", "Massages organs", "Improves coordination"],
    difficulty: "Beginner",
    instructions: [
      "Start on hands and knees in tabletop position",
      "Inhale, arch your back and look up (Cow)",
      "Exhale, round your spine and tuck chin (Cat)",
      "Continue flowing between these positions",
      "Move with your breath"
    ]
  },
  {
    id: "warrior-one",
    name: "Warrior I (Virabhadrasana I)",
    duration: 60,
    description: "A powerful standing pose that builds strength and confidence",
    benefits: ["Strengthens legs", "Improves balance", "Opens hips", "Builds confidence"],
    difficulty: "Intermediate",
    instructions: [
      "Step your left foot back about 3-4 feet",
      "Turn your left foot out 45 degrees",
      "Bend your right knee over your ankle",
      "Raise your arms overhead",
      "Hold and repeat on other side"
    ]
  },
  {
    id: "tree-pose",
    name: "Tree Pose (Vrikshasana)",
    duration: 60,
    description: "A balancing pose that improves focus and stability",
    benefits: ["Improves balance", "Strengthens legs", "Enhances focus", "Calms the mind"],
    difficulty: "Intermediate",
    instructions: [
      "Stand in Mountain Pose",
      "Shift weight to your left foot",
      "Place right foot on inner left thigh or calf",
      "Avoid placing foot directly on the knee",
      "Bring palms together at heart center"
    ]
  },
  {
    id: "downward-dog",
    name: "Downward-Facing Dog (Adho Mukha Svanasana)",
    duration: 90,
    description: "An energizing pose that stretches the entire body",
    benefits: ["Strengthens arms", "Stretches hamstrings", "Energizes body", "Improves circulation"],
    difficulty: "Intermediate",
    instructions: [
      "Start in tabletop position",
      "Tuck your toes under",
      "Lift your hips up and back",
      "Straighten your legs as much as possible",
      "Press hands firmly into the ground"
    ]
  }
];

const yogaSessions: YogaSession[] = [
  {
    id: "morning-energy",
    name: "Morning Energy Flow",
    description: "A gentle sequence to energize your body and mind for the day ahead",
    duration: 15,
    type: "morning",
    poses: [
      yogaPoses.find(p => p.id === "mountain-pose")!,
      yogaPoses.find(p => p.id === "cat-cow")!,
      yogaPoses.find(p => p.id === "downward-dog")!,
      yogaPoses.find(p => p.id === "warrior-one")!,
      yogaPoses.find(p => p.id === "tree-pose")!
    ]
  },
  {
    id: "evening-relaxation",
    name: "Evening Relaxation",
    description: "A calming sequence to help you unwind and prepare for restful sleep",
    duration: 12,
    type: "evening",
    poses: [
      yogaPoses.find(p => p.id === "mountain-pose")!,
      yogaPoses.find(p => p.id === "cat-cow")!,
      yogaPoses.find(p => p.id === "child-pose")!
    ]
  },
  {
    id: "stress-relief",
    name: "Stress Relief",
    description: "A therapeutic sequence designed to release tension and calm anxiety",
    duration: 10,
    type: "stress-relief",
    poses: [
      yogaPoses.find(p => p.id === "child-pose")!,
      yogaPoses.find(p => p.id === "cat-cow")!,
      yogaPoses.find(p => p.id === "mountain-pose")!
    ]
  },
  {
    id: "quick-boost",
    name: "Quick Energy Boost",
    description: "A short energizing sequence for when you need a mental pick-me-up",
    duration: 8,
    type: "energy-boost",
    poses: [
      yogaPoses.find(p => p.id === "mountain-pose")!,
      yogaPoses.find(p => p.id === "warrior-one")!,
      yogaPoses.find(p => p.id === "tree-pose")!
    ]
  }
];

export default function YogaPage() {
  const [activeSession, setActiveSession] = useState<YogaSession | null>(null);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const startSession = (session: YogaSession) => {
    setActiveSession(session);
    setCurrentPoseIndex(0);
    setTimeRemaining(session.poses[0].duration);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setActiveSession(null);
    setCurrentPoseIndex(0);
    setIsPlaying(false);
    setTimeRemaining(0);
  };

  const nextPose = () => {
    if (activeSession && currentPoseIndex < activeSession.poses.length - 1) {
      const newIndex = currentPoseIndex + 1;
      setCurrentPoseIndex(newIndex);
      setTimeRemaining(activeSession.poses[newIndex].duration);
      setIsPlaying(false);
    }
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'morning': return <Sun className="h-4 w-4" />;
      case 'evening': return <Moon className="h-4 w-4" />;
      case 'stress-relief': return <Heart className="h-4 w-4" />;
      case 'energy-boost': return <Zap className="h-4 w-4" />;
      default: return <Timer className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (activeSession) {
    const currentPose = activeSession.poses[currentPoseIndex];
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-primary">{activeSession.name}</h1>
            <Button variant="outline" onClick={resetSession} data-testid="button-reset-session">
              <RotateCcw className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Pose {currentPoseIndex + 1} of {activeSession.poses.length}</span>
            <span>•</span>
            <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining</span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{currentPose.name}</CardTitle>
                <CardDescription>{currentPose.description}</CardDescription>
              </div>
              <Badge className={getDifficultyColor(currentPose.difficulty)}>
                {currentPose.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Instructions</h3>
                <ol className="space-y-2">
                  {currentPose.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {currentPose.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t">
              <Button onClick={togglePlay} size="lg" data-testid="button-toggle-play">
                {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                {isPlaying ? 'Pause' : 'Start'}
              </Button>
              {currentPoseIndex < activeSession.poses.length - 1 && (
                <Button variant="outline" onClick={nextPose} data-testid="button-next-pose">
                  Next Pose
                </Button>
              )}
              {currentPoseIndex === activeSession.poses.length - 1 && (
                <Button variant="outline" onClick={resetSession} data-testid="button-complete-session">
                  Complete Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Yoga & Mindfulness</h1>
        <p className="text-lg text-muted-foreground">
          Find peace and balance with guided yoga sessions designed for mental wellness
        </p>
      </div>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sessions" data-testid="tab-sessions">Guided Sessions</TabsTrigger>
          <TabsTrigger value="poses" data-testid="tab-poses">Individual Poses</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {yogaSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSessionIcon(session.type)}
                      <CardTitle className="text-xl">{session.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {session.duration} min
                    </Badge>
                  </div>
                  <CardDescription>{session.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Includes {session.poses.length} poses:</h4>
                      <div className="flex flex-wrap gap-1">
                        {session.poses.map((pose, index) => (
                          <Badge key={pose.id} variant="outline" className="text-xs">
                            {pose.name.split('(')[0].trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => startSession(session)}
                      data-testid={`button-start-${session.id}`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="poses" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yogaPoses.map((pose) => (
              <Card key={pose.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pose.name}</CardTitle>
                    <Badge className={getDifficultyColor(pose.difficulty)}>
                      {pose.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{pose.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                      <ul className="space-y-1">
                        {pose.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Timer className="h-4 w-4 mr-1" />
                        {pose.duration}s hold
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 bg-wellness/10 dark:bg-wellness/5 border-wellness/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Heart className="h-12 w-12 text-wellness mx-auto" />
            <h3 className="text-xl font-semibold text-wellness">Mindful Practice Tips</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Listen to Your Body</h4>
                <p className="text-muted-foreground">Never force a pose. Move slowly and respect your limits.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Focus on Breathing</h4>
                <p className="text-muted-foreground">Deep, controlled breathing enhances the benefits of each pose.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Be Consistent</h4>
                <p className="text-muted-foreground">Regular practice, even just 10 minutes daily, creates lasting benefits.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}