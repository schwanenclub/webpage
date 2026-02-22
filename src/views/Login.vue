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
          <!-- Already logged in -->
          <div v-if="user" class="logged-in">
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
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../composables/useAuth'

const { user, logout } = useAuth()

const email = ref('')
const password = ref('')
const sending = ref(false)
const error = ref('')

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
  font-family: var(--font-body);
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
