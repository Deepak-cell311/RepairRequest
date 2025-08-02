// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Eye, EyeOff, Loader2 } from 'lucide-react';

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [token, setToken] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   useEffect(() => {
//     // Get token and email from URL parameters
//     const urlToken = searchParams.get('token');
//     const urlEmail = searchParams.get('email');
    
//     if (urlToken && urlEmail) {
//       setToken(urlToken);
//       setEmail(decodeURIComponent(urlEmail));
//     } else {
//       setMessage({ type: 'error', text: 'Invalid reset link. Please request a new password reset.' });
//     }
//   }, [searchParams]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!token || !email) {
//       setMessage({ type: 'error', text: 'Invalid reset link. Please request a new password reset.' });
//       return;
//     }

//     if (newPassword.length < 8) {
//       setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setMessage({ type: 'error', text: 'Passwords do not match.' });
//       return;
//     }

//     setIsLoading(true);
//     setMessage(null);

//     try {
//       const response = await fetch('/api/reset-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           token,
//           email,
//           newPassword,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
//         setTimeout(() => {
//           navigate('/login');
//         }, 2000);
//       } else {
//         setMessage({ type: 'error', text: data.error?.message || 'Failed to reset password. Please try again.' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!token || !email) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-center text-red-600">Invalid Reset Link</CardTitle>
//             <CardDescription className="text-center">
//               The password reset link is invalid or has expired.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button 
//               onClick={() => navigate('/forgot-password')} 
//               className="w-full"
//             >
//               Request New Reset Link
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-center">Reset Your Password</CardTitle>
//           <CardDescription className="text-center">
//             Enter your new password below
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {message && (
//               <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
//                 <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
//                   {message.text}
//                 </AlertDescription>
//               </Alert>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 disabled
//                 className="bg-gray-50"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="newPassword">New Password</Label>
//               <div className="relative">
//                 <Input
//                   id="newPassword"
//                   type={showPassword ? 'text' : 'password'}
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   placeholder="Enter new password"
//                   required
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm New Password</Label>
//               <div className="relative">
//                 <Input
//                   id="confirmPassword"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm new password"
//                   required
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>

//             <Button 
//               type="submit" 
//               className="w-full" 
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Resetting Password...
//                 </>
//               ) : (
//                 'Reset Password'
//               )}
//             </Button>

//             <div className="text-center">
//               <Button
//                 type="button"
//                 variant="link"
//                 onClick={() => navigate('/login')}
//                 className="text-sm"
//               >
//                 Back to Login
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ResetPassword; 

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft, Lock, Mail } from "lucide-react"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    // Get token and email from URL parameters
    const urlToken = searchParams.get("token")
    const urlEmail = searchParams.get("email")

    if (urlToken && urlEmail) {
      setToken(urlToken)
      setEmail(decodeURIComponent(urlEmail))
    } else {
      setMessage({ type: "error", text: "Invalid reset link. Please request a new password reset." })
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !email) {
      setMessage({ type: "error", text: "Invalid reset link. Please request a new password reset." })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Password reset successfully! Redirecting to login..." })
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setMessage({ type: "error", text: data.error?.message || "Failed to reset password. Please try again." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please check your connection and try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-semibold text-gray-900">Repair Request</span>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h1>
            <p className="text-gray-600 mb-6">The password reset link is invalid or has expired.</p>
            <Button
              onClick={() => navigate("/forgot-password")}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Request New Reset Link
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full flex">
        {/* Left Panel - Reset Password Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-semibold text-gray-900">Repair Request</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
            <p className="text-gray-600 text-sm">Enter your new password below to regain access to your account.</p>
          </div>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit}>
            {/* Error/Success Messages */}
            {message && (
              <div
                className={`text-sm mb-4 p-3 rounded-lg ${
                  message.type === "error"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-green-50 text-green-600 border border-green-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Email Input (Disabled) */}
            <div className="mb-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  disabled
                  className="pl-10 h-12 border-gray-200 bg-gray-50"
                />
              </div>
            </div>

            {/* New Password Input */}
            <div className="mb-6">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Back to Login */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Back to login</span>
              </button>
            </div>

            {/* Reset Password Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium mb-6"
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>

          {/* Additional Help */}
          <div className="text-center text-sm text-gray-600">
            Need help?{" "}
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Request new reset link
            </button>
          </div>
        </div>

        {/* Right Panel - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600"></div>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-white"></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 rounded-full bg-white"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center text-white p-12 text-center">
            <div className="mb-8 relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-12 h-12 text-white" />
              </div>
            </div>
            {/* Text Content */}
            <h1 className="text-3xl font-extrabold mb-4 leading-tight">Secure Reset</h1>
            <p className="text-lg text-white/80">
              Create a strong new password to keep your account secure and protected.
            </p>
            <div className="flex gap-2 mt-8">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
