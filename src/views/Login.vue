<template>
  <div class="login-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="fade-in">Mitglieder Login</h1>
        <div class="gold-line"></div>
        <p class="fade-in">Zugang zum internen Bereich des Schwanen Clubs.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="login-card card fade-in">
          <!-- Force password change -->
          <div v-if="user && mustChange" class="change-pw">
            <span class="login-icon">🔑</span>
            <h3>Passwort ändern</h3>
            <p class="login-desc">
              Du verwendest noch das Standardpasswort. Bitte wähle ein neues Passwort.
            </p>
            <form @submit.prevent="handleChangePassword" class="login-form">
              <div class="form-group">
                <label for="newPw">Neues Passwort</label>
                <input
                  id="newPw"
                  v-model="newPassword"
                  type="password"
                  placeholder="Mindestens 6 Zeichen"
                  required
                  minlength="6"
                  :disabled="sending"
                />
              </div>
              <div class="form-group">
                <label for="confirmPw">Passwort bestätigen</label>
                <input
                  id="confirmPw"
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Passwort wiederholen"
                  required
                  minlength="6"
                  :disabled="sending"
                />
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%" :disabled="sending">
                {{ sending ? 'Speichern...' : 'Passwort speichern' }}
              </button>
            </form>
            <p v-if="error" class="error-msg">{{ error }}</p>
            <p v-if="success" class="success-msg">{{ success }}</p>
          </div>

          <!-- Already logged in -->
          <div v-else-if="user" class="logged-in">
            <span class="login-icon">✅</span>
            <h3>Willkommen zurück!</h3>
            <p>Du bist angemeldet als <strong>{{ user.email }}</strong></p>
            <div class="login-actions">
              <router-link to="/intern" class="btn btn-primary">Zum internen Bereich</router-link>
              <button @click="logout" class="btn btn-outline">Abmelden</button>
            </div>
          </div>

          <!-- Login form -->
          <div v-else>
            <span class="login-icon">🦢</span>
            <h3>Anmelden</h3>
            <p class="login-desc">
              Melde dich mit deinen Zugangsdaten an.
            </p>
            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <label for="email">E-Mail</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="deine@email.ch"
                  required
                  :disabled="sending"
                />
              </div>
              <div class="form-group">
                <label for="password">Passwort</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="Dein Passwort"
                  required
                  :disabled="sending"
                />
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%" :disabled="sending">
                {{ sending ? 'Anmelden...' : 'Anmelden' }}
              </button>
            </form>
            <p v-if="error" class="error-msg">{{ error }}</p>
            <p class="login-note">
              Nur eingeladene Mitglieder können sich anmelden.
              <router-link to="/kontakt">Kontaktiere uns</router-link> für einen Zugang.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuth } from '../composables/useAuth'

const { user, userProfile, mustChangePassword, logout } = useAuth()

const email = ref('')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const sending = ref(false)
const error = ref('')
const success = ref('')
const mustChange = ref(false)

// Watch for mustChangePassword from profile
watch(mustChangePassword, (val) => { mustChange.value = val }, { immediate: true })

async function handleLogin() {
  sending.value = true
  error.value = ''

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
  } catch (err) {
    console.error(err)
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
      error.value = 'E-Mail oder Passwort ist falsch.'
    } else if (err.code === 'auth/too-many-requests') {
      error.value = 'Zu viele Versuche. Bitte warte einen Moment.'
    } else {
      error.value = 'Fehler bei der Anmeldung. Bitte versuche es erneut.'
    }
  } finally {
    sending.value = false
  }
}

async function handleChangePassword() {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwörter stimmen nicht überein.'
    return
  }
  if (newPassword.value.length < 6) {
    error.value = 'Passwort muss mindestens 6 Zeichen lang sein.'
    return
  }

  sending.value = true
  error.value = ''
  success.value = ''

  try {
    await updatePassword(auth.currentUser, newPassword.value)
    await updateDoc(doc(db, 'members', auth.currentUser.uid), {
      mustChangePassword: false,
    })
    mustChange.value = false
    success.value = 'Passwort erfolgreich geändert!'
  } catch (err) {
    console.error(err)
    error.value = 'Fehler beim Ändern des Passworts. Bitte versuche es erneut.'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.page-hero {
  padding: 10rem 0 4rem;
  text-align: center;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(30, 95, 170, 0.06) 0%, transparent 60%);
}

.page-hero h1 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.page-hero p {
  font-size: 1.15rem;
  max-width: 500px;
  margin: 0 auto;
}

.login-card {
  max-width: 480px;
  margin: 0 auto;
  padding: 3rem;
  text-align: center;
}

.login-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1.5rem;
}

.login-card h3 {
  color: var(--color-text);
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
}

.login-desc {
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: var(--font-ui);
  font-size: 0.95rem;
  transition: border-color var(--transition);
  outline: none;
}

.form-group input:focus {
  border-color: var(--color-primary);
}

.form-group input::placeholder {
  color: var(--color-text-dim);
}

.error-msg {
  color: var(--color-danger, #c62828);
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.login-note {
  margin-top: 2rem;
  font-size: 0.8rem;
  color: var(--color-text-dim);
}

.logged-in {
  padding: 1rem 0;
}

.success-msg {
  color: var(--color-primary);
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.login-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.link-sent p {
  margin-bottom: 2rem;
}
</style>
