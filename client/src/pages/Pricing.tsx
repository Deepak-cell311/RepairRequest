import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Pricing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
              <Link to="/pricing" className="text-blue-600 font-medium">
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
      </header>

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

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your organization. All plans include our
            core facility management features with no hidden fees or setup
            costs.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Professional Plan */}
            <Card className="border-2 border-blue-500 relative p-8">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1">
                Most Popular
              </Badge>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Professional
                </CardTitle>
                <div className="mt-6 flex justify-center items-center">
                  <span className="text-[1.8rem] sm:text-2xl font-bold text-blue-600">
                    $1,000 - $12,000
                  </span>
                  <span className="text-gray-600 block mt-1">&nbsp;/ per year</span>
                </div>
                <p className="text-gray-600 mt-4">
                  Annual subscription with full setup and support
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Pricing based on organization size
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Complete initial setup and implementation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>12 months of ongoing support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Regular updates and maintenance</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Unlimited repair and facility requests</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Photo attachments and documentation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Email notifications and alerts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Request tracking and status updates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Multi-building and facility management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Role-based access control</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Reporting and analytics dashboard</span>
                  </li>
                </ul>
                <Link to="https://calendly.com/schoolhouselogistics/30min">
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200 relative p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Enterprise
                </CardTitle>
                <div className="mt-6">
                  <span className="text-3xl font-bold text-gray-900">
                    Custom
                  </span>
                  {/* <span className="text-gray-600 block mt-1">/contact us</span> */}
                </div>
                <p className="text-gray-600 mt-4">
                  For large organizations with complex needs
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Unlimited members and buildings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Full white-label solution</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Advanced analytics and reporting</span>
                  </li>
                </ul>
                <Link to="/contact">
                  <Button
                    className="w-full mt-8 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                    variant="outline"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Professional Plan Pricing Breakdown */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Professional Plan Pricing Breakdown
              </h2>
              <p className="text-gray-600">
                Annual subscription pricing based on organization size
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Small Organizations */}
              <Card className="border border-gray-200 text-center p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Small Organizations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-[1.4rem] font-bold text-blue-600 mb-2">
                    $1,000 - $2,500
                  </div>
                  <p className="text-gray-600">per year</p>
                </CardContent>
              </Card>

              {/* Medium Organizations */}
              <Card className="border-2 border-blue-500 text-center p-6 relative">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Medium Organizations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-[1.4rem] font-bold text-blue-600 mb-2">
                    $2,500 - $6,000
                  </div>
                  <p className="text-gray-600">per year</p>
                </CardContent>
              </Card>

              {/* Large Organizations */}
              <Card className="border border-gray-200 text-center p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Large Organizations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-[1.34rem] font-bold text-blue-600 mb-2">
                    $6,000 - $12,000
                  </div>
                  <p className="text-gray-600">per year</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600">
                All Professional plans include setup, implementation, training,
                and 12 months of support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>


          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>How is pricing determined?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our Professional plan pricing is based on your organization's
                  size, ranging from $1,000 to $12,000 annually. Small
                  organizations pay $1,000-$2,500, medium organizations pay
                  $2,500-$6,000, and large organizations pay $6,000-$12,000.
                  This includes complete setup, implementation, training, and 12
                  months of ongoing support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's included in the Professional plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Professional plans include unlimited repair and facility
                  requests, photo attachments, email notifications, request
                  tracking, multi-building management, role-based access
                  control, reporting dashboard, complete setup and
                  implementation, 12 months of ongoing support, and regular
                  updates with no hidden fees.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What kind of support do you provide?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Professional plans include comprehensive setup,
                  implementation, training, and 12 months of ongoing support.
                  Enterprise customers receive dedicated support representatives
                  and custom implementation assistance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Can I customize RepairRequest for my organization?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Professional plans include standard customization and
                  branding. Enterprise plans offer full white-label solutions,
                  unlimited customization, and advanced analytics tailored to
                  your organization's specific needs.
                </p>
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
              <Link to="/landing">
                <div className="flex items-center space-x-3 mb-4 cursor-pointer">
                  <img src="/RepairRequest Logo Transparent_1750783382845.png" alt="RepairRequest Logo" className="w-8 h-8" />
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
      </footer>
    </div>
  );
}

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle, Menu, X } from "lucide-react";
// import { Link } from "wouter";
// import { useState } from "react";


// export default function Pricing() {

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-3">
//               <img
//                 src="/RepairRequest Logo Transparent_1750783382845.png"
//                 alt="RepairRequest Logo"
//                 className="w-10 h-10"
//               />
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">
//                   RepairRequest
//                 </h1>
//                 <p className="text-sm text-gray-600">
//                   by SchoolHouse Logistics
//                 </p>
//               </div>
//             </div>

//             {/* Navigation Menu */}
//             <nav className="hidden md:flex items-center space-x-6">
//               <Link
//                 href="/"
//                 className="text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 Home
//               </Link>
//               <Link href="/pricing" className="text-blue-600 font-medium">
//                 Pricing
//               </Link>
//               <Link
//                 href="/faq"
//                 className="text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 FAQ
//               </Link>
//               <Link
//                 href="/support"
//                 className="text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 Support
//               </Link>
//               <Link href="/login">
//                 <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
//                   Login to Portal
//                 </Button>
//               </Link>
//             </nav>

//             {/* Mobile Menu Button */}
//             <div className="md:hidden">
//               <button
//                 onClick={() => setMobileMenuOpen(true)}
//                 className="p-2 rounded-md text-blue-600 hover:bg-blue-100"
//                 aria-label="Open menu"
//               >
//                 <Menu size={28} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>


//       {/* Mobile Menu Drawer */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
//           <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col space-y-4">
//             <button
//               onClick={() => setMobileMenuOpen(false)}
//               className="self-end text-gray-500 hover:text-blue-600 text-2xl"
//               aria-label="Close menu"
//             >
//               ×
//             </button>
//             <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-lg">Home</Link>
//             <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-lg">Pricing</Link>
//             <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-lg">FAQ</Link>
//             <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-lg">Support</Link>
//             <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
//               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Login to Portal</Button>
//             </Link>
//           </div>
//         </div>
//       )}

//       {/* Hero Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
//             Choose the perfect plan for your organization. All plans include our
//             core facility management features with no hidden fees or setup
//             costs.
//           </p>
//         </div>
//       </section>

//       {/* Pricing Cards */}
//       <section className="py-20 bg-white">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//             {/* Professional Plan */}
//             <Card className="border-2 border-blue-500 relative p-8">
//               <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1">
//                 Most Popular
//               </Badge>
//               <CardHeader className="text-center pb-6">
//                 <CardTitle className="text-3xl font-bold text-gray-900">
//                   Professional
//                 </CardTitle>
//                 <div className="mt-6">
//                   <span className="text-4xl font-bold text-blue-600">
//                     $1,000 - $12,000
//                   </span>
//                   <span className="text-gray-600 block mt-1">/per year</span>
//                 </div>
//                 <p className="text-gray-600 mt-4">
//                   Annual subscription with full setup and support
//                 </p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Pricing based on organization size
//                 </p>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <ul className="space-y-4">
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Complete initial setup and implementation</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>12 months of ongoing support</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Regular updates and maintenance</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Unlimited repair and facility requests</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Photo attachments and documentation</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Email notifications and alerts</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Request tracking and status updates</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Multi-building and facility management</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Role-based access control</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Reporting and analytics dashboard</span>
//                   </li>
//                 </ul>
//                 <Link to="https://calendly.com/schoolhouselogistics/30min">
//                   <Button className="w-full mt-6" variant="outline">
//                     Get Started
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             {/* Enterprise Plan */}
//             <Card className="border-2 border-gray-200 relative p-8">
//               <CardHeader className="text-center pb-6">
//                 <CardTitle className="text-3xl font-bold text-gray-900">
//                   Enterprise
//                 </CardTitle>
//                 <div className="mt-6">
//                   <span className="text-4xl font-bold text-gray-900">
//                     Custom
//                   </span>
//                   {/* <span className="text-gray-600 block mt-1">/contact us</span> */}
//                 </div>
//                 <p className="text-gray-600 mt-4">
//                   For large organizations with complex needs
//                 </p>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <ul className="space-y-4">
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Everything in Professional</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Unlimited members and buildings</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Full white-label solution</span>
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                     <span>Advanced analytics and reporting</span>
//                   </li>
//                 </ul>
//                 <Button
//                   className="w-full mt-8 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
//                   variant="outline"
//                 >
//                   Contact Sales
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Professional Plan Pricing Breakdown */}
//           <div className="mt-16 max-w-4xl mx-auto">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                 Professional Plan Pricing Breakdown
//               </h2>
//               <p className="text-gray-600">
//                 Annual subscription pricing based on organization size
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {/* Small Organizations */}
//               <Card className="border border-gray-200 text-center p-6">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-xl font-semibold text-gray-900">
//                     Small Organizations
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-blue-600 mb-2">
//                     $1,000 - $2,500
//                   </div>
//                   <p className="text-gray-600">per year</p>
//                 </CardContent>
//               </Card>

//               {/* Medium Organizations */}
//               <Card className="border-2 border-blue-500 text-center p-6 relative">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-xl font-semibold text-gray-900">
//                     Medium Organizations
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-blue-600 mb-2">
//                     $2,500 - $6,000
//                   </div>
//                   <p className="text-gray-600">per year</p>
//                 </CardContent>
//               </Card>

//               {/* Large Organizations */}
//               <Card className="border border-gray-200 text-center p-6">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-xl font-semibold text-gray-900">
//                     Large Organizations
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-blue-600 mb-2">
//                     $6,000 - $12,000
//                   </div>
//                   <p className="text-gray-600">per year</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="text-center mt-8">
//               <p className="text-gray-600">
//                 All Professional plans include setup, implementation, training,
//                 and 12 months of support
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Frequently Asked Questions
//             </h2>
//           </div>

//           <div className="space-y-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>How is pricing determined?</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-600">
//                   Our Professional plan pricing is based on your organization's
//                   size, ranging from $1,000 to $12,000 annually. Small
//                   organizations pay $1,000-$2,500, medium organizations pay
//                   $2,500-$6,000, and large organizations pay $6,000-$12,000.
//                   This includes complete setup, implementation, training, and 12
//                   months of ongoing support.
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>What's included in the Professional plan?</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-600">
//                   Professional plans include unlimited repair and facility
//                   requests, photo attachments, email notifications, request
//                   tracking, multi-building management, role-based access
//                   control, reporting dashboard, complete setup and
//                   implementation, 12 months of ongoing support, and regular
//                   updates with no hidden fees.
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>What kind of support do you provide?</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-600">
//                   Professional plans include comprehensive setup,
//                   implementation, training, and 12 months of ongoing support.
//                   Enterprise customers receive dedicated support representatives
//                   and custom implementation assistance.
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>
//                   Can I customize RepairRequest for my organization?
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-600">
//                   Professional plans include standard customization and
//                   branding. Enterprise plans offer full white-label solutions,
//                   unlimited customization, and advanced analytics tailored to
//                   your organization's specific needs.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div>
//               <Link href="/landing">
//                 <div className="flex items-center space-x-3 mb-4 cursor-pointer">
//                   <img
//                     src="/RepairRequest Logo Transparent_1750783382845.png"
//                     alt="RepairRequest Logo"
//                     className="w-8 h-8"
//                   />
//                   <div>
//                     <h3 className="text-lg font-bold">RepairRequest</h3>
//                     <p className="text-sm text-gray-400">
//                       by SchoolHouse Logistics
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//               <p className="text-gray-400">
//                 Streamlining maintenance management for property managers and
//                 organizations across all industries.
//               </p>
//             </div>

//             <div>
//               <h4 className="text-lg font-semibold mb-4">Platform</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li>
//                   <Link href="/" className="hover:text-white transition-colors">
//                     Portal Login
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/pricing"
//                     className="hover:text-white transition-colors"
//                   >
//                     Pricing
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/support"
//                     className="hover:text-white transition-colors"
//                   >
//                     Support
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="text-lg font-semibold mb-4">Company</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li>
//                   <Link
//                     href="/about"
//                     className="hover:text-white transition-colors"
//                   >
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/contact"
//                     className="hover:text-white transition-colors"
//                   >
//                     Contact
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/privacy"
//                     className="hover:text-white transition-colors"
//                   >
//                     Privacy
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/terms"
//                     className="hover:text-white transition-colors"
//                   >
//                     Terms
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//             <p>
//               &copy; 2024 RepairRequest by SchoolHouse Logistics. All rights
//               reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }