"use client"

import { useState } from "react"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Chrome, Mail, Lock, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { sendVerificationCode, verifyCode } from "@/lib/email-verification"
import { logActivity } from "@/lib/activity-logger"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCodeInput, setVerificationCodeInput] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [sentCode, setSentCode] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSendCode = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const code = await sendVerificationCode(email)
      setSentCode(code)
      setShowVerification(true)
      toast({
        title: "Verification Code Sent",
        description: `Code sent to ${email}. Check your console for demo purposes: ${code}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (isSignUp: boolean) => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (!showVerification) {
      await handleSendCode()
      return
    }

    // Verify the code first
    const isValidCode = await verifyCode(email, verificationCodeInput)
    if (!isValidCode) {
      toast({
        title: "Error",
        description: "Invalid or expired verification code",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      let userCredential
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await logActivity(
          userCredential.user.uid,
          userCredential.user.displayName || "Anonymous",
          userCredential.user.email || "",
          "Account Created",
          "User created a new account with email verification",
        )
        toast({
          title: "Success!",
          description: "Account created successfully! Welcome to QuizForge!",
        })
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
        await logActivity(
          userCredential.user.uid,
          userCredential.user.displayName || "Anonymous",
          userCredential.user.email || "",
          "User Login",
          "User logged in with email verification",
        )
        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)

      await logActivity(
        userCredential.user.uid,
        userCredential.user.displayName || "Anonymous",
        userCredential.user.email || "",
        "Google Login",
        "User logged in with Google authentication",
      )

      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            QuizForge
          </CardTitle>
          <CardDescription>Create, share, and play amazing quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleLogin} disabled={loading} className="w-full mb-4" variant="outline">
            <Chrome className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={showVerification}
                  />
                </div>
              </div>

              {showVerification && (
                <div className="space-y-2">
                  <Label htmlFor="verification">Verification Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="verification"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCodeInput}
                      onChange={(e) => setVerificationCodeInput(e.target.value)}
                      className="pl-10"
                      maxLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Demo code: {sentCode} (In production, this would be sent via email)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button onClick={() => handleEmailLogin(false)} disabled={loading} className="w-full">
                {showVerification ? "Verify & Sign In" : "Send Code & Sign In"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={showVerification}
                  />
                </div>
              </div>

              {showVerification && (
                <div className="space-y-2">
                  <Label htmlFor="signup-verification">Verification Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-verification"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCodeInput}
                      onChange={(e) => setVerificationCodeInput(e.target.value)}
                      className="pl-10"
                      maxLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Demo code: {sentCode} (In production, this would be sent via email)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button onClick={() => handleEmailLogin(true)} disabled={loading} className="w-full">
                {showVerification ? "Verify & Create Account" : "Send Code & Sign Up"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
