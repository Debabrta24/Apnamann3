import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  ShieldQuestion, 
  Plus, 
  Heart, 
  MessageSquare, 
  Flag,
  Users,
  CheckCircle 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ForumPost from "@/components/community/forum-post";
import type { ForumPost as ForumPostType, ForumReply } from "@/types";

const categories = [
  "Exam Stress",
  "Social Anxiety", 
  "Depression Support",
  "Study Motivation",
  "Peer Pressure",
  "Career Anxiety",
  "Family Issues",
  "General Support"
];

const moderators = [
  { pseudonym: "PeerMod_Alex", role: "Psychology Student", color: "bg-primary" },
  { pseudonym: "WellnessHelper_Priya", role: "Counseling Intern", color: "bg-secondary" },
];

export default function Community() {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    isAnonymous: true,
  });

  const { data: forumPosts, isLoading } = useQuery({
    queryKey: ["/api/forum/posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest("POST", "/api/forum/posts", {
        ...postData,
        userId: currentUser?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setIsCreatePostOpen(false);
      setNewPost({ title: "", content: "", category: "", isAnonymous: true });
      toast({
        title: "Post created",
        description: "Your post has been submitted for moderation.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate(newPost);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Community Guidelines Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-secondary/10 border-secondary/20 mb-6">
            <CardHeader>
              <CardTitle className="text-secondary flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-secondary/80">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Be respectful and supportive</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Share experiences, not advice</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Maintain anonymity</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Report harmful content</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Active Moderators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moderators.map((mod, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${mod.color} rounded-full flex items-center justify-center`}>
                      <ShieldQuestion className="text-white h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{mod.pseudonym}</p>
                      <p className="text-xs text-secondary">{mod.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discussion Forum */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">Peer Support Forum</h1>
            
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-post">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Share Your Experience</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Title
                    </label>
                    <Input
                      placeholder="Share a brief, supportive title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      data-testid="input-post-title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Category
                    </label>
                    <Select 
                      value={newPost.category} 
                      onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                    >
                      <SelectTrigger data-testid="select-post-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Your Experience
                    </label>
                    <Textarea
                      placeholder="Share your experience, feelings, or ask for peer support. Remember to be respectful and supportive."
                      rows={5}
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      data-testid="textarea-post-content"
                    />
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">
                      <Shield className="inline h-3 w-3 mr-1" />
                      Your post will be shared anonymously and reviewed by moderators before appearing in the forum.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatePostOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={createPostMutation.isPending}
                      data-testid="button-submit-post"
                    >
                      {createPostMutation.isPending ? "Posting..." : "Share Post"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-3 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-4"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : !forumPosts || (forumPosts as any)?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-card-foreground mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your experience and connect with peers.
                  </p>
                  <Button onClick={() => setIsCreatePostOpen(true)}>
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              (forumPosts as any)?.map?.((post: ForumPostType) => (
                <ForumPost key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
