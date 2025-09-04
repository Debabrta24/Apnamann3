import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ambientMusic } from "@/lib/ambient-music";
import { musicAPI, Track } from "@/lib/music-api";
import { useQuery } from "@tanstack/react-query";

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

const categories = ["All", "Meditation", "Relaxation", "Nature", "Sleep", "Focus", "Music"];

export default function Music() {
  const [currentTrack, setCurrentTrack] = useState(musicTracks[0]);
  const [currentApiTrack, setCurrentApiTrack] = useState<Track | null>(null);
  const [currentTrackType, setCurrentTrackType] = useState<'ambient' | 'api'>('ambient');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedTracks, setLikedTracks] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch popular tracks for Music category
  const { data: popularTracks = [], isLoading: loadingPopular } = useQuery({
    queryKey: ['/music/popular'],
    queryFn: () => musicAPI.getTracksByMood('relaxing'),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    enabled: selectedCategory === "Music"
  });

  // Search tracks based on query
  const { data: searchResults = [], isLoading: loadingSearch } = useQuery({
    queryKey: ['/music/search', searchQuery],
    queryFn: () => musicAPI.searchTracks(searchQuery),
    enabled: searchQuery.length > 2 && selectedCategory === "Music",
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });

  const ambientTracks = selectedCategory === "All" 
    ? musicTracks 
    : musicTracks.filter(track => track.category === selectedCategory);

  const apiTracks = selectedCategory === "Music" 
    ? (searchQuery ? searchResults : popularTracks)
    : [];

  const allTracks = selectedCategory === "Music" ? apiTracks : ambientTracks;

  const playAmbientTrack = async (track: any) => {
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

  const playApiTrack = (track: Track) => {
    if (audioRef.current && track.preview_url) {
      audioRef.current.src = track.preview_url;
      audioRef.current.play();
    }
  };

  const selectTrack = (track: any, type: 'ambient' | 'api') => {
    if (isPlaying) {
      ambientMusic.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
    
    if (type === 'ambient') {
      setCurrentTrack(track);
      setCurrentTrackType('ambient');
    } else {
      setCurrentApiTrack(track);
      setCurrentTrackType('api');
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      ambientMusic.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (currentTrackType === 'ambient') {
        await playAmbientTrack(currentTrack);
      } else if (currentApiTrack) {
        playApiTrack(currentApiTrack);
      }
      setIsPlaying(true);
    }
  };

  const skipToNext = async () => {
    if (currentTrackType === 'ambient') {
      const currentIndex = ambientTracks.findIndex((track: any) => track.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % ambientTracks.length;
      const nextTrack = ambientTracks[nextIndex];
      
      if (isPlaying) {
        ambientMusic.stop();
        await playAmbientTrack(nextTrack);
      }
      setCurrentTrack(nextTrack);
    } else if (currentApiTrack && apiTracks.length > 0) {
      const currentIndex = apiTracks.findIndex((track: Track) => track.id === currentApiTrack.id);
      const nextIndex = (currentIndex + 1) % apiTracks.length;
      const nextTrack = apiTracks[nextIndex];
      
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentApiTrack(nextTrack);
      if (isPlaying) {
        playApiTrack(nextTrack);
      }
    }
  };

  const skipToPrevious = async () => {
    if (currentTrackType === 'ambient') {
      const currentIndex = ambientTracks.findIndex((track: any) => track.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? ambientTracks.length - 1 : currentIndex - 1;
      const prevTrack = ambientTracks[prevIndex];
      
      if (isPlaying) {
        ambientMusic.stop();
        await playAmbientTrack(prevTrack);
      }
      setCurrentTrack(prevTrack);
    } else if (currentApiTrack && apiTracks.length > 0) {
      const currentIndex = apiTracks.findIndex((track: Track) => track.id === currentApiTrack.id);
      const prevIndex = currentIndex === 0 ? apiTracks.length - 1 : currentIndex - 1;
      const prevTrack = apiTracks[prevIndex];
      
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentApiTrack(prevTrack);
      if (isPlaying) {
        playApiTrack(prevTrack);
      }
    }
  };

  const toggleLike = (trackId: number) => {
    setLikedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  // Audio event handlers
  const handleApiTrackPlay = () => setIsPlaying(true);
  const handleApiTrackPause = () => setIsPlaying(false);
  const handleApiTrackEnded = () => setIsPlaying(false);
  const handleApiTrackTimeUpdate = (e: any) => setCurrentTime(e.target.currentTime);
  const handleApiTrackLoadedMetadata = (e: any) => setDuration(e.target.duration);

  // Update volume for API tracks
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

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
                {currentTrackType === 'api' ? currentApiTrack?.title : currentTrack.title} - {currentTrackType === 'api' ? currentApiTrack?.artist : currentTrack.artist}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8">
                <div className="text-center space-y-2">
                  <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden">
                    {currentTrackType === 'api' && currentApiTrack?.cover_art ? (
                      <img 
                        src={currentApiTrack.cover_art} 
                        alt="Album Cover" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                        ♪
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {currentTrackType === 'api' ? currentApiTrack?.title : currentTrack.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {currentTrackType === 'api' ? currentApiTrack?.artist : currentTrack.artist}
                    </p>
                    {currentTrackType === 'ambient' && (
                      <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
                    )}
                    {currentTrackType === 'api' && currentApiTrack?.album && (
                      <p className="text-sm text-muted-foreground">{currentApiTrack.album}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={(currentTime / duration) * 100} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>
                    {currentTrackType === 'api' ? formatTime(duration) : (isPlaying ? 'Playing...' : 'Stopped')}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button variant="outline" size="sm" onClick={skipToPrevious}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button onClick={togglePlay} size="lg" data-testid="button-play-pause">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button variant="outline" size="sm" onClick={skipToNext}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const trackId = currentTrackType === 'api' ? parseInt(currentApiTrack?.id || '0') : currentTrack.id;
                    toggleLike(trackId);
                  }}
                >
                  <Heart className={`h-4 w-4 ${
                    currentTrackType === 'api' 
                      ? (currentApiTrack && likedTracks.includes(parseInt(currentApiTrack.id))) 
                      : likedTracks.includes(currentTrack.id)
                  } ? 'fill-current text-red-500' : ''`} />
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
                  data-testid="slider-volume"
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

              {/* Search Input for Music */}
              {selectedCategory === "Music" && (
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search for music tracks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-music-search"
                    />
                  </div>
                  {loadingSearch && (
                    <div className="flex items-center justify-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Track List */}
              <div className="space-y-2">
                {selectedCategory === "Music" && loadingPopular && !searchQuery && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading popular tracks...</span>
                  </div>
                )}
                
                {allTracks.map((track: any) => {
                  const isApiTrack = selectedCategory === "Music";
                  const trackId = isApiTrack ? parseInt(track.id) : track.id;
                  const isCurrentTrack = isApiTrack 
                    ? currentApiTrack?.id === track.id
                    : currentTrack.id === track.id;
                  
                  return (
                    <div
                      key={track.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isCurrentTrack
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => selectTrack(track, isApiTrack ? 'api' : 'ambient')}
                      data-testid={`track-${track.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded overflow-hidden">
                          {isApiTrack && track.cover_art ? (
                            <img 
                              src={track.cover_art} 
                              alt="Album Cover" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg">
                              ♪
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{track.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {track.artist} • {track.duration}
                            {isApiTrack && track.album && ` • ${track.album}`}
                          </p>
                          {!isApiTrack && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {track.category}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(trackId);
                          }}
                          data-testid={`button-like-${track.id}`}
                        >
                          <Heart className={`h-4 w-4 ${likedTracks.includes(trackId) ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {selectedCategory === "Music" && allTracks.length === 0 && !loadingSearch && !loadingPopular && (
                  <div className="text-center p-4 text-muted-foreground">
                    {searchQuery ? 'No tracks found. Try a different search.' : 'No popular tracks available.'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Hidden audio player for API tracks */}
      <audio 
        ref={audioRef}
        onPlay={handleApiTrackPlay}
        onPause={handleApiTrackPause}
        onEnded={handleApiTrackEnded}
        onTimeUpdate={handleApiTrackTimeUpdate}
        onLoadedMetadata={handleApiTrackLoadedMetadata}
        style={{ display: 'none' }}
      />
    </div>
  );
}