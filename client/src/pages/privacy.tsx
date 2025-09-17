import { Lock, Shield, Eye, UserCheck, Database, Globe, FileText, Settings, AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, setLocation] = useLocation();
  
  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If opened in a new tab with no history, close the window
      // or redirect to login page as fallback
      if (window.opener) {
        window.close();
      } else {
        // Fallback: redirect to login page
        window.location.href = '/';
      }
    }
  };

  const privacyFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All your conversations and personal data are encrypted using military-grade AES-256 encryption. Only you can access your information."
    },
    {
      icon: UserCheck,
      title: "Anonymous Access",
      description: "We don't require real names or personal identifiers. You can use the platform completely anonymously if you choose."
    },
    {
      icon: Eye,
      title: "No Third-Party Tracking",
      description: "We don't use analytics trackers, advertising pixels, or any third-party services that could compromise your privacy."
    },
    {
      icon: Database,
      title: "Minimal Data Collection",
      description: "We only collect essential data needed for the service to function. No unnecessary personal information is stored."
    },
    {
      icon: Shield,
      title: "Zero-Knowledge Architecture",
      description: "Our support staff cannot access your personal conversations, diary entries, or sensitive health information."
    },
    {
      icon: Globe,
      title: "No Geographic Restrictions",
      description: "Your location data is never tracked or stored. Access the platform from anywhere without privacy concerns."
    }
  ];

  const securityMeasures = [
    {
      title: "Data Encryption",
      status: "Active",
      description: "All data is encrypted both in transit and at rest using industry-standard protocols."
    },
    {
      title: "Regular Security Audits",
      status: "Monthly",
      description: "Independent security experts regularly audit our systems for vulnerabilities."
    },
    {
      title: "Access Controls",
      status: "Strict",
      description: "Multi-factor authentication and role-based access controls protect all administrative functions."
    },
    {
      title: "Data Backup",
      status: "Encrypted",
      description: "All backups are encrypted and stored in geographically distributed secure facilities."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Lock className="h-8 w-8 text-primary" />
              Privacy & Security Details
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete transparency about how we protect your mental health data and privacy
            </p>
          </div>
        </div>

        {/* Core Promise */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Shield className="h-6 w-6 text-primary" />
              Our Privacy Promise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">No Parent Access</h4>
                  <p className="text-sm text-muted-foreground">Your parents cannot see your conversations, diary entries, or any personal data.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">No Institute Access</h4>
                  <p className="text-sm text-muted-foreground">Educational institutions have zero access to your personal mental health information.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">No Government Access</h4>
                  <p className="text-sm text-muted-foreground">Government entities cannot access your data without legal warrants and court orders.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">No Data Selling</h4>
                  <p className="text-sm text-muted-foreground">We never sell, rent, or monetize your personal data in any way.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-primary" />
              Privacy Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {privacyFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card/50">
                    <IconComponent className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Security Measures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              Security Measures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityMeasures.map((measure, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                  <div>
                    <h4 className="font-semibold text-foreground">{measure.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{measure.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {measure.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Usage */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                What We Store
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Email (for login)</span>
                  <Badge variant="outline">Required</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Encrypted chat messages</span>
                  <Badge variant="outline">Encrypted</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Anonymous usage analytics</span>
                  <Badge variant="outline">Anonymous</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Personal diary entries</span>
                  <Badge variant="outline">Encrypted</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                What We Don't Store
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Real names or personal identifiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Location or GPS data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Device information or fingerprints</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Third-party tracking cookies</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              Your Data Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-1">Right to Access</h4>
                  <p className="text-sm text-muted-foreground">Download all your data in a portable format anytime.</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-1">Right to Delete</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-1">Right to Correct</h4>
                  <p className="text-sm text-muted-foreground">Update or correct any information in your profile.</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-1">Right to Portability</h4>
                  <p className="text-sm text-muted-foreground">Transfer your data to another service if desired.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              Privacy Questions & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have any questions about our privacy practices or need to exercise your data rights, 
              please contact our privacy team:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-semibold">Privacy Officer</p>
                <p className="text-sm text-muted-foreground">privacy@apnamann.com</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-semibold">Response Time</p>
                <p className="text-sm text-muted-foreground">Within 48 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg">
          Last updated: September 17, 2025 | Version 2.1
        </div>
      </div>
    </div>
  );
}