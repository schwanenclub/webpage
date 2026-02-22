<template>
  <div class="antraege-page">
    <!-- New Antrag form -->
    <div class="card new-antrag fade-in">
      <h3>Neuer Antrag</h3>
      <form @submit.prevent="submitAntrag" class="antrag-form">
        <div class="form-group">
          <label for="title">Titel</label>
          <input
            id="title"
            v-model="newTitle"
            type="text"
            placeholder="Kurzer Titel des Antrags"
            required
            :disabled="submitting"
          />
        </div>
        <div class="form-group">
          <label for="text">Beschreibung</label>
          <textarea
            id="text"
            v-model="newText"
            placeholder="Beschreibe deinen Antrag..."
            rows="4"
            required
            :disabled="submitting"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="submitting || !newTitle.trim() || !newText.trim()">
          {{ submitting ? 'Wird eingereicht...' : 'Antrag einreichen' }}
        </button>
      </form>
    </div>

    <!-- List of Anträge -->
    <div class="antraege-list">
      <div v-if="loading" class="loading-state">Laden...</div>
      <div v-else-if="antraege.length === 0" class="empty-state card fade-in">
        <span class="empty-icon">📭</span>
        <p>Noch keine Anträge vorhanden.</p>
      </div>
      <div v-else>
        <div
          v-for="antrag in antraege"
          :key="antrag.id"
          class="antrag-card card fade-in"
        >
          <div class="antrag-header">
            <h4>{{ antrag.title }}</h4>
            <span class="antrag-status" :class="antrag.status">
              {{ statusLabel(antrag.status) }}
            </span>
          </div>
          <p class="antrag-text">{{ antrag.text }}</p>
          <div class="antrag-meta">
            <span class="antrag-author">{{ antrag.authorName || antrag.authorEmail }}</span>
            <span class="antrag-date">{{ formatDate(antrag.createdAt) }}</span>
          </div>

          <!-- Admin actions -->
          <div v-if="isAdmin && antrag.status === 'offen'" class="antrag-actions">
            <button @click="updateStatus(antrag.id, 'angenommen')" class="btn btn-small btn-primary">
              ✓ Annehmen
            </button>
            <button @click="updateStatus(antrag.id, 'abgelehnt')" class="btn btn-small btn-outline">
              ✗ Ablehnen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from '../firebase'
import { useAuth } from '../composables/useAuth'

const { user, userProfile, isAdmin } = useAuth()

const antraege = ref([])
const loading = ref(true)
const submitting = ref(false)
const newTitle = ref('')
const newText = ref('')

function statusLabel(status) {
  switch (status) {
    case 'offen': return 'Offen'
    case 'angenommen': return 'Angenommen'
    case 'abgelehnt': return 'Abgelehnt'
    default: return status
  }
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return d.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function loadAntraege() {
  loading.value = true
  try {
    const q = query(collection(db, 'antraege'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    antraege.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    antraege.value = []
  }
  loading.value = false
}

async function submitAntrag() {
  if (!newTitle.value.trim() || !newText.value.trim()) return
  submitting.value = true

  try {
    await addDoc(collection(db, 'antraege'), {
      title: newTitle.value.trim(),
      text: newText.value.trim(),
      status: 'offen',
      authorUid: auth.currentUser.uid,
      authorEmail: auth.currentUser.email,
      authorName: userProfile.value?.name || '',
      createdAt: serverTimestamp(),
    })
    newTitle.value = ''
    newText.value = ''
    await loadAntraege()
  } catch (err) {
    console.error('Error submitting Antrag:', err)
  }
  submitting.value = false
}

async function updateStatus(id, status) {
  try {
    await updateDoc(doc(db, 'antraege', id), { status })
    const item = antraege.value.find((a) => a.id === id)
    if (item) item.status = status
  } catch (err) {
    console.error('Error updating status:', err)
  }
}

onMounted(loadAntraege)
</script>

<style scoped>
.new-antrag {
  margin-bottom: 2rem;
  padding: 2rem;
}

.new-antrag h3 {
  margin-bottom: 1.25rem;
  font-size: 1.2rem;
}

.antrag-form .form-group {
  margin-bottom: 1.25rem;
}

.antrag-form label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.antrag-form input,
.antrag-form textarea {
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
  resize: vertical;
}

.antrag-form input:focus,
.antrag-form textarea:focus {
  border-color: var(--color-primary);
}

.antraege-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.antrag-card {
  padding: 1.5rem;
}

.antrag-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.antrag-header h4 {
  font-size: 1.1rem;
  color: var(--color-text);
  margin: 0;
}

.antrag-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.antrag-status.offen {
  background: rgba(30, 95, 170, 0.1);
  color: var(--color-primary);
}

.antrag-status.angenommen {
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
}

.antrag-status.abgelehnt {
  background: rgba(198, 40, 40, 0.1);
  color: #c62828;
}

.antrag-text {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-wrap;
}

.antrag-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--color-text-dim);
}

.antrag-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.btn-small {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}
</style>
