import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read PlanEro's terms and conditions for using our event planning platform.",
  robots: {
    index: true,
    follow: true,
  },
};

// Force static generation
export const dynamic = 'force-static';

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using PlanEro's platform, you agree to be bound by these Terms and
              Conditions. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              To use PlanEro's services, you must be at least 18 years old or have reached the age of
              majority in your jurisdiction. By using our platform, you represent and warrant that you
              meet this eligibility requirement.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For vendors joining our platform, you must possess all necessary licenses, permits, and
              insurance required to operate your business legally in your jurisdiction.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              When creating an account with PlanEro, you must provide accurate, complete, and current
              information. You are responsible for maintaining the confidentiality of your account
              credentials and for all activities that occur under your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Vendor Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              PlanEro acts as a marketplace connecting customers with vendors. We are not responsible
              for the quality, safety, or legality of services provided by vendors. All transactions and
              agreements are between the customer and the vendor.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Vendors agree to provide accurate information about their services, pricing, and
              availability. Vendors must honor all bookings made through the platform and maintain
              professional standards at all times.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Payments and Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              All prices are displayed in Indian Rupees (₹). Payment terms are established between
              customers and vendors. PlanEro may charge service fees or commissions as disclosed at the
              time of booking.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Refund policies vary by vendor. Please review each vendor's cancellation and refund policy
              before making a booking.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              All content on PlanEro, including but not limited to text, images, logos, and software, is
              the property of PlanEro or its content suppliers and is protected by intellectual property
              laws.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              PlanEro shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of or inability to use our services. Our total
              liability shall not exceed the amount paid by you for the services in question.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Any disputes arising from these terms or your use of PlanEro shall be resolved through
              arbitration in accordance with the laws of India. The venue for arbitration shall be in
              [Your City], India.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Your use of PlanEro is also governed by our Privacy Policy. We collect, use, and protect
              your personal information in accordance with applicable data protection laws.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>10. Modifications to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              PlanEro reserves the right to modify these Terms and Conditions at any time. We will
              notify users of any material changes via email or through the platform. Your continued use
              of our services after such modifications constitutes acceptance of the updated terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="text-muted-foreground">
              <p>Email: legal@planero.com</p>
              <p>Phone: +91 XXX XXX XXXX</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
