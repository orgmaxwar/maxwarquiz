export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  xp: number
  level: number
  streak: number
  badges: string[]
  createdAt: Date
  bio?: string
  profileImage?: string // base64 image
  lastActive?: Date
}

export interface Quiz {
  id: string
  title: string
  description: string
  category: string
  creatorId: string
  creatorName: string
  questions: Question[]
  isPublic: boolean
  plays: number
  averageScore: number
  createdAt: Date
  imageUrl?: string
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  timeLimit?: number
  imageUrl?: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  userName: string
  score: number
  totalQuestions: number
  timeSpent: number
  completedAt: Date
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  score: number
  timeSpent: number
  completedAt: Date
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  details: string
  timestamp: Date
  ipAddress?: string
}

export interface VerificationCode {
  id: string
  email: string
  code: string
  expiresAt: Date
  used: boolean
  createdAt: Date
}
