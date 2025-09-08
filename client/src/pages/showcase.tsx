import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Heart, 
  Eye,
  MessageSquare, 
  Upload,
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
  Mic
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";

const skillCategories = [
  { value: "art", label: "Art & Drawing", icon: Palette },
  { value: "music", label: "Music", icon: Music },
  { value: "writing", label: "Writing", icon: PenTool },
  { value: "photography", label: "Photography", icon: Camera },
  { value: "coding", label: "Programming", icon: Code },
  { value: "poetry", label: "Poetry", icon: FileText },
  { value: "singing", label: "Singing", icon: Mic },
  { value: "other", label: "Other", icon: Star }
];

interface ShowcasePost {
  id: string;
  title: string;
  description: string;
  category: string;
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
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "",
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
      setNewPost({ title: "", description: "", category: "", file: null });
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

  // Mock data for demonstration
  const mockPosts: ShowcasePost[] = [
    {
      id: "1",
      title: "Sunset Painting",
      description: "A watercolor painting of sunset over mountains. This piece represents my journey through healing and finding peace.",
      category: "art",
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
      likes: 31,
      views: 203,
      comments: 15,
      author: {
        name: "Word Weaver",
        institution: "Bangalore Institute"
      },
      createdAt: "2024-01-13T09:45:00Z",
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

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Button>
          {skillCategories.map((category) => (
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

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPosts.map((post) => {
          const categoryInfo = skillCategories.find(cat => cat.value === post.category);
          const CategoryIcon = categoryInfo?.icon || Star;
          
          return (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CategoryIcon className="h-3 w-3" />
                      {categoryInfo?.label || post.category}
                    </Badge>
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