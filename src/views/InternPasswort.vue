<template>
  <div class="password-page">
    <div class="password-card card">
      <span class="pw-icon">🔑</span>
      <h3>Passwort ändern</h3>
      <p class="pw-desc">Wähle ein neues Passwort für deinen Account.</p>

      <form @submit.prevent="handleChange" class="pw-form">
        <div class="form-group">
          <label for="currentPw">Aktuelles Passwort</label>
          <input
            id="currentPw"
            v-model="currentPassword"
            type="password"
            placeholder="Dein aktuelles Passwort"
            required
            :disabled="saving"
          />
        </div>
        <div class="form-group">
          <label for="newPw">Neues Passwort</label>
          <input
            id="newPw"
            v-model="newPassword"
            type="password"
            placeholder="Mindestens 6 Zeichen"
            required
            minlength="6"
            :disabled="saving"
          />
        </div>
        <div class="form-group">
          <label for="confirmPw">Neues Passwort bestätigen</label>
          <input
            id="confirmPw"
            v-model="confirmPassword"
            type="password"
            placeholder="Passwort wiederholen"
            required
            minlength="6"
            :disabled="saving"
          />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%" :disabled="saving">
          {{ saving ? 'Speichern...' : 'Passwort ändern' }}
        </button>
      </form>

      <p v-if="error" class="error-msg">{{ error }}</p>
      <p v-if="success" class="success-msg">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  updatePassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const error = ref('')
const success = ref('')

async function handleChange() {
  error.value = ''
  success.value = ''

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwörter stimmen nicht überein.'
    return
  }
  if (newPassword.value.length < 6) {
    error.value = 'Passwort muss mindestens 6 Zeichen lang sein.'
    return
  }

  saving.value = true

  try {
    const user = auth.currentUser
    // Re-authenticate first
    const credential = EmailAuthProvider.credential(user.email, currentPassword.value)
    await reauthenticateWithCredential(user, credential)

    // Update password
    await updatePassword(user, newPassword.value)

    // Clear mustChangePassword flag
    await updateDoc(doc(db, 'members', user.uid), {
      mustChangePassword: false,
    })

    success.value = 'Passwort erfolgreich geändert!'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    console.error(err)
    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      error.value = 'Aktuelles Passwort ist falsch.'
    } else {
      error.value = 'Fehler beim Ändern des Passworts. Bitte versuche es erneut.'
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.password-page {
  max-width: 500px;
}

.password-card {
  padding: 2.5rem;
  text-align: center;
}

.pw-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.password-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.pw-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.pw-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: var(--font-ui);
  font-size: 0.95rem;
  outline: none;
  transition: border-color var(--transition);
}

.form-group input:focus {
  border-color: var(--color-primary);
}

.error-msg {
  color: var(--color-danger, #c62828);
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.success-msg {
  color: var(--color-primary);
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
