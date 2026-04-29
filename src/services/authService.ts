import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from './firebase'
import { notificationService } from './notificationService'
import { useSettingsStore } from '@/store/settingsStore'
import type { User } from '@/types/auth'

const googleProvider = new GoogleAuthProvider()

function mapFirebaseUser(fbUser: FirebaseUser): User {
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
  }
}

export const authService = {
  async signUpWithEmail(email: string, password: string, fullName: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: fullName })
    const user = mapFirebaseUser({ ...result.user, displayName: fullName })
    if (useSettingsStore.getState().notifyLogin) {
      notificationService.showLoginNotification(fullName)
    }
    return user
  },

  async loginWithEmail(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const user = mapFirebaseUser(result.user)
    if (useSettingsStore.getState().notifyLogin) {
      notificationService.showLoginNotification(user.displayName ?? user.email ?? 'User')
    }
    return user
  },

  async loginWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, googleProvider)
    const user = mapFirebaseUser(result.user)
    if (useSettingsStore.getState().notifyLogin) {
      notificationService.showLoginNotification(user.displayName ?? user.email ?? 'User')
    }
    return user
  },

  async logout(): Promise<void> {
    await signOut(auth)
  },

  onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (fbUser) => {
      callback(fbUser ? mapFirebaseUser(fbUser) : null)
    })
  },
}
