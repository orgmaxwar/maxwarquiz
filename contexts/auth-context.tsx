"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User as FirebaseUser, onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  logout: () => Promise<void>
  updateUserData: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)

        // Get or create user document
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User)
        } else {
          // Create new user document
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "Anonymous",
            photoURL: firebaseUser.photoURL || undefined,
            xp: 0,
            level: 1,
            streak: 0,
            badges: [],
            createdAt: new Date(),
          }

          await setDoc(doc(db, "users", firebaseUser.uid), newUser)
          setUser(newUser)
        }
      } else {
        setUser(null)
        setFirebaseUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = async () => {
    await signOut(auth)
  }

  const updateUserData = async (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    await setDoc(doc(db, "users", user.uid), updatedUser, { merge: true })
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
