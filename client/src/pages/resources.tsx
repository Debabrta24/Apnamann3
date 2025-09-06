import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Moon, 
  Book, 
  Clover, 
  Users, 
  Construction, 
  Play, 
  BookOpen, 
  Download, 
  ThumbsUp, 
  Bookmark,
  Search,
  Filter 
} from "lucide-react";
import type { Resource } from "@/types";
import { BackButton } from "@/components/ui/back-button";

import stressImage from "@assets/generated_images/Stress_management_wellness_illustration_1f205959.png";
import sleepImage from "@assets/generated_images/Sleep_hygiene_wellness_illustration_abeffba1.png";
import studyImage from "@assets/generated_images/Study_techniques_educational_illustration_cc34a960.png";
import mindfulnessImage from "@assets/generated_images/Mindfulness_meditation_wellness_illustration_da954077.png";
import socialImage from "@assets/generated_images/Social_confidence_building_illustration_b05c2890.png";
import careerImage from "@assets/generated_images/Career_guidance_professional_illustration_eb733775.png";

const categories = [
  { id: "stress-management", icon: Leaf, label: "Stress Management", color: "bg-primary text-primary-foreground", image: stressImage },
  { id: "sleep-hygiene", icon: Moon, label: "Sleep Hygiene", color: "bg-card border border-border text-card-foreground", image: sleepImage },
  { id: "study-techniques", icon: Book, label: "Study Techniques", color: "bg-card border border-border text-card-foreground", image: studyImage },
  { id: "mindfulness", icon: Clover, label: "Mindfulness", color: "bg-card border border-border text-card-foreground", image: mindfulnessImage },
  { id: "social-confidence", icon: Users, label: "Social Confidence", color: "bg-card border border-border text-card-foreground", image: socialImage },
  { id: "career-guidance", icon: Construction, label: "Career Guidance", color: "bg-card border border-border text-card-foreground", image: careerImage },
];

const resourceTypeIcons = {
  video: Play,
  article: BookOpen,
  audio: Play,
  guide: Book,
  tool: BookOpen,
  activity: BookOpen,
};

const resourceTypeColors = {
  video: "bg-secondary/20 text-secondary",
  article: "bg-accent/20 text-accent", 
  audio: "bg-chart-4/20 text-chart-4",
  guide: "bg-secondary/20 text-secondary",
  tool: "bg-primary/20 text-primary",
  activity: "bg-green-500/20 text-green-700",
};

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("stress-management");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources", selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/resources?category=${selectedCategory}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      return response.json();
    },
    select: (data: Resource[]) => 
      data.filter(resource => 
        searchQuery === "" || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
  });

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      // Reset other categories to default styling
      categories.forEach(cat => {
        if (cat.id !== categoryId) {
          cat.color = "bg-card border border-border text-card-foreground hover:bg-muted/50 transition-colors";
        }
      });
      // Set active category styling
      category.color = "bg-primary text-primary-foreground";
    }
  };

  const handleResourceAction = (action: string, resourceId: string) => {
    console.log(`${action} resource ${resourceId}`);
    // Implementation would depend on resource type
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Wellness Resources</h1>
        <p className="text-muted-foreground">
          Explore curated content to support your mental health journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Browse Resources</h3>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.id}
                      className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border-2 ${
                        selectedCategory === category.id 
                          ? "border-primary shadow-md" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                      data-testid={`button-category-${category.id}`}
                    >
                      <div className="relative">
                        <img 
                          src={category.image} 
                          alt={category.label}
                          className="w-full h-32 object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent`}></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="flex items-center text-white">
                            <IconComponent className="h-4 w-4 mr-2" />
                            <span className="font-medium text-sm">{category.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Search Resources</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-resources"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resource Content */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-3"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !resources || resources.length === 0 ? (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No Resources Found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms." : "Resources are being curated for this category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => {
                const TypeIcon = resourceTypeIcons[resource.type as keyof typeof resourceTypeIcons];
                const typeColor = resourceTypeColors[resource.type as keyof typeof resourceTypeColors];
                
                return (
                  <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    {/* Resource Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <TypeIcon className="h-12 w-12 text-primary/60" />
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs font-medium ${typeColor}`}>
                          {resource.type}
                        </Badge>
                        {(resource as any).duration && (
                          <span className="text-xs text-muted-foreground">
                            {(resource as any).duration} min
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-card-foreground mb-2 line-clamp-2">
                        {resource.title}
                      </h4>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{resource.likes} helpful</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleResourceAction('view', resource.id)}
                            data-testid={`button-view-resource-${resource.id}`}
                          >
                            {resource.type === 'video' || resource.type === 'audio' ? (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Play
                              </>
                            ) : (
                              <>
                                <BookOpen className="h-3 w-3 mr-1" />
                                Read
                              </>
                            )}
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleResourceAction('bookmark', resource.id)}
                            data-testid={`button-bookmark-resource-${resource.id}`}
                          >
                            <Bookmark className="h-3 w-3" />
                          </Button>
                          
                          {resource.isOfflineAvailable && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleResourceAction('download', resource.id)}
                              data-testid={`button-download-resource-${resource.id}`}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
