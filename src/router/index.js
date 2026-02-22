import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import Home from '../views/Home.vue'

const News = () => import('../views/News.vue')
const Kalender = () => import('../views/Kalender.vue')
const Kontakt = () => import('../views/Kontakt.vue')
const Login = () => import('../views/Login.vue')
const InternLayout = () => import('../views/InternLayout.vue')
const InternDashboard = () => import('../views/InternDashboard.vue')
const InternAnwesenheit = () => import('../views/InternAnwesenheit.vue')
const InternDokumente = () => import('../views/InternDokumente.vue')
const InternPasswort = () => import('../views/InternPasswort.vue')
const InternAntraege = () => import('../views/InternAntraege.vue')

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/news', name: 'News', component: News },
    { path: '/kalender', name: 'Kalender', component: Kalender },
    { path: '/kontakt', name: 'Kontakt', component: Kontakt },
    { path: '/login', name: 'Login', component: Login },
    {
        path: '/intern',
        component: InternLayout,
        meta: { requiresAuth: true },
        children: [
            { path: '', name: 'InternDashboard', component: InternDashboard },
            { path: 'anwesenheit', name: 'InternAnwesenheit', component: InternAnwesenheit },
            { path: 'dokumente', name: 'InternDokumente', component: InternDokumente },
            { path: 'passwort', name: 'InternPasswort', component: InternPasswort },
            { path: 'antraege', name: 'InternAntraege', component: InternAntraege },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

// Wait for Firebase auth to initialize
function getCurrentUser() {
    return new Promise((resolve) => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe()
            resolve(user)
        })
    })
}

router.beforeEach(async (to) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        const user = await getCurrentUser()
        if (!user) {
            return { name: 'Login', query: { redirect: to.fullPath } }
        }
        // Check if user must change password
        if (to.name !== 'InternPasswort') {
            try {
                const db = getFirestore()
                const profileDoc = await getDoc(doc(db, 'members', user.uid))
                if (profileDoc.exists() && profileDoc.data().mustChangePassword === true) {
                    return { name: 'InternPasswort' }
                }
            } catch {
                // continue if Firestore check fails
            }
        }
    }
})

export default router
