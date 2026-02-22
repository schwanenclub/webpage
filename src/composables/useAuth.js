import { ref, onMounted } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const user = ref(null)
const userProfile = ref(null)
const loading = ref(true)
const isAdmin = ref(false)
const mustChangePassword = ref(false)

export function useAuth() {
    onMounted(() => {
        onAuthStateChanged(auth, async (firebaseUser) => {
            user.value = firebaseUser
            if (firebaseUser) {
                // Load user profile from Firestore
                try {
                    const profileDoc = await getDoc(doc(db, 'members', firebaseUser.uid))
                    if (profileDoc.exists()) {
                        const data = profileDoc.data()
                        userProfile.value = data
                        isAdmin.value = data.role === 'admin'
                        mustChangePassword.value = data.mustChangePassword === true
                    }
                } catch {
                    console.error('Could not load profile')
                }
            } else {
                userProfile.value = null
                isAdmin.value = false
                mustChangePassword.value = false
            }
            loading.value = false
        })
    })

    async function logout() {
        await signOut(auth)
        user.value = null
        userProfile.value = null
        isAdmin.value = false
        mustChangePassword.value = false
    }

    return {
        user,
        userProfile,
        loading,
        isAdmin,
        mustChangePassword,
        logout,
    }
}
