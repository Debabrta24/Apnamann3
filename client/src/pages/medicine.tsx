import { useState } from "react";
import { Pill, ShoppingCart, Search, Star, Clock, MapPin, Plus, Minus, Upload, FileText, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import psychiatric medicine images
import valop500Image from "@assets/IMG-20250918-WA0009_1758138692176.jpg";
import gabasign300Image from "@assets/IMG-20250918-WA0010_1758138692177.jpg";
import mirzawell75Image from "@assets/IMG-20250918-WA0011_1758138692178.jpg";
import elipam10Image from "@assets/IMG-20250918-WA0012_1758138692179.jpg";
import lamotrigine100Image from "@assets/IMG-20250918-WA0013_1758138692180.jpg";
import vilzocar20Image from "@assets/IMG-20250918-WA0014_1758138692181.jpg";
import tryptiline25Image from "@assets/IMG-20250918-WA0015_1758138692182.jpg";
import buspin10Image from "@assets/IMG-20250918-WA0016_1758138692182.jpg";
import wellbutrinXL150Image from "@assets/IMG-20250918-WA0017_1758138692183.jpg";
import perizon6ERImage from "@assets/IMG-20250918-WA0018_1758138692184.jpg";
import erilop5MDImage from "@assets/IMG-20250918-WA0019_1758138692184.jpg";
import eriquitc50Image from "@assets/IMG-20250918-WA0020_1758138692185.jpg";
import cabrizepineCR200Image from "@assets/IMG-20250918-WA0021_1758138692186.jpg";
import asprito15Image from "@assets/IMG-20250918-WA0022_1758138692187.jpg";
import olanzapine10Image from "@assets/IMG-20250918-WA0023_1758138692188.jpg";
import toppr25Image from "@assets/IMG-20250918-WA0024_1758138692189.jpg";
import oza50Image from "@assets/IMG-20250918-WA0025_1758138692190.jpg";
import edronax4mgImage from "@assets/IMG-20250918-WA0026_1758138692190.jpg";
import pronon300Image from "@assets/IMG-20250918-WA0027_1758138692191.jpg";

// Create image mapping for psychiatric medicines
const psychiatricMedicineImages: {[key: number]: string} = {
  7: valop500Image,
  8: gabasign300Image,
  9: mirzawell75Image,
  10: elipam10Image,
  11: lamotrigine100Image,
  12: vilzocar20Image,
  13: tryptiline25Image,
  14: buspin10Image,
  15: wellbutrinXL150Image,
  16: perizon6ERImage,
  17: erilop5MDImage,
  18: eriquitc50Image,
  19: cabrizepineCR200Image,
  20: asprito15Image,
  21: olanzapine10Image,
  22: toppr25Image,
  23: oza50Image,
  24: edronax4mgImage,
  25: pronon300Image,
};

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
  },
  // Psychiatric Medications Section
  {
    id: 7,
    name: "Valop-500 CR",
    genericName: "Sodium Valproate and Valproic Acid",
    category: "Psychiatric",
    price: 485,
    discountPrice: 425,
    manufacturer: "Torrent Pharmaceuticals",
    rating: 4.3,
    reviewCount: 89,
    description: "Extended-release tablets for epilepsy and bipolar disorder management",
    uses: ["Epilepsy", "Bipolar disorder", "Mood stabilization", "Seizure control"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Dizziness", "Nausea", "Weight gain", "Hair loss"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[7]
  },
  {
    id: 8,
    name: "Gabasign-300",
    genericName: "Gabapentin",
    category: "Psychiatric",
    price: 315,
    discountPrice: 285,
    manufacturer: "Lupin Ltd.",
    rating: 4.2,
    reviewCount: 156,
    description: "Anticonvulsant medication for neuropathic pain and seizures",
    uses: ["Neuropathic pain", "Epilepsy", "Anxiety disorders", "Restless leg syndrome"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Drowsiness", "Dizziness", "Fatigue", "Peripheral edema"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[8]
  },
  {
    id: 9,
    name: "Mirzawell 7.5",
    genericName: "Mirtazapine",
    category: "Psychiatric",
    price: 285,
    discountPrice: 255,
    manufacturer: "Wellness Life Sciences",
    rating: 4.4,
    reviewCount: 92,
    description: "Antidepressant medication for major depressive disorder",
    uses: ["Depression", "Anxiety", "Sleep disorders", "Appetite stimulation"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Sedation", "Weight gain", "Dry mouth", "Constipation"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[9]
  },
  {
    id: 10,
    name: "Elipam-10",
    genericName: "Diazepam",
    category: "Psychiatric",
    price: 125,
    discountPrice: 95,
    manufacturer: "Cadila Healthcare",
    rating: 4.1,
    reviewCount: 203,
    description: "Benzodiazepine for anxiety, muscle spasms, and seizures",
    uses: ["Anxiety disorders", "Muscle spasms", "Seizures", "Alcohol withdrawal"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Drowsiness", "Confusion", "Muscle weakness", "Dependency risk"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[10]
  },
  {
    id: 11,
    name: "Lamotrigine 100mg",
    genericName: "Lamotrigine",
    category: "Psychiatric",
    price: 395,
    discountPrice: 345,
    manufacturer: "Cipla Ltd.",
    rating: 4.3,
    reviewCount: 124,
    description: "Mood stabilizer and anticonvulsant for bipolar disorder and epilepsy",
    uses: ["Bipolar disorder", "Epilepsy", "Mood stabilization", "Depression"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Skin rash", "Headache", "Nausea", "Blurred vision"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[11]
  },
  {
    id: 12,
    name: "Vilzocar-20",
    genericName: "Vilazodone Hydrochloride",
    category: "Psychiatric",
    price: 685,
    discountPrice: 595,
    manufacturer: "Torrent Pharmaceuticals",
    rating: 4.2,
    reviewCount: 67,
    description: "Antidepressant with partial serotonin agonist activity",
    uses: ["Major depressive disorder", "Anxiety", "Depression with anxiety"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Nausea", "Diarrhea", "Vomiting", "Insomnia"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[12]
  },
  {
    id: 13,
    name: "Tryptiline-25",
    genericName: "Amitriptyline Hydrochloride",
    category: "Psychiatric",
    price: 165,
    discountPrice: 135,
    manufacturer: "Torrent Pharmaceuticals",
    rating: 4.0,
    reviewCount: 187,
    description: "Tricyclic antidepressant for depression and chronic pain",
    uses: ["Depression", "Chronic pain", "Migraine prevention", "Neuropathic pain"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Dry mouth", "Constipation", "Drowsiness", "Weight gain"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[13]
  },
  {
    id: 14,
    name: "Buspin-10",
    genericName: "Buspirone Hydrochloride",
    category: "Psychiatric",
    price: 185,
    discountPrice: 155,
    manufacturer: "Intas Pharmaceuticals",
    rating: 4.1,
    reviewCount: 143,
    description: "Anti-anxiety medication for generalized anxiety disorder",
    uses: ["Anxiety disorders", "Generalized anxiety", "Social anxiety"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Dizziness", "Nausea", "Headache", "Nervousness"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[14]
  },
  {
    id: 15,
    name: "Wellbutrin XL 150mg",
    genericName: "Bupropion Hydrochloride",
    category: "Psychiatric",
    price: 1285,
    discountPrice: 1125,
    manufacturer: "GlaxoSmithKline",
    rating: 4.5,
    reviewCount: 234,
    description: "Extended-release antidepressant and smoking cessation aid",
    uses: ["Depression", "Smoking cessation", "Seasonal affective disorder"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Dry mouth", "Insomnia", "Headache", "Nausea"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[15]
  },
  {
    id: 16,
    name: "Perizon-6 ER",
    genericName: "Paliperidone Extended Release",
    category: "Psychiatric",
    price: 485,
    discountPrice: 425,
    manufacturer: "Intas Pharmaceuticals",
    rating: 4.2,
    reviewCount: 76,
    description: "Extended-release antipsychotic for schizophrenia and bipolar disorder",
    uses: ["Schizophrenia", "Bipolar disorder", "Schizoaffective disorder"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Weight gain", "Sedation", "Extrapyramidal symptoms", "Prolactin elevation"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[16]
  },
  {
    id: 17,
    name: "Erilop 5 MD",
    genericName: "Haloperidol Mouth Dissolving",
    category: "Psychiatric",
    price: 95,
    discountPrice: 78,
    manufacturer: "Sun Pharma",
    rating: 4.0,
    reviewCount: 112,
    description: "Mouth dissolving antipsychotic tablet for acute agitation",
    uses: ["Schizophrenia", "Acute psychosis", "Mania", "Tourette's syndrome"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Extrapyramidal symptoms", "Sedation", "Tardive dyskinesia", "Neuroleptic malignant syndrome"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[17]
  },
  {
    id: 18,
    name: "Eriquitc 50",
    genericName: "Quetiapine Fumarate",
    category: "Psychiatric",
    price: 285,
    discountPrice: 245,
    manufacturer: "Sun Pharma",
    rating: 4.3,
    reviewCount: 189,
    description: "Atypical antipsychotic for schizophrenia and bipolar disorder",
    uses: ["Schizophrenia", "Bipolar disorder", "Major depressive disorder", "Insomnia"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Sedation", "Weight gain", "Dry mouth", "Constipation"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[18]
  },
  {
    id: 19,
    name: "Cabrizepine CR 200",
    genericName: "Carbamazepine Sustained Release",
    category: "Psychiatric",
    price: 185,
    discountPrice: 155,
    manufacturer: "Sun Pharma",
    rating: 4.1,
    reviewCount: 98,
    description: "Sustained-release mood stabilizer and anticonvulsant",
    uses: ["Bipolar disorder", "Epilepsy", "Trigeminal neuralgia", "Mood stabilization"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Dizziness", "Nausea", "Skin rash", "Blood disorders"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[19]
  },
  {
    id: 20,
    name: "Asprito-15",
    genericName: "Aripiprazole",
    category: "Psychiatric",
    price: 385,
    discountPrice: 335,
    manufacturer: "Torrent Pharmaceuticals",
    rating: 4.4,
    reviewCount: 156,
    description: "Atypical antipsychotic with partial dopamine agonist activity",
    uses: ["Schizophrenia", "Bipolar disorder", "Depression augmentation", "Autism irritability"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Akathisia", "Nausea", "Vomiting", "Constipation"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[20]
  },
  {
    id: 21,
    name: "Olanzapine-10",
    genericName: "Olanzapine",
    category: "Psychiatric",
    price: 285,
    discountPrice: 245,
    manufacturer: "Cipla Ltd.",
    rating: 4.2,
    reviewCount: 143,
    description: "Atypical antipsychotic for schizophrenia and bipolar disorder",
    uses: ["Schizophrenia", "Bipolar disorder", "Treatment-resistant depression"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Weight gain", "Sedation", "Metabolic syndrome", "Extrapyramidal symptoms"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[21]
  },
  {
    id: 22,
    name: "Toppr-25",
    genericName: "Topiramate",
    category: "Psychiatric",
    price: 245,
    discountPrice: 195,
    manufacturer: "Torrent Pharmaceuticals",
    rating: 4.0,
    reviewCount: 87,
    description: "Anticonvulsant with mood stabilizing properties",
    uses: ["Epilepsy", "Migraine prevention", "Bipolar disorder", "Weight loss"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Cognitive impairment", "Weight loss", "Kidney stones", "Paresthesia"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[22]
  },
  {
    id: 23,
    name: "Oza-50",
    genericName: "Clozapine",
    category: "Psychiatric",
    price: 185,
    discountPrice: 155,
    manufacturer: "Sun Pharma",
    rating: 4.1,
    reviewCount: 65,
    description: "Atypical antipsychotic for treatment-resistant schizophrenia",
    uses: ["Treatment-resistant schizophrenia", "Suicidal behavior in schizophrenia"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Agranulocytosis", "Sedation", "Weight gain", "Hypersalivation"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[23]
  },
  {
    id: 24,
    name: "Edronax 4mg",
    genericName: "Reboxetine",
    category: "Psychiatric",
    price: 485,
    discountPrice: 425,
    manufacturer: "Pfizer",
    rating: 4.2,
    reviewCount: 78,
    description: "Selective noradrenaline reuptake inhibitor antidepressant",
    uses: ["Major depressive disorder", "Panic disorder"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Dry mouth", "Constipation", "Insomnia", "Urinary retention"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[24]
  },
  {
    id: 25,
    name: "Pronon 300",
    genericName: "Maprotiline Hydrochloride",
    category: "Psychiatric",
    price: 285,
    discountPrice: 245,
    manufacturer: "Intas Pharmaceuticals",
    rating: 4.0,
    reviewCount: 92,
    description: "Tetracyclic antidepressant for depression and anxiety",
    uses: ["Depression", "Anxiety disorders", "Chronic pain"],
    dosage: "As prescribed by doctor",
    sideEffects: ["Drowsiness", "Dry mouth", "Constipation", "Seizure risk"],
    inStock: true,
    prescription: true,
    image: psychiatricMedicineImages[25]
  }
];

const categories = ["All", "Pain Relief", "Vitamins", "Digestive", "Allergy", "Sleep Aid", "Stress Relief", "Psychiatric"];

interface CheckoutFormProps {
  medicines: Medicine[];
  cart: {[key: number]: number};
  total: number;
}

function CheckoutForm({ medicines, cart, total }: CheckoutFormProps) {
  const [orderData, setOrderData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    deliveryNotes: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    toast({
      title: "Order Placed Successfully!",
      description: `Your order of ₹${total} has been placed. You will receive a confirmation email shortly.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {Object.entries(cart).map(([medicineId, quantity]) => {
            const medicine = medicines.find(m => m.id === parseInt(medicineId));
            if (!medicine) return null;
            const price = medicine.discountPrice || medicine.price;

            return (
              <div key={medicineId} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                </div>
                <p className="font-medium">₹{price * quantity}</p>
              </div>
            );
          })}
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount:</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={orderData.fullName}
              onChange={(e) => setOrderData(prev => ({ ...prev, fullName: e.target.value }))}
              required
              data-testid="input-full-name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={orderData.email}
              onChange={(e) => setOrderData(prev => ({ ...prev, email: e.target.value }))}
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={orderData.phone}
              onChange={(e) => setOrderData(prev => ({ ...prev, phone: e.target.value }))}
              required
              data-testid="input-phone"
            />
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Delivery Address</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Textarea
              id="address"
              value={orderData.address}
              onChange={(e) => setOrderData(prev => ({ ...prev, address: e.target.value }))}
              required
              placeholder="House/Flat no., Street name, Area"
              data-testid="input-address"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={orderData.city}
                onChange={(e) => setOrderData(prev => ({ ...prev, city: e.target.value }))}
                required
                data-testid="input-city"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={orderData.state}
                onChange={(e) => setOrderData(prev => ({ ...prev, state: e.target.value }))}
                required
                data-testid="input-state"
              />
            </div>
            <div>
              <Label htmlFor="pincode">PIN Code *</Label>
              <Input
                id="pincode"
                value={orderData.pincode}
                onChange={(e) => setOrderData(prev => ({ ...prev, pincode: e.target.value }))}
                required
                data-testid="input-pincode"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
            <Textarea
              id="deliveryNotes"
              value={orderData.deliveryNotes}
              onChange={(e) => setOrderData(prev => ({ ...prev, deliveryNotes: e.target.value }))}
              placeholder="Any special instructions for delivery"
              data-testid="input-delivery-notes"
            />
          </div>
        </div>
      </div>

      {/* Payment & Place Order */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Cash on Delivery (COD)</p>
          <p className="text-xs text-muted-foreground mt-1">
            Pay when your order is delivered to your doorstep
          </p>
        </div>
        <Button type="submit" size="lg" className="w-full" data-testid="btn-place-order">
          Place Order - ₹{total}
        </Button>
      </div>
    </form>
  );
}

// Prescription Upload Modal Component
function PrescriptionUploadModal({ medicine, onUploadSuccess, isOpen, onClose }: {
  medicine: Medicine;
  onUploadSuccess: (medicineId: number, prescriptionData: any) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, JPG, PNG)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, JPG, or PNG file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please select a prescription file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const prescriptionData = {
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
        uploadDate: new Date().toISOString(),
        medicineId: medicine.id,
        medicineName: medicine.name,
        verified: true, // In real app, this would be set after verification
      };
      
      onUploadSuccess(medicine.id, prescriptionData);
      setIsUploading(false);
      setUploadedFile(null);
      onClose();
      
      toast({
        title: "Prescription uploaded successfully!",
        description: `Prescription for ${medicine.name} has been verified. You can now add it to cart.`,
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Upload Prescription
          </DialogTitle>
        </DialogHeader>
        
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Prescription Required</AlertTitle>
          <AlertDescription>
            <strong>{medicine.name}</strong> requires a valid prescription from a licensed healthcare provider.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prescription-file">Upload Prescription</Label>
            <Input
              id="prescription-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="cursor-pointer"
              data-testid="input-prescription-file"
            />
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, JPG, PNG (Max size: 5MB)
            </p>
          </div>
          
          {uploadedFile && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{uploadedFile.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-testid="btn-cancel-prescription"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!uploadedFile || isUploading}
              className="flex-1"
              data-testid="btn-upload-prescription"
            >
              {isUploading ? "Uploading..." : "Upload & Verify"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Medicine() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [prescriptions, setPrescriptions] = useState<{[key: number]: any}>({});
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
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
      <div className="mb-6">
        <BackButton />
      </div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Buy Medicine</h1>
        <p className="text-lg text-muted-foreground">
          Order medicines online with fast delivery and genuine products
        </p>
      </div>

      {/* Psychiatric Medications Showcase */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center mb-4 flex items-center justify-center">
              <Pill className="h-6 w-6 mr-2" />
              Psychiatric Medications Collection
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Comprehensive range of psychiatric medications for mental health treatment
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {medicines
                .filter(medicine => medicine.category === "Psychiatric")
                .map((medicine) => (
                  <div key={medicine.id} className="relative group">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-3">
                        <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                          <img
                            src={medicine.image}
                            alt={medicine.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          {medicine.prescription && (
                            <Badge 
                              variant="destructive" 
                              className="absolute top-1 right-1 text-xs px-1 py-0"
                            >
                              Rx
                            </Badge>
                          )}
                        </div>
                        <div className="text-center">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">{medicine.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                            {medicine.genericName}
                          </p>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <span className="text-sm font-bold text-primary">
                              ₹{medicine.discountPrice || medicine.price}
                            </span>
                            {medicine.discountPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                ₹{medicine.price}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{medicine.rating}</span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full text-xs h-7"
                            onClick={() => addToCart(medicine.id)}
                            data-testid={`btn-add-to-cart-${medicine.id}`}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Important:</strong> All psychiatric medications require a valid prescription from a licensed healthcare provider.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Licensed Pharmacists</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Prescription Verification</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Secure & Confidential</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

      <Tabs defaultValue="normal-medicine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="normal-medicine" data-testid="tab-normal-medicine">Normal Medicine</TabsTrigger>
          <TabsTrigger value="prescription-upload" data-testid="tab-prescription-upload">Prescription Upload</TabsTrigger>
          <TabsTrigger value="cart" data-testid="tab-cart">
            Cart ({getCartItemCount()})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="normal-medicine" className="space-y-6">
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
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id} className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="pb-4">
                  <div className="aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl leading-tight mb-2">{medicine.name}</CardTitle>
                      <p className="text-base text-muted-foreground mb-1">{medicine.genericName}</p>
                      <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="secondary" className="mb-2 text-sm px-3 py-1">{medicine.category}</Badge>
                      {medicine.prescription && (
                        <Badge variant="destructive" className="text-sm px-3 py-1">Rx Required</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-base font-medium ml-1">{medicine.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({medicine.reviewCount} reviews)</span>
                  </div>

                  <p className="text-base text-muted-foreground line-clamp-3">{medicine.description}</p>

                  {/* Enhanced Dosage Information */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800 dark:text-blue-300">Dosage Information</span>
                    </div>
                    <p className="text-base text-blue-700 dark:text-blue-200 font-medium">{medicine.dosage}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                      Always follow your doctor's prescription and dosage instructions
                    </p>
                  </div>

                  {/* Uses Section */}
                  <div className="space-y-2">
                    <div className="text-base">
                      <span className="font-semibold text-green-700 dark:text-green-400">Medical Uses:</span>
                      <p className="text-muted-foreground mt-1">{medicine.uses.join(", ")}</p>
                    </div>
                  </div>

                  {/* Additional Medicine Information */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Pack Size</p>
                      <p className="font-medium">10 tablets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Form</p>
                      <p className="font-medium">Tablet</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Storage</p>
                      <p className="font-medium text-xs">Store in cool, dry place</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Expiry</p>
                      <p className="font-medium text-xs">2+ years from mfg</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {medicine.discountPrice ? (
                        <>
                          <span className="text-2xl font-bold text-primary">₹{medicine.discountPrice}</span>
                          <span className="text-lg text-muted-foreground line-through">₹{medicine.price}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">₹{medicine.price}</span>
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
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[30px] text-center font-medium">{cart[medicine.id]}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(medicine.id)}
                              data-testid={`btn-increase-${medicine.id}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="lg"
                            onClick={() => addToCart(medicine.id)}
                            data-testid={`btn-add-${medicine.id}`}
                            className="px-6"
                          >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-base px-4 py-2">Out of Stock</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prescription-upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Prescription
              </CardTitle>
              <p className="text-muted-foreground">
                Upload your prescription and we'll help you order the exact medicines your doctor prescribed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload your prescription</h3>
                <p className="text-muted-foreground mb-4">
                  Supported formats: JPG, PNG, PDF (Max size: 10MB)
                </p>
                <Button className="mb-2" data-testid="btn-upload-prescription">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground">
                  Your prescription will be verified by our licensed pharmacists
                </p>
              </div>

              {/* Information Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Step 1</h4>
                    <p className="text-sm text-muted-foreground">Upload clear photo of prescription</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Step 2</h4>
                    <p className="text-sm text-muted-foreground">Our pharmacist will verify</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Step 3</h4>
                    <p className="text-sm text-muted-foreground">Add to cart and checkout</p>
                  </CardContent>
                </Card>
              </div>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Important Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Ensure the prescription is clearly visible and not blurred
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Doctor's signature and clinic stamp must be visible
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Prescription should not be older than 30 days
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      For controlled medications, original prescription may be required
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
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
                      const browseTab = document.querySelector('[data-testid="tab-normal-medicine"]') as HTMLElement;
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="lg" data-testid="btn-checkout">
                            Proceed to Checkout
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details & Address</DialogTitle>
                          </DialogHeader>
                          <CheckoutForm medicines={medicines} cart={cart} total={getCartTotal()} />
                        </DialogContent>
                      </Dialog>
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