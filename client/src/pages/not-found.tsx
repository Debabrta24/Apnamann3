import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import logoUrl from '@/assets/logo.png';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-4">
            <img src={logoUrl} alt="ApnaMann Logo" className="w-10 h-10 rounded-lg object-cover" data-testid="img-logo-404" />
          </div>
          <div className="flex mb-4 gap-2 justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
