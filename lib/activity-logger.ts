import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { ActivityLog } from "@/lib/types"

export async function logActivity(
  userId: string,
  userName: string,
  userEmail: string,
  action: string,
  details: string,
) {
  try {
    const activityData: Omit<ActivityLog, "id"> = {
      userId,
      userName,
      userEmail,
      action,
      details,
      timestamp: new Date(),
    }

    await addDoc(collection(db, "activityLogs"), activityData)
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}
