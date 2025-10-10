import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Shield, Database, Globe, Lock } from 'lucide-react';

interface TermsAndConditionsProps {
  onAccept: () => void;
  onDecline: () => void;
  accepted: boolean;
  onCheckChange: (checked: boolean) => void;
}

export const TermsAndConditions = ({ onAccept, onDecline, accepted, onCheckChange }: TermsAndConditionsProps) => {
  return (
    <Card className="max-w-4xl mx-auto border-0 shadow-dialog">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Shield className="h-6 w-6 text-primary" />
          Terms & Conditions - Global Health Data Initiative
        </CardTitle>
        <CardDescription>
          Please review and accept our terms to contribute to global healthcare improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                1. Data Collection & Usage
              </h3>
              <p className="text-muted-foreground mb-2">
                By using Nix AI Healthcare, you agree to contribute anonymized health data to improve global healthcare outcomes:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Your age group classification helps us understand demographic health patterns</li>
                <li>Health metrics (vitals, symptoms, wellbeing scores) are anonymized and aggregated</li>
                <li>Personal identifiers (name, email, specific location) are never shared in aggregated data</li>
                <li>Data is used for disease surveillance, outbreak detection, and healthcare research</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent" />
                2. Global Health Contribution
              </h3>
              <p className="text-muted-foreground mb-2">
                Your anonymized data contributes to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>WHO and global health organizations for disease tracking</li>
                <li>Healthcare providers and hospitals for better treatment protocols</li>
                <li>Research institutions studying health trends and patterns</li>
                <li>Government health agencies for public health policy</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Lock className="h-5 w-5 text-warning" />
                3. Privacy & Security
              </h3>
              <p className="text-muted-foreground mb-2">
                We are committed to protecting your privacy:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>All data is encrypted in transit and at rest</li>
                <li>Personal health information is only visible to you and authorized healthcare providers</li>
                <li>Aggregated data exports contain no personally identifiable information</li>
                <li>You can request data deletion at any time through your account settings</li>
                <li>We comply with HIPAA, GDPR, and international health data regulations</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">4. Hospital & Healthcare Provider Access</h3>
              <p className="text-muted-foreground mb-2">
                Authorized healthcare facilities can:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>View aggregated, anonymized patient statistics for their facility</li>
                <li>Access individual patient records only with explicit patient consent</li>
                <li>Export anonymized data for research and quality improvement</li>
                <li>Contribute to disease surveillance and outbreak detection</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">5. Your Rights</h3>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Right to access your personal health data</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your account and data</li>
                <li>Right to opt-out of data aggregation (may limit features)</li>
                <li>Right to revoke healthcare provider access at any time</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">6. Consent</h3>
              <p className="text-muted-foreground">
                By accepting these terms, you consent to the collection, processing, and anonymized sharing of your health data as described above. You acknowledge that your participation helps improve healthcare globally while maintaining your privacy and security.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2 p-4 bg-secondary/50 rounded-lg">
          <Checkbox 
            id="terms" 
            checked={accepted}
            onCheckedChange={onCheckChange}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and accept the Terms & Conditions and consent to contribute to global health data initiatives
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button 
            onClick={onAccept} 
            disabled={!accepted}
            variant="medical"
          >
            Accept & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};