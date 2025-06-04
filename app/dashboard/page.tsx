"use client"

import { useEffect, useState } from "react"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import type { Quiz } from "@/lib/types"
import { Navbar } from "@/components/layout/navbar"
import { QuizCard } from "@/components/quiz/quiz-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [publicQuizzes, setPublicQuizzes] = useState<Quiz[]>([])
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Science", "History", "Sports", "Movies", "Technology", "General Knowledge"]

  useEffect(() => {
    fetchQuizzes()
  }, [user])

  const fetchQuizzes = async () => {
    if (!user) return

    try {
      // Fetch public quizzes
      const publicQuery = query(
        collection(db, "quizzes"),
        where("isPublic", "==", true),
        orderBy("createdAt", "desc"),
        limit(20),
      )
      const publicSnapshot = await getDocs(publicQuery)
      const publicQuizzesData = publicSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Quiz[]

      // Fetch user's quizzes
      const myQuery = query(collection(db, "quizzes"), where("creatorId", "==", user.uid), orderBy("createdAt", "desc"))
      const mySnapshot = await getDocs(myQuery)
      const myQuizzesData = mySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Quiz[]

      setPublicQuizzes(publicQuizzesData)
      setMyQuizzes(myQuizzesData)
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredQuizzes = (quizzes: Quiz[]) => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || quiz.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access the dashboard</h1>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.displayName}! Ready to create or play some quizzes?
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/create">
              <Plus className="w-4 h-4 mr-2" />
              Create New Quiz
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="public" className="w-full">
          <TabsList>
            <TabsTrigger value="public">Public Quizzes</TabsTrigger>
            <TabsTrigger value="my-quizzes">My Quizzes ({myQuizzes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes(publicQuizzes).map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            )}

            {!loading && filteredQuizzes(publicQuizzes).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No quizzes found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-quizzes" className="mt-6">
            {myQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No quizzes yet</h3>
                <p className="text-muted-foreground mb-4">Create your first quiz to get started!</p>
                <Button asChild>
                  <Link href="/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes(myQuizzes).map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
