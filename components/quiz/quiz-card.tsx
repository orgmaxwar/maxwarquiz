"use client"

import type { Quiz } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Play, Users, Star, Clock } from "lucide-react"
import Link from "next/link"

interface QuizCardProps {
  quiz: Quiz
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-2">{quiz.title}</CardTitle>
            <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
          </div>
          <Badge variant="secondary">{quiz.category}</Badge>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{quiz.creatorName?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <span>{quiz.creatorName}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{quiz.plays}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{quiz.averageScore?.toFixed(1) || "0.0"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{quiz.questions.length} questions</span>
            </div>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href={`/quiz/${quiz.id}`}>
            <Play className="w-4 h-4 mr-2" />
            Play Quiz
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
