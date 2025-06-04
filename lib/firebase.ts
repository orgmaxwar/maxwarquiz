import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyB9Vdp3ScFQiruzKEOP1pHx-ZgNJzGiPwE",
  authDomain: "quizmaxwar.firebaseapp.com",
  projectId: "quizmaxwar",
  storageBucket: "quizmaxwar.firebasestorage.app",
  messagingSenderId: "883104978112",
  appId: "1:883104978112:web:a7925995340b781bf44925",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
