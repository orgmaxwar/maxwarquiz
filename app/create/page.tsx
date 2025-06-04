"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import type { Quiz, Question } from "@/lib/types"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CreateQuizPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      timeLimit: 30,
    },
  ])
  const [loading, setLoading] = useState(false)

  const categories = ["Science", "History", "Sports", "Movies", "Technology", "General Knowledge"]

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      timeLimit: 30,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to create a quiz",
        variant: "destructive",
      })
      return
    }

    // Validation
    if (!title.trim() || !description.trim() || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const invalidQuestions = questions.some(
      (q) =>
        !q.question.trim() ||
        q.options.some((opt) => !opt.trim()) ||
        q.correctAnswer < 0 ||
        q.correctAnswer >= q.options.length,
    )

    if (invalidQuestions) {
      toast({
        title: "Error",
        description: "Please complete all questions and options",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const quizData: Omit<Quiz, "id"> = {
        title: title.trim(),
        description: description.trim(),
        category,
        creatorId: user.uid,
        creatorName: user.displayName,
        questions,
        isPublic,
        plays: 0,
        averageScore: 0,
        createdAt: new Date(),
      }

      const docRef = await addDoc(collection(db, "quizzes"), quizData)

      toast({
        title: "Success!",
        description: "Quiz created successfully",
      })

      router.push(`/quiz/${docRef.id}`)
    } catch (error) {
      console.error("Error creating quiz:", error)
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to create a quiz</h1>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Quiz</h1>
          <p className="text-muted-foreground">Build an engaging quiz to share with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Basic information about your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter quiz title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your quiz"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                <Label htmlFor="public">Make quiz public</Label>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>Add questions and multiple choice answers</CardDescription>
                </div>
                <Badge variant="secondary">
                  {questions.length} question{questions.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, questionIndex) => (
                <Card key={question.id} className="border-dashed">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                      {questions.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(questionIndex)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Text *</Label>
                      <Textarea
                        placeholder="Enter your question"
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Answer Options *</Label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`correct-${questionIndex}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateQuestion(questionIndex, "correctAnswer", optionIndex)}
                                className="text-primary"
                              />
                              <Label className="text-sm text-muted-foreground">
                                {optionIndex === question.correctAnswer ? "Correct" : "Option"}
                              </Label>
                            </div>
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Time Limit (seconds)</Label>
                      <Select
                        value={question.timeLimit?.toString() || "30"}
                        onValueChange={(value) => updateQuestion(questionIndex, "timeLimit", Number.parseInt(value))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15s</SelectItem>
                          <SelectItem value="30">30s</SelectItem>
                          <SelectItem value="45">45s</SelectItem>
                          <SelectItem value="60">60s</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
