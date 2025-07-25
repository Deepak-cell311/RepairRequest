import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Clock, Shield, Mail, Building2, BarChart3, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function LandingPage() {
  const [showVideo, setShowVideo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleVideoEnd = () => {
    setShowVideo(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src="/RepairRequest Logo Transparent_1750783382845.png" alt="RepairRequest Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">RepairRequest</h1>
                <p className="text-sm text-gray-600">by SchoolHouse Logistics</p>
              </div>
            </div>
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">
                FAQ
              </Link>
              <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
                Support
              </Link>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
                <Link to="/login">
                  Login to Portal
                </Link>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md text-blue-600 hover:bg-blue-100"
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header >

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
          <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col space-y-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="self-end text-gray-500 hover:text-blue-600 text-2xl"
              aria-label="Close menu"
            >
              ×
            </button>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-lg">Home</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-lg">Pricing</Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-lg">FAQ</Link>
            <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-lg">Support</Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Login to Portal</Button>
            </Link>
          </div>
        </div>
      )}

    {/* Hero Section */ }
    < section className = "py-20 px-4 sm:px-6 lg:px-8" >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
              Trusted by Property Managers Nationwide
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your
              <span className="text-blue-600 block">Maintenance Requests</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              RepairRequest is the comprehensive maintenance management platform for property managers, facility teams, and organizations. From schools to commercial real estate, track and resolve facility issues with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started Today
                </Button>
              </Link>
              <a href="https://calendly.com/schoolhouselogistics" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </a>
            </div>
          </div>

          {/* Right Video */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl shadow-2xl overflow-hidden">
              {showVideo ? (
                <video
                  src="/RepairRequest Standard.mp4"
                  controls
                  autoPlay
                  className="w-full h-full"
                  onEnded={handleVideoEnd}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center bg-gray-900 relative cursor-pointer"
                  onClick={() => setShowVideo(true)}
                >
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-blue-700 transition-colors">
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">See RepairRequest in Action</h3>
                    <p className="text-gray-300 text-sm">Watch how easy it is to manage maintenance requests</p>
                  </div>

                  {/* Video overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
      </section >

    {/* Features Section */ }
    < section className = "py-20 bg-white" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose RepairRequest?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Designed for property managers, facility teams, and organizations across all industries - from schools to commercial real estate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Multi-Building Support</CardTitle>
              <CardDescription>
                Manage maintenance across multiple buildings and facilities from a single platform.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Secure access controls for requesters, maintenance staff, and administrators.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Real-Time Tracking</CardTitle>
              <CardDescription>
                Track request status, assignments, and completion times in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Automated email updates keep everyone informed throughout the repair process.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Priority Management</CardTitle>
              <CardDescription>
                Set and manage priority levels to ensure critical issues are addressed first.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Analytics & Reporting</CardTitle>
              <CardDescription>
                Comprehensive reporting tools to track performance and identify trends.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
      </section >

    {/* Industries Section */ }
    < section className = "py-20 bg-gray-50" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted Across Industries
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            RepairRequest serves diverse property management needs across multiple sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Institutions</h3>
              <p className="text-gray-600 text-sm">Schools, universities, and educational facilities</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Commercial Real Estate</h3>
              <p className="text-gray-600 text-sm">Office buildings, retail spaces, and commercial properties</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Residential Communities</h3>
              <p className="text-gray-600 text-sm">HOAs, apartment complexes, and residential properties</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Management</h3>
              <p className="text-gray-600 text-sm">Professional property management companies</p>
            </CardContent>
          </Card>
        </div>
      </div>
      </section >

    {/* Benefits Section */ }
    < section className = "py-20 bg-white" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Modern Property Management
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              RepairRequest understands the unique challenges of maintaining facilities across different industries. Our platform adapts to your specific needs while ensuring efficient operations.
            </p>

            <div className="space-y-4">
              {[
                "Reduce response times for critical repairs",
                "Improve communication between staff and maintenance",
                "Maintain detailed records for compliance and reporting",
                "Streamline budget planning with comprehensive analytics",
                "Enhance safety through proactive maintenance tracking"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Join organizations across industries already using RepairRequest to streamline their maintenance operations.
            </p>
            <Link to="/signup">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                Access Your Portal
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Contact your administrator for access credentials
            </p>
          </div>
        </div>
      </div>
      </section >

    {/* Footer */ }
    < footer className = "bg-gray-900 text-white py-12" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/RepairRequest Logo Transparent_1750783382845.png" alt="RepairRequest Logo" className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-bold">RepairRequest</h3>
                <p className="text-sm text-gray-400">by SchoolHouse Logistics</p>
              </div>
            </div>
            <p className="text-gray-400">
              Streamlining maintenance management for property managers and organizations across all industries.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 RepairRequest by SchoolHouse Logistics. All rights reserved.</p>
        </div>
      </div>
      </footer >
    </div >
  );
}