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
  CheckCircle,
  BookOpen,
  Lightbulb,
  Star,
  TrendingUp
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ForumPost from "@/components/community/forum-post";
import type { ForumPost as ForumPostType } from "@/types";

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Peer Support Community</h1>
              <p className="text-blue-700 dark:text-blue-300">Connect, share, and support each other</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Safe Space</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Anonymous & moderated discussions</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Peer Support</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Share experiences with fellow students</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Learn Together</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Coping strategies and resources</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setIsCreatePostOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                data-testid="button-create-post-sidebar"
              >
                <Plus className="h-4 w-4 mr-2" />
                Share Your Story
              </Button>
              <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                💡 Your posts are always anonymous and reviewed by trained peer moderators
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Be respectful and supportive to all members</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Share personal experiences, not professional advice</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Maintain anonymity for everyone's safety</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Report content that may be harmful</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Active Moderators */}
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <ShieldQuestion className="h-5 w-5 mr-2 text-purple-600" />
                Peer Moderators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moderators.map((mod, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <ShieldQuestion className="text-white h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{mod.pseudonym}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{mod.role}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-100 dark:border-purple-800">
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  <BookOpen className="inline h-3 w-3 mr-1" />
                  Our moderators are trained students who understand your challenges
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discussion Forum */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Discussion Forum</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Share your experiences and find support from fellow students</p>
            </div>
            
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium" data-testid="button-create-post">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Share Your Experience</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <Input
                      placeholder="Share a brief, supportive title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      data-testid="input-post-title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Experience
                    </label>
                    <Textarea
                      placeholder="Share your experience, feelings, or ask for peer support. Remember to be respectful and supportive."
                      rows={5}
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      data-testid="textarea-post-content"
                    />
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <Shield className="inline h-4 w-4 mr-2" />
                      Your post will be shared anonymously and reviewed by trained peer moderators before appearing in the forum.
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
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
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
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start the Conversation</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Be the first to share your experience and create a supportive space for fellow students.
                  </p>
                  <Button 
                    onClick={() => setIsCreatePostOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              (forumPosts as any)?.map?.((post: ForumPostType) => (
                <ForumPost key={post.id} post={post as ForumPostType & { replies?: any[] }} />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
