import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2 
} from "lucide-react";

interface PaymentDetails {
  doctorName: string;
  consultationType: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
}

interface ConsultationPaymentProps {
  paymentDetails: PaymentDetails;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentCancel: () => void;
}

interface PaymentFormProps {
  paymentDetails: PaymentDetails;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentCancel: () => void;
}

const PaymentForm = ({ paymentDetails, onPaymentSuccess, onPaymentCancel }: PaymentFormProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "succeeded" | "failed">("idle");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for demo
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardHolder) {
      toast({
        title: "Payment Error",
        description: "Please fill in all payment details.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    // Simulate payment processing for frontend-only implementation
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      const mockPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setPaymentStatus("succeeded");
      toast({
        title: "Payment Successful",
        description: "Your consultation has been booked successfully!",
      });
      
      setTimeout(() => {
        onPaymentSuccess(mockPaymentIntentId);
      }, 1500);
      
    } catch (error) {
      setPaymentStatus("failed");
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (paymentStatus === "succeeded") {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground">Your consultation has been booked successfully.</p>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
        <p className="text-muted-foreground mb-4">There was an error processing your payment.</p>
        <Button onClick={() => setPaymentStatus("idle")} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Payment Information</h3>
        </div>
        
        {/* Payment Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardHolder">Cardholder Name</Label>
            <Input
              id="cardHolder"
              placeholder="John Doe"
              value={cardDetails.cardHolder}
              onChange={(e) => setCardDetails(prev => ({ ...prev, cardHolder: e.target.value }))}
              data-testid="input-card-holder"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                if (value.length <= 19) {
                  setCardDetails(prev => ({ ...prev, cardNumber: value }));
                }
              }}
              data-testid="input-card-number"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
                  if (value.length <= 5) {
                    setCardDetails(prev => ({ ...prev, expiryDate: value }));
                  }
                }}
                data-testid="input-expiry-date"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 3) {
                    setCardDetails(prev => ({ ...prev, cvv: value }));
                  }
                }}
                data-testid="input-cvv"
              />
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-4">
            <Shield className="h-3 w-3" />
            This is a demo payment form. No actual payment will be processed.
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <Lock className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-700 dark:text-green-300">
          Your payment information is secured with 256-bit SSL encryption
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={onPaymentCancel}
          className="flex-1"
          disabled={isProcessing}
          data-testid="button-cancel-payment"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="flex-1"
          disabled={isProcessing}
          data-testid="button-confirm-payment"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Pay ₹{paymentDetails.amount}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default function ConsultationPayment({ paymentDetails, onPaymentSuccess, onPaymentCancel }: ConsultationPaymentProps) {
  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Doctor</span>
              <span className="font-medium">{paymentDetails.doctorName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Consultation Type</span>
              <Badge variant="secondary">{paymentDetails.consultationType}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date & Time</span>
              <span className="font-medium">{paymentDetails.date} at {paymentDetails.time}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount</span>
              <span className="text-primary">₹{paymentDetails.amount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardContent className="pt-6">
          <PaymentForm 
            paymentDetails={paymentDetails}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentCancel={onPaymentCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}