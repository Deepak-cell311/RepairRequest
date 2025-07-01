import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import logoPath from "@assets/RepairRequest Logo Transparent_1750783382845.png";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src={logoPath} alt="RepairRequest Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">RepairRequest</h1>
                <p className="text-sm text-gray-600">by SchoolHouse Logistics</p>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/landing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">
                FAQ
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
                Support
              </Link>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
                  Login to Portal
                </Button>
              </Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Login to Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Privacy
            <span className="text-blue-600 block">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            
            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <p className="text-gray-600">
                    We collect information you provide directly to us, such as when you create an account, submit repair requests, or contact us for support. This includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>Name and email address (via Google OAuth)</li>
                    <li>Organization affiliation</li>
                    <li>Maintenance request details and photos</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Automatically Collected Information</h4>
                  <p className="text-gray-600">
                    We automatically collect certain information about your device and usage of our service, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>IP address and browser type</li>
                    <li>Pages visited and features used</li>
                    <li>Date and time of access</li>
                    <li>Device information</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and manage maintenance requests</li>
                  <li>Send notifications about request status updates</li>
                  <li>Provide customer support</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                  <li>Generate analytics to improve our service</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Within Your Organization</h4>
                  <p className="text-gray-600">
                    Information you submit is shared with authorized users within your organization, including administrators and maintenance staff, as necessary to fulfill repair requests.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                  <p className="text-gray-600">
                    We may share information with third-party service providers who assist us in operating our platform, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>Cloud hosting providers (for data storage)</li>
                    <li>Email service providers (for notifications)</li>
                    <li>Authentication providers (Google OAuth)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                  <p className="text-gray-600">
                    We may disclose information if required by law or if we believe disclosure is necessary to protect our rights, property, or safety, or that of our users or the public.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication via Google OAuth</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and user permission management</li>
                  <li>Secure data centers and infrastructure</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Maintenance request data is typically retained for operational and compliance purposes. When you delete your account, we will delete or anonymize your personal information, except where retention is required by law.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Deletion of your personal information</li>
                  <li>Portability of your data</li>
                  <li>Opt-out of certain communications</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  To exercise these rights, please contact us at privacy@schoolhouselogistics.com.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We use cookies and similar tracking technologies to provide and improve our services. Cookies help us remember your preferences, maintain your session, and analyze usage patterns. You can control cookie settings through your browser, though disabling cookies may affect the functionality of our service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our service integrates with third-party services, including Google for authentication. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of third-party services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our service after such changes constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                </p>
                <div className="mt-4 text-gray-600">
                  <p>Email: privacy@schoolhouselogistics.com</p>
                  <p>Address: SchoolHouse Logistics, 123 Business Drive, Suite 100, Fort Myers, FL 33901</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/landing">
                <div className="flex items-center space-x-3 mb-4 cursor-pointer">
                  <img src={logoPath} alt="RepairRequest Logo" className="w-8 h-8" />
                  <div>
                    <h3 className="text-lg font-bold">RepairRequest</h3>
                    <p className="text-sm text-gray-400">by SchoolHouse Logistics</p>
                  </div>
                </div>
              </Link>
              <p className="text-gray-400">
                Streamlining maintenance management for property managers and organizations across all industries.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Portal Login</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RepairRequest by SchoolHouse Logistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}