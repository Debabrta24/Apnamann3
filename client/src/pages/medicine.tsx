import { useState } from "react";
import { Pill, ShoppingCart, Search, Star, Clock, MapPin, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Medicine {
  id: number;
  name: string;
  genericName: string;
  category: string;
  price: number;
  discountPrice?: number;
  manufacturer: string;
  rating: number;
  reviewCount: number;
  description: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  inStock: boolean;
  prescription: boolean;
  image: string;
}

const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    category: "Pain Relief",
    price: 45,
    discountPrice: 38,
    manufacturer: "Cipla Ltd.",
    rating: 4.5,
    reviewCount: 245,
    description: "Effective pain relief and fever reducer for mild to moderate pain",
    uses: ["Headache", "Fever", "Body aches", "Toothache"],
    dosage: "1-2 tablets every 4-6 hours as needed",
    sideEffects: ["Rare: skin rash", "Overdose: liver damage"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Vitamin D3 1000 IU",
    genericName: "Cholecalciferol",
    category: "Vitamins",
    price: 280,
    discountPrice: 225,
    manufacturer: "Sun Pharma",
    rating: 4.7,
    reviewCount: 189,
    description: "Essential vitamin for bone health and immune system support",
    uses: ["Bone health", "Immune support", "Vitamin D deficiency"],
    dosage: "1 tablet daily with meal",
    sideEffects: ["Rare: nausea", "High doses: kidney stones"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    category: "Digestive",
    price: 120,
    discountPrice: 95,
    manufacturer: "Dr. Reddy's",
    rating: 4.3,
    reviewCount: 156,
    description: "Proton pump inhibitor for acid reflux and stomach ulcer treatment",
    uses: ["Acid reflux", "GERD", "Stomach ulcers", "Heartburn"],
    dosage: "1 capsule daily before breakfast",
    sideEffects: ["Headache", "Nausea", "Stomach pain"],
    inStock: true,
    prescription: true,
    image: "https://images.unsplash.com/photo-1471864700033-781b42eb91b5?w=300&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Cetirizine 10mg",
    genericName: "Cetirizine HCl",
    category: "Allergy",
    price: 65,
    discountPrice: 52,
    manufacturer: "Lupin Ltd.",
    rating: 4.4,
    reviewCount: 203,
    description: "Antihistamine for allergic reactions and seasonal allergies",
    uses: ["Allergic rhinitis", "Hives", "Itching", "Sneezing"],
    dosage: "1 tablet once daily",
    sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1471864700033-781b42eb91b5?w=300&h=200&fit=crop"
  },
  {
    id: 5,
    name: "Melatonin 3mg",
    genericName: "Melatonin",
    category: "Sleep Aid",
    price: 450,
    discountPrice: 385,
    manufacturer: "HealthKart",
    rating: 4.6,
    reviewCount: 312,
    description: "Natural sleep hormone supplement for better sleep quality",
    uses: ["Insomnia", "Jet lag", "Sleep disorders", "Shift work"],
    dosage: "1 tablet 30 minutes before bedtime",
    sideEffects: ["Morning drowsiness", "Vivid dreams", "Headache"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"
  },
  {
    id: 6,
    name: "Ashwagandha 300mg",
    genericName: "Withania somnifera",
    category: "Stress Relief",
    price: 380,
    discountPrice: 320,
    manufacturer: "Himalaya",
    rating: 4.5,
    reviewCount: 267,
    description: "Ayurvedic herb for stress management and anxiety relief",
    uses: ["Stress relief", "Anxiety", "Mental fatigue", "Energy boost"],
    dosage: "1-2 capsules twice daily with meals",
    sideEffects: ["Mild stomach upset", "Drowsiness"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"
  }
];

const categories = ["All", "Pain Relief", "Vitamins", "Digestive", "Allergy", "Sleep Aid", "Stress Relief"];

export default function Medicine() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const { toast } = useToast();

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.uses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicineId: number) => {
    setCart(prev => ({
      ...prev,
      [medicineId]: (prev[medicineId] || 0) + 1
    }));
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart successfully.",
    });
  };

  const removeFromCart = (medicineId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[medicineId] && newCart[medicineId] > 1) {
        newCart[medicineId] -= 1;
      } else {
        delete newCart[medicineId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [medicineId, quantity]) => {
      const medicine = medicines.find(m => m.id === parseInt(medicineId));
      if (medicine) {
        const price = medicine.discountPrice || medicine.price;
        return total + (price * quantity);
      }
      return total;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Buy Medicine</h1>
        <p className="text-lg text-muted-foreground">
          Order medicines online with fast delivery and genuine products
        </p>
      </div>

      {/* Search and Cart Summary */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search medicines, symptoms, or conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-medicine-search"
            />
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-2">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {getCartItemCount()} items • ₹{getCartTotal()}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse" data-testid="tab-browse">Browse Medicines</TabsTrigger>
          <TabsTrigger value="cart" data-testid="tab-cart">
            Cart ({getCartItemCount()})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-testid={`filter-${category.toLowerCase().replace(' ', '-')}`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Medicine Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-video mb-3 overflow-hidden rounded-lg">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{medicine.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{medicine.genericName}</p>
                      <p className="text-xs text-muted-foreground">{medicine.manufacturer}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="secondary" className="mb-1">{medicine.category}</Badge>
                      {medicine.prescription && (
                        <Badge variant="destructive" className="text-xs">Rx Required</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{medicine.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({medicine.reviewCount} reviews)</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{medicine.description}</p>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Uses:</strong> {medicine.uses.slice(0, 3).join(", ")}
                      {medicine.uses.length > 3 && "..."}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <strong>Dosage:</strong> {medicine.dosage}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {medicine.discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-primary">₹{medicine.discountPrice}</span>
                          <span className="text-sm text-muted-foreground line-through">₹{medicine.price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-primary">₹{medicine.price}</span>
                      )}
                    </div>
                    {medicine.inStock ? (
                      <div className="flex items-center gap-2">
                        {cart[medicine.id] ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(medicine.id)}
                              data-testid={`btn-decrease-${medicine.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="min-w-[20px] text-center">{cart[medicine.id]}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(medicine.id)}
                              data-testid={`btn-increase-${medicine.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => addToCart(medicine.id)}
                            data-testid={`btn-add-${medicine.id}`}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary">Out of Stock</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shopping Cart ({getCartItemCount()} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => {
                      const browseTab = document.querySelector('[data-testid="tab-browse"]') as HTMLElement;
                      browseTab?.click();
                    }}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(cart).map(([medicineId, quantity]) => {
                    const medicine = medicines.find(m => m.id === parseInt(medicineId));
                    if (!medicine) return null;
                    const price = medicine.discountPrice || medicine.price;

                    return (
                      <div key={medicineId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={medicine.image}
                            alt={medicine.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium">{medicine.name}</h4>
                            <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                            <p className="text-sm text-primary font-medium">₹{price} each</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(medicine.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="min-w-[30px] text-center">{quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(medicine.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{price * quantity}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total: ₹{getCartTotal()}</span>
                      <Button size="lg" data-testid="btn-checkout">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">Get medicines delivered within 2-4 hours in major cities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Pill className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Genuine Products</h3>
            <p className="text-sm text-muted-foreground">All medicines are sourced from verified manufacturers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Pan India Delivery</h3>
            <p className="text-sm text-muted-foreground">Available across 1000+ cities nationwide</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}