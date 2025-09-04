import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ambientMusic } from "@/lib/ambient-music";

const musicTracks = [
  {
    id: 1,
    title: "Peaceful Meditation",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Meditation",
    type: "meditation",
    description: "Gentle meditation tones to start your day peacefully"
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Relaxation",
    type: "ocean",
    description: "Soothing ocean waves for deep relaxation"
  },
  {
    id: 3,
    title: "Forest Ambience",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Nature",
    type: "forest",
    description: "Peaceful forest sounds to reduce stress"
  },
  {
    id: 4,
    title: "Gentle Rain",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Sleep",
    type: "rain",
    description: "Soft rainfall sounds for better sleep"
  },
  {
    id: 5,
    title: "Focus Sounds",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Focus",
    type: "focus",
    description: "Clear focus sounds for better concentration"
  }
];

const categories = ["All", "Meditation", "Relaxation", "Nature", "Sleep", "Focus"];

export default function Music() {
  const [currentTrack, setCurrentTrack] = useState(musicTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedTracks, setLikedTracks] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const filteredTracks = selectedCategory === "All" 
    ? musicTracks 
    : musicTracks.filter(track => track.category === selectedCategory);

  const playTrack = async (track: any) => {
    const trackType = track.type as string;
    switch (trackType) {
      case 'meditation':
        await ambientMusic.playMeditation();
        break;
      case 'ocean':
        await ambientMusic.playOceanWaves();
        break;
      case 'forest':
        await ambientMusic.playForest();
        break;
      case 'rain':
        await ambientMusic.playRainfall();
        break;
      case 'focus':
        await ambientMusic.playFocus();
        break;
      default:
        await ambientMusic.playMeditation();
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      ambientMusic.stop();
      setIsPlaying(false);
    } else {
      await playTrack(currentTrack);
      setIsPlaying(true);
    }
  };

  const skipToNext = async () => {
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    const nextTrack = filteredTracks[nextIndex];
    
    if (isPlaying) {
      ambientMusic.stop();
      await playTrack(nextTrack);
    }
    setCurrentTrack(nextTrack);
  };

  const skipToPrevious = async () => {
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1;
    const prevTrack = filteredTracks[prevIndex];
    
    if (isPlaying) {
      ambientMusic.stop();
      await playTrack(prevTrack);
    }
    setCurrentTrack(prevTrack);
  };

  const toggleLike = (trackId: number) => {
    setLikedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mind Fresh Music</h1>
        <p className="text-muted-foreground">Relaxing music and nature sounds for mental wellness</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Player */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Now Playing</CardTitle>
              <CardDescription>
                {currentTrack.title} - {currentTrack.artist}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{currentTrack.title}</h3>
                  <p className="text-muted-foreground mb-4">{currentTrack.artist}</p>
                  <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={(currentTime / duration) * 100} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{isPlaying ? 'Playing...' : 'Stopped'}</span>
                  <span>{currentTrack.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button variant="outline" size="sm" onClick={skipToPrevious}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button onClick={togglePlay} size="lg">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button variant="outline" size="sm" onClick={skipToNext}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleLike(currentTrack.id)}
                >
                  <Heart className={`h-4 w-4 ${likedTracks.includes(currentTrack.id) ? 'fill-current text-red-500' : ''}`} />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Playlist Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Music Library</CardTitle>
              <CardDescription>Choose your relaxation soundtrack</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      data-testid={`filter-${category.toLowerCase()}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Track List */}
              <div className="space-y-2">
                {filteredTracks.map((track) => (
                  <div
                    key={track.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentTrack.id === track.id
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      if (isPlaying) {
                        ambientMusic.stop();
                        setIsPlaying(false);
                      }
                      setCurrentTrack(track);
                    }}
                    data-testid={`track-${track.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{track.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {track.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{track.duration}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${likedTracks.includes(track.id) ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}