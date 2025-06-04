"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Trophy, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading QuizForge...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  // Immediately show the dashboard content for authenticated users
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back, {user.displayName}!
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ready to create amazing quizzes or challenge yourself with existing ones?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/create">
                <Zap className="w-5 h-5 mr-2" />
                Create New Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">
                <Play className="w-5 h-5 mr-2" />
                Browse Quizzes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Your Progress
              </CardTitle>
              <CardDescription>Keep playing to level up and earn more badges!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Level {user.level}</div>
                  <p className="text-muted-foreground">Current Level</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.xp} XP</div>
                  <p className="text-muted-foreground">Experience Points</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{user.streak}</div>
                  <p className="text-muted-foreground">Day Streak</p>
                </div>
              </div>

              {user.badges.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Your Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Zap className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Create Quiz</CardTitle>
                <CardDescription>Build a new quiz in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/create">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Play className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Play Quizzes</CardTitle>
                <CardDescription>Challenge yourself with community quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/dashboard">Browse All</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>See how you rank against others</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/leaderboard">View Rankings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
