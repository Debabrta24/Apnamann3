import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Heart, 
  Eye,
  MessageSquare, 
  Palette,
  Code,
  Music,
  Camera,
  PenTool,
  Award,
  Star,
  Trophy,
  Image,
  FileText,
  Mic,
  Video,
  Theater,
  Brush,
  Guitar,
  Zap,
  Gamepad2,
  Scissors,
  Cake,
  Shirt,
  Car,
  Wrench,
  Dumbbell,
  TreePine,
  Coffee,
  Utensils,
  Flower,
  Languages,
  Globe,
  BookOpen,
  Filter,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";

const skillCategories = [
  { value: "art", label: "Art & Drawing", icon: Palette, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { value: "digital-art", label: "Digital Art", icon: Brush, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  { value: "music", label: "Music", icon: Music, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { value: "instrumental", label: "Instrumental", icon: Guitar, color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
  { value: "singing", label: "Singing", icon: Mic, color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
  { value: "writing", label: "Creative Writing", icon: PenTool, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { value: "poetry", label: "Poetry", icon: FileText, color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200" },
  { value: "photography", label: "Photography", icon: Camera, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "videography", label: "Video Creation", icon: Video, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  { value: "coding", label: "Programming", icon: Code, color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200" },
  { value: "dance", label: "Dance", icon: Zap, color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200" },
  { value: "theater", label: "Theater & Acting", icon: Theater, color: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200" },
  { value: "gaming", label: "Game Development", icon: Gamepad2, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  { value: "crafts", label: "Arts & Crafts", icon: Scissors, color: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200" },
  { value: "cooking", label: "Cooking", icon: Utensils, color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  { value: "baking", label: "Baking", icon: Cake, color: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200" },
  { value: "fashion", label: "Fashion Design", icon: Shirt, color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200" },
  { value: "automotive", label: "Automotive", icon: Car, color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
  { value: "diy", label: "DIY Projects", icon: Wrench, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { value: "fitness", label: "Fitness", icon: Dumbbell, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { value: "gardening", label: "Gardening", icon: TreePine, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { value: "coffee-art", label: "Coffee Art", icon: Coffee, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "nature", label: "Nature Art", icon: Flower, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  { value: "languages", label: "Languages", icon: Languages, color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
  { value: "cultural", label: "Cultural Arts", icon: Globe, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  { value: "academic", label: "Academic Work", icon: BookOpen, color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200" },
  { value: "other", label: "Other", icon: Star, color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" }
];

const themes = [
  { value: "inspiration", label: "Inspiration & Hope", color: "bg-blue-50 border-blue-200" },
  { value: "healing", label: "Healing Journey", color: "bg-green-50 border-green-200" },
  { value: "mindfulness", label: "Mindfulness & Peace", color: "bg-purple-50 border-purple-200" },
  { value: "community", label: "Community Support", color: "bg-orange-50 border-orange-200" },
  { value: "cultural", label: "Cultural Heritage", color: "bg-yellow-50 border-yellow-200" },
  { value: "nature", label: "Nature & Environment", color: "bg-emerald-50 border-emerald-200" },
  { value: "education", label: "Learning & Growth", color: "bg-indigo-50 border-indigo-200" },
  { value: "innovation", label: "Innovation & Tech", color: "bg-cyan-50 border-cyan-200" },
  { value: "celebration", label: "Joy & Celebration", color: "bg-pink-50 border-pink-200" },
  { value: "challenge", label: "Overcoming Challenges", color: "bg-red-50 border-red-200" }
];

const sortOptions = [
  { value: "recent", label: "Most Recent", icon: Clock },
  { value: "popular", label: "Most Popular", icon: TrendingUp },
  { value: "views", label: "Most Viewed", icon: Eye },
  { value: "liked", label: "Most Liked", icon: Heart }
];

interface ShowcasePost {
  id: string;
  title: string;
  description: string;
  category: string;
  theme?: string;
  tags?: string[];
  imageUrl?: string;
  fileUrl?: string;
  likes: number;
  views: number;
  comments: number;
  author: {
    name: string;
    institution: string;
  };
  createdAt: string;
  isLiked: boolean;
}

export default function Showcase() {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "",
    theme: "",
    tags: "",
    file: null as File | null
  });

  // Fetch showcase posts
  const { data: showcasePosts, isLoading } = useQuery({
    queryKey: ["/api/showcase/posts", selectedCategory],
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: FormData) => {
      return await apiRequest("POST", "/api/showcase/posts", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/showcase/posts"] });
      setIsCreatePostOpen(false);
      setNewPost({ title: "", description: "", category: "", theme: "", tags: "", file: null });
      toast({
        title: "Showcase created!",
        description: "Your creative work has been shared with the community.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create showcase post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      return await apiRequest("POST", `/api/showcase/posts/${postId}/like`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/showcase/posts"] });
    },
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.description || !newPost.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("description", newPost.description);
    formData.append("category", newPost.category);
    formData.append("theme", newPost.theme);
    formData.append("tags", newPost.tags);
    formData.append("userId", currentUser?.id || "");
    
    if (newPost.file) {
      formData.append("file", newPost.file);
    }

    createPostMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      setNewPost({ ...newPost, file });
    }
  };

  // Enhanced mock data for demonstration
  const mockPosts: ShowcasePost[] = [
    {
      id: "1",
      title: "Sunset Painting",
      description: "A watercolor painting of sunset over mountains. This piece represents my journey through healing and finding peace.",
      category: "art",
      theme: "healing",
      tags: ["watercolor", "nature", "peace"],
      imageUrl: "/api/placeholder/400/300",
      likes: 24,
      views: 156,
      comments: 8,
      author: {
        name: "Anonymous Artist",
        institution: "Delhi University"
      },
      createdAt: "2024-01-15T10:30:00Z",
      isLiked: false
    },
    {
      id: "2",
      title: "Mental Health Awareness Song",
      description: "Original composition about breaking mental health stigma in Indian society.",
      category: "music",
      theme: "community",
      tags: ["original", "awareness", "mental-health"],
      fileUrl: "/api/placeholder/audio.mp3",
      likes: 18,
      views: 89,
      comments: 12,
      author: {
        name: "Music Lover",
        institution: "Mumbai College"
      },
      createdAt: "2024-01-14T15:20:00Z",
      isLiked: true
    },
    {
      id: "3",
      title: "Hope - A Short Poem",
      description: "A poem about finding hope during difficult times. Written during my recovery journey.",
      category: "poetry",
      theme: "inspiration",
      tags: ["hope", "recovery", "inspiration"],
      likes: 31,
      views: 203,
      comments: 15,
      author: {
        name: "Word Weaver",
        institution: "Bangalore Institute"
      },
      createdAt: "2024-01-13T09:45:00Z",
      isLiked: false
    },
    {
      id: "4",
      title: "Digital Portrait Series",
      description: "A collection of digital portraits exploring emotions and mental states through vibrant colors.",
      category: "digital-art",
      theme: "mindfulness",
      tags: ["digital", "portraits", "emotions"],
      imageUrl: "/api/placeholder/400/300",
      likes: 45,
      views: 234,
      comments: 19,
      author: {
        name: "Digital Creator",
        institution: "IIT Chennai"
      },
      createdAt: "2024-01-12T14:20:00Z",
      isLiked: false
    },
    {
      id: "5",
      title: "Healthy Meal Prep Ideas",
      description: "Creative and nutritious meal prep recipes for busy college students on a budget.",
      category: "cooking",
      theme: "education",
      tags: ["healthy", "budget", "student-life"],
      imageUrl: "/api/placeholder/400/300",
      likes: 67,
      views: 401,
      comments: 23,
      author: {
        name: "Chef Student",
        institution: "Culinary Institute Delhi"
      },
      createdAt: "2024-01-11T09:15:00Z",
      isLiked: true
    },
    {
      id: "6",
      title: "Meditation App UI Design",
      description: "User interface design for a mindfulness app focused on Indian meditation practices.",
      category: "coding",
      theme: "innovation",
      tags: ["ui-design", "meditation", "tech"],
      imageUrl: "/api/placeholder/400/300",
      likes: 52,
      views: 312,
      comments: 16,
      author: {
        name: "UX Designer",
        institution: "NIT Warangal"
      },
      createdAt: "2024-01-10T16:45:00Z",
      isLiked: false
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Creative Showcase</h1>
        <p className="text-muted-foreground">
          Share your creative talents and discover amazing work from the community
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="space-y-4 mb-6">
        {/* Top Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90" data-testid="button-create-showcase">
                <Plus className="h-4 w-4 mr-2" />
                Share Your Work
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Share Your Creative Work</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Give your work a catchy title..."
                    data-testid="input-showcase-title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newPost.category}
                    onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                  >
                    <SelectTrigger data-testid="select-showcase-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme">Theme (Optional)</Label>
                  <Select
                    value={newPost.theme}
                    onValueChange={(value) => setNewPost({ ...newPost, theme: value })}
                  >
                    <SelectTrigger data-testid="select-showcase-theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <Input
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="creativity, mental-health, inspiration..."
                    data-testid="input-showcase-tags"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate tags with commas
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newPost.description}
                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                    placeholder="Tell us about your work, inspiration, or journey..."
                    rows={4}
                    data-testid="textarea-showcase-description"
                  />
                </div>

                <div>
                  <Label htmlFor="file">Upload File (Optional)</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                    data-testid="input-showcase-file"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: Images, Audio, Video, PDF, Documents (Max 10MB)
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatePostOpen(false)}
                    data-testid="button-cancel-showcase"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={createPostMutation.isPending}
                    data-testid="button-submit-showcase"
                  >
                    {createPostMutation.isPending ? "Sharing..." : "Share Work"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Button>
          {skillCategories.slice(0, 8).map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              <category.icon className="h-4 w-4 mr-1" />
              {category.label}
            </Button>
          ))}
          {skillCategories.length > 8 && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="More..." />
              </SelectTrigger>
              <SelectContent>
                {skillCategories.slice(8).map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Theme Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Themes:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTheme === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTheme("all")}
            >
              All Themes
            </Button>
            {themes.map((theme) => (
              <Button
                key={theme.value}
                variant={selectedTheme === theme.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTheme(theme.value)}
              >
                {theme.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Showcase Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {mockPosts.map((post) => {
          const categoryInfo = skillCategories.find(cat => cat.value === post.category);
          const themeInfo = themes.find(t => t.value === post.theme);
          const CategoryIcon = categoryInfo?.icon || Star;
          
          return (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={`flex items-center gap-1 ${categoryInfo?.color || ""}`}>
                      <CategoryIcon className="h-3 w-3" />
                      {categoryInfo?.label || post.category}
                    </Badge>
                    {post.theme && themeInfo && (
                      <Badge variant="outline" className="text-xs">
                        {themeInfo.label}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {post.views}
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {post.imageUrl && (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.description}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    <p>{post.author.name}</p>
                    <p>{post.author.institution}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likePostMutation.mutate(post.id)}
                      className={post.isLiked ? "text-red-500" : ""}
                      data-testid={`button-like-${post.id}`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                      {post.likes}
                    </Button>
                    
                    <Button variant="ghost" size="sm" data-testid={`button-comment-${post.id}`}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {mockPosts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No showcases yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share your creative work with the community!
            </p>
            <Button onClick={() => setIsCreatePostOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Share Your Work
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}