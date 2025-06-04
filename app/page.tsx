"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Trophy, Zap, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to QuizForge
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create amazing quizzes, challenge your friends, and climb the leaderboards in the ultimate quiz platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/create">
                <Zap className="w-5 h-5 mr-2" />
                Create Your First Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">
                <Play className="w-5 h-5 mr-2" />
                Explore Quizzes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Users className="w-8 h-8 mx-auto text-purple-600" />
                <CardTitle>Active Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,234</div>
                <p className="text-muted-foreground">Quiz enthusiasts</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Play className="w-8 h-8 mx-auto text-blue-600" />
                <CardTitle>Quizzes Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5,678</div>
                <p className="text-muted-foreground">And counting</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Trophy className="w-8 h-8 mx-auto text-yellow-600" />
                <CardTitle>Games Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12,345</div>
                <p className="text-muted-foreground">Total attempts</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="w-8 h-8 mx-auto text-green-600" />
                <CardTitle>Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.8</div>
                <p className="text-muted-foreground">Out of 5 stars</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuizForge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Easy Quiz Creation</CardTitle>
                <CardDescription>Create engaging quizzes in minutes with our intuitive builder</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Real-time Leaderboards</CardTitle>
                <CardDescription>Compete with friends and see live rankings as you play</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="w-10 h-10 text-yellow-600 mb-2" />
                <CardTitle>Achievements & Badges</CardTitle>
                <CardDescription>Earn XP, unlock badges, and level up your quiz mastery</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Progress */}
      <section className="py-16 px-4">
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
    </div>
  )
}
