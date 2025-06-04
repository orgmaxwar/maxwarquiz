import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { VerificationCode } from "@/lib/types"

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendVerificationCode(email: string): Promise<string> {
  const code = generateVerificationCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  try {
    const verificationData: Omit<VerificationCode, "id"> = {
      email,
      code,
      expiresAt,
      used: false,
      createdAt: new Date(),
    }

    await addDoc(collection(db, "verificationCodes"), verificationData)

    // In a real app, you would send this via email service
    // For demo purposes, we'll show it in console and return it
    console.log(`Verification code for ${email}: ${code}`)

    return code
  } catch (error) {
    console.error("Error creating verification code:", error)
    throw error
  }
}

export async function verifyCode(email: string, inputCode: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, "verificationCodes"),
      where("email", "==", email),
      where("code", "==", inputCode),
      where("used", "==", false),
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return false
    }

    const codeDoc = snapshot.docs[0]
    const codeData = codeDoc.data() as VerificationCode

    // Check if code is expired
    if (new Date() > codeData.expiresAt.toDate()) {
      return false
    }

    // Mark code as used
    await updateDoc(doc(db, "verificationCodes", codeDoc.id), { used: true })

    return true
  } catch (error) {
    console.error("Error verifying code:", error)
    return false
  }
}
