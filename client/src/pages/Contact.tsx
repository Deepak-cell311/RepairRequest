import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone, Clock, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function Contact() {
  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    inquiry: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    // Basic validation
    if (!form.firstName || !form.lastName || !form.email || !form.organization || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("Response: ", res)
      if (res.ok) {
        setSuccess("Your message has been sent! Someone will be in touch with you shortly.");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          organization: "",
          inquiry: "",
          message: "",
        });
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.log("Error message: ", err)
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

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
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
                  Login to Portal
                </Button>
              </Link>
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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get in
            <span className="text-blue-600 block">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ready to transform your maintenance management? We'd love to hear from you and discuss how RepairRequest can help your organization.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Office Address</h3>
                    <p className="text-gray-600">
                      SchoolHouse Logistics<br />
                      123 Business Drive<br />
                      Suite 100<br />
                      Fort Myers, FL 33901
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@schoolhouselogistics.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">Sales: 407-494-5230</p>
                    <p className="text-gray-600">Support: 407-494-5230</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM EST</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Need Immediate Support?</h3>
                <p className="text-gray-600 mb-4">
                  If you're an existing customer with an urgent issue, please log into your portal.
                </p>
                <Link to="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Access Portal
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="John" required value={form.firstName} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Doe" required value={form.lastName} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required value={form.email} onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="(555) 123-4567" value={form.phone} onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization *</Label>
                      <Input id="organization" placeholder="Your organization name" required value={form.organization} onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="inquiry">Inquiry Type</Label>
                      <select
                        id="inquiry"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.inquiry}
                        onChange={handleChange}
                      >
                        <option value="">Select an option</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="demo">Request Demo</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe how we can help you..."
                        rows={5}
                        required
                        value={form.message}
                        onChange={handleChange}
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-600 text-sm text-center">{success}</p>}
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                    <p className="text-sm text-gray-500 text-center">
                      * Required fields
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Talk to Our Sales Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Schedule a personalized demo and see how RepairRequest can transform your maintenance operations
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <Card>
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule a Call</h3>
                  <p className="text-gray-600 text-sm">
                    Book a 30-minute consultation with our sales team
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Demo</h3>
                  <p className="text-gray-600 text-sm">
                    See RepairRequest in action with a personalized demonstration
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Quote</h3>
                  <p className="text-gray-600 text-sm">
                    Get a tailored pricing proposal for your organization
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Link to="/">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Schedule Demo
                </Button>
              </Link>
            </div>
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
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
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