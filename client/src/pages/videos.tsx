import { useState } from "react";
import { Play, Clock, Eye, Heart, Filter, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BackButton } from "@/components/ui/back-button";

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: number;
  category: 'Motivation' | 'Mindfulness' | 'Success' | 'Wellness' | 'Inspiration' | 'Comedy';
  thumbnailUrl: string;
  videoUrl: string;
  speaker: string;
  tags: string[];
}

const motivationalVideos: Video[] = [
  {
    id: "1",
    title: "The Power of Positive Thinking",
    description: "Learn how to transform your mindset and overcome negative thoughts with practical techniques.",
    duration: "12:45",
    views: 15420,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/27LIATkhqAU/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/27LIATkhqAU",
    speaker: "Dr. Sarah Johnson",
    tags: ["mindset", "positivity", "mental health"]
  },
  {
    id: "2",
    title: "Never Give Up - Motivational Speech",
    description: "Powerful motivational speech about perseverance and never giving up on your dreams.",
    duration: "15:20",
    views: 31200,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/EP8VVr4fIj4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/EP8VVr4fIj4",
    speaker: "Motivational Speaker",
    tags: ["motivation", "perseverance", "success"]
  },
  {
    id: "3",
    title: "Believe in Yourself - Life Changing Speech",
    description: "Inspiring speech about self-belief and achieving your goals against all odds.",
    duration: "18:40",
    views: 42300,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/9j0eUI4h1SE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/9j0eUI4h1SE",
    speaker: "Life Coach",
    tags: ["motivation", "self-belief", "goals"]
  },
  {
    id: "4",
    title: "Success Mindset - You Can Do It",
    description: "Powerful motivational content to develop a winning mindset and achieve your goals.",
    duration: "14:30",
    views: 25600,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/1QRriWmCAsc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/1QRriWmCAsc",
    speaker: "Success Coach",
    tags: ["motivation", "mindset", "achievement"]
  },
  {
    id: "5",
    title: "Overcome Your Fears - Motivational Video",
    description: "Inspiring speech about facing your fears and stepping out of your comfort zone.",
    duration: "16:45",
    views: 38200,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/ZfPISsIIKQw/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/ZfPISsIIKQw",
    speaker: "Fear Coach",
    tags: ["motivation", "fear", "courage"]
  },
  {
    id: "6",
    title: "Rise Above Challenges",
    description: "Motivational video about resilience and rising above life's challenges.",
    duration: "12:15",
    views: 29800,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/wu0n7kWYIY4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/wu0n7kWYIY4",
    speaker: "Life Mentor",
    tags: ["motivation", "resilience", "challenges"]
  },
  {
    id: "7",
    title: "Dream Big - Motivational Message",
    description: "Inspirational content about setting big goals and pursuing your dreams.",
    duration: "11:30",
    views: 35400,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/VJz_cM0Jg-Y/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/VJz_cM0Jg-Y",
    speaker: "Dream Coach",
    tags: ["motivation", "dreams", "goals"]
  },
  {
    id: "8",
    title: "Unstoppable You",
    description: "Powerful motivational speech about becoming unstoppable in life.",
    duration: "13:20",
    views: 42100,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/C7SmkXyeHVI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/C7SmkXyeHVI",
    speaker: "Power Coach",
    tags: ["motivation", "unstoppable", "power"]
  },
  {
    id: "9",
    title: "Life is Worth Living",
    description: "Inspiring message about finding purpose and meaning in life's journey.",
    duration: "9:45",
    views: 27650,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/7RZne_dfg84/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/7RZne_dfg84",
    speaker: "Life Purpose Coach",
    tags: ["motivation", "purpose", "meaning"]
  },
  {
    id: "10",
    title: "Transform Your Mindset",
    description: "Learn how to shift your thinking patterns for better mental health and success.",
    duration: "14:20",
    views: 31850,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/dvc81UK4iq8/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/dvc81UK4iq8",
    speaker: "Mindset Expert",
    tags: ["mindset", "transformation", "success"]
  },
  {
    id: "11",
    title: "Inner Strength and Resilience",
    description: "Discover your inner strength and build resilience for life's challenges.",
    duration: "16:30",
    views: 38450,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/CcY4GWjyl2U/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/CcY4GWjyl2U",
    speaker: "Resilience Coach",
    tags: ["strength", "resilience", "courage"]
  },
  {
    id: "12",
    title: "Motivation for Success",
    description: "Powerful motivation to help you achieve your dreams and reach your potential.",
    duration: "13:15",
    views: 29300,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/aOfLe3xJvNc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/aOfLe3xJvNc",
    speaker: "Success Mentor",
    tags: ["motivation", "success", "potential"]
  },
  {
    id: "13",
    title: "Personal Growth Journey",
    description: "Essential guidance for your personal development and growth journey.",
    duration: "17:45",
    views: 33200,
    category: "Motivation",
    thumbnailUrl: "https://img.youtube.com/vi/5YoTP_fO4FI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/5YoTP_fO4FI",
    speaker: "Growth Expert",
    tags: ["growth", "development", "journey"]
  },
  {
    id: "14",
    title: "Breathing Techniques for Anxiety",
    description: "Learn powerful breathing exercises to manage anxiety and panic attacks naturally.",
    duration: "7:25",
    views: 28700,
    category: "Mindfulness",
    thumbnailUrl: "https://img.youtube.com/vi/placeholder14/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/placeholder14",
    speaker: "Dr. Emma Wilson",
    tags: ["anxiety", "breathing", "calm"]
  },
  {
    id: "15",
    title: "5-Minute Daily Meditation Guide",
    description: "Simple meditation techniques you can practice anywhere to reduce stress and find inner peace.",
    duration: "8:30",
    views: 23150,
    category: "Mindfulness",
    thumbnailUrl: "https://img.youtube.com/vi/placeholder15/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/placeholder15",
    speaker: "Master Chen",
    tags: ["meditation", "mindfulness", "peace"]
  },
  {
    id: "16",
    title: "Healthy Habits for Mental Wellness",
    description: "Essential daily practices to maintain good mental health and emotional balance.",
    duration: "10:15",
    views: 18900,
    category: "Wellness",
    thumbnailUrl: "https://img.youtube.com/vi/placeholder16/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/placeholder16",
    speaker: "Dr. Lisa Park",
    tags: ["wellness", "habits", "mental health"]
  },
  {
    id: "17",
    title: "Laugh Your Way to Better Health",
    description: "Funny comedy sketches and jokes that boost mood and reduce stress naturally.",
    duration: "12:30",
    views: 45200,
    category: "Comedy",
    thumbnailUrl: "https://img.youtube.com/vi/placeholder17/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/placeholder17",
    speaker: "Comedy Central",
    tags: ["humor", "laughter", "stress relief"]
  },
  {
    id: "18",
    title: "Stand-up Comedy: Life's Funny Moments",
    description: "Hilarious stand-up routine about everyday life situations that make you laugh.",
    duration: "15:45",
    views: 38900,
    category: "Comedy",
    thumbnailUrl: "https://img.youtube.com/vi/placeholder18/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/placeholder18",
    speaker: "Mike Johnson",
    tags: ["stand-up", "humor", "entertainment"]
  },
  {
    id: "19",
    title: "Funny Animal Videos Compilation",
    description: "Cute and funny animal moments guaranteed to make you smile and feel better.",
    duration: "8:15",
    views: 67300,
    category: "Comedy",
    thumbnailUrl: "https://img.youtube.com/vi/placeholder19/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/placeholder19",
    speaker: "Animal Planet",
    tags: ["animals", "cute", "funny"]
  },
  {
    id: "20",
    title: "Comedy Therapy: Humor as Medicine",
    description: "How laughter can be used as a therapeutic tool for mental health and wellbeing.",
    duration: "11:20",
    views: 29400,
    category: "Comedy",
    thumbnailUrl: "https://img.youtube.com/vi/placeholder20/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/placeholder20",
    speaker: "Dr. Humor Smith",
    tags: ["therapy", "laughter", "healing"]
  }
];

const categories = ["All", "Motivation", "Mindfulness", "Success", "Wellness", "Inspiration", "Comedy"];

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [likedVideos, setLikedVideos] = useState<string[]>([]);

  const filteredVideos = motivationalVideos.filter(video => {
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (videoId: string) => {
    setLikedVideos(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mind Fresh Videos</h1>
        <p className="text-muted-foreground">Inspiring and entertaining content to boost your mental wellness and mood</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos..."
            className="pl-10"
            data-testid="input-search-videos"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48" data-testid="select-video-filter">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} data-testid={`filter-option-${category.toLowerCase()}`}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or category filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div 
                className="relative overflow-hidden rounded-t-lg"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <Play className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-medium">{video.category}</p>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.speaker}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-black ml-1" />
                  </div>
                </div>
                <Badge 
                  className="absolute top-2 right-2 bg-black/70 text-white"
                  variant="secondary"
                >
                  {video.duration}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {video.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(video.id)}
                    className="shrink-0"
                    data-testid={`like-video-${video.id}`}
                  >
                    <Heart className={`h-4 w-4 ${likedVideos.includes(video.id) ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>
                <CardDescription className="text-sm">
                  by {video.speaker}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatViews(video.views)} views
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {video.category}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="flex-1 flex flex-col">
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <iframe
                  src={selectedVideo.videoUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                ></iframe>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">
                      by {selectedVideo.speaker}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatViews(selectedVideo.views)} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedVideo.duration}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleLike(selectedVideo.id)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${likedVideos.includes(selectedVideo.id) ? 'fill-current text-red-500' : ''}`} />
                    {likedVideos.includes(selectedVideo.id) ? 'Liked' : 'Like'}
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedVideo.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}