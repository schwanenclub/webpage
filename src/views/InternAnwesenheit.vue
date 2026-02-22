<template>
  <div class="anwesenheit">
    <!-- Event selector -->
    <div class="controls">
      <div class="control-group">
        <label>Event auswählen:</label>
        <select v-model="selectedEventId" @change="loadAttendance">
          <option value="">— Event wählen —</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.date }} — {{ event.name }}
          </option>
        </select>
      </div>

      <button v-if="isAdmin" @click="showAddEvent = true" class="btn btn-primary btn-sm">
        + Neues Event
      </button>
    </div>

    <!-- Add event modal -->
    <div v-if="showAddEvent" class="modal-overlay" @click.self="showAddEvent = false">
      <div class="modal card">
        <h3>Neues Event erstellen</h3>
        <form @submit.prevent="createEvent">
          <div class="form-group">
            <label>Name</label>
            <input v-model="newEvent.name" placeholder="z.B. GV 2026" required />
          </div>
          <div class="form-group">
            <label>Datum</label>
            <input v-model="newEvent.date" type="date" required />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-sm" @click="showAddEvent = false">Abbrechen</button>
            <button type="submit" class="btn btn-primary btn-sm">Erstellen</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Attendance list -->
    <div v-if="selectedEventId" class="attendance-section">
      <div class="attendance-header">
        <h3>{{ selectedEvent?.name }}</h3>
        <span class="attendance-count">
          {{ presentCount }} / {{ attendanceList.length }} anwesend
        </span>
      </div>

      <div v-if="attendanceList.length === 0" class="empty-state">
        <p>Noch keine Mitglieder geladen. Mitglieder werden automatisch aus der Firestore "members"-Collection geladen.</p>
      </div>

      <table v-else class="attendance-table">
        <thead>
          <tr>
            <th>Mitglied</th>
            <th>Status</th>
            <th v-if="isAdmin">Aktion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in attendanceList" :key="member.id">
            <td>
              <div class="member-cell">
                <span class="member-avatar">{{ member.name?.[0]?.toUpperCase() || '?' }}</span>
                <div>
                  <span class="member-name">{{ member.name || member.email }}</span>
                  <span class="member-email">{{ member.email }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="status-badge" :class="member.present ? 'present' : 'absent'">
                {{ member.present ? 'Anwesend' : 'Abwesend' }}
              </span>
            </td>
            <td v-if="isAdmin">
              <button
                class="toggle-btn"
                :class="member.present ? 'is-present' : ''"
                @click="toggleAttendance(member)"
              >
                {{ member.present ? '✓' : '—' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📋</span>
      <p>Wähle ein Event aus, um die Anwesenheitsliste zu sehen.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../composables/useAuth'

const { isAdmin } = useAuth()

const events = ref([])
const selectedEventId = ref('')
const attendanceList = ref([])
const showAddEvent = ref(false)
const newEvent = ref({ name: '', date: '' })

const selectedEvent = computed(() => events.value.find((e) => e.id === selectedEventId.value))
const presentCount = computed(() => attendanceList.value.filter((m) => m.present).length)

onMounted(async () => {
  await loadEvents()
})

async function loadEvents() {
  try {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'))
    const snap = await getDocs(q)
    events.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    events.value = []
  }
}

async function loadAttendance() {
  if (!selectedEventId.value) {
    attendanceList.value = []
    return
  }

  try {
    // Load members
    const membersSnap = await getDocs(collection(db, 'members'))
    const members = membersSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

    // Load attendance records for this event
    const attSnap = await getDocs(
      collection(db, 'events', selectedEventId.value, 'attendance')
    )
    const attMap = {}
    attSnap.docs.forEach((d) => {
      attMap[d.id] = d.data().present
    })

    attendanceList.value = members.map((m) => ({
      ...m,
      present: attMap[m.id] || false,
    }))
  } catch {
    attendanceList.value = []
  }
}

async function createEvent() {
  try {
    await addDoc(collection(db, 'events'), {
      name: newEvent.value.name,
      date: newEvent.value.date,
      createdAt: new Date().toISOString(),
    })
    newEvent.value = { name: '', date: '' }
    showAddEvent.value = false
    await loadEvents()
  } catch (err) {
    console.error('Error creating event:', err)
  }
}

async function toggleAttendance(member) {
  const newState = !member.present
  member.present = newState

  try {
    await setDoc(
      doc(db, 'events', selectedEventId.value, 'attendance', member.id),
      { present: newState, email: member.email }
    )
  } catch (err) {
    console.error('Error updating attendance:', err)
    member.present = !newState // revert
  }
}
</script>

<style scoped>
.controls {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.control-group {
  flex: 1;
  min-width: 200px;
}

.control-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.control-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
}

.control-group select:focus {
  border-color: var(--color-primary);
}

.btn-sm {
  padding: 0.625rem 1.25rem;
  font-size: 0.85rem;
}

/* Attendance */
.attendance-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.attendance-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.attendance-header h3 {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.attendance-count {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th {
  text-align: left;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
}

.attendance-table td {
  padding: 0.875rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.attendance-table tr:last-child td {
  border-bottom: none;
}

.member-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.member-name {
  display: block;
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.member-email {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-dim);
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-weight: 600;
}

.status-badge.present {
  background: rgba(46, 125, 50, 0.1);
  color: var(--color-success);
}

.status-badge.absent {
  background: rgba(198, 40, 40, 0.08);
  color: var(--color-danger);
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-text-dim);
  transition: all var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn.is-present {
  border-color: var(--color-success);
  background: rgba(46, 125, 50, 0.1);
  color: var(--color-success);
}

.toggle-btn:hover {
  border-color: var(--color-primary);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 0.95rem;
  max-width: 400px;
  margin: 0 auto;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  margin: 1rem;
}

.modal h3 {
  color: var(--color-text);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.modal .form-group {
  margin-bottom: 1.25rem;
}

.modal .form-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.modal .form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  outline: none;
}

.modal .form-group input:focus {
  border-color: var(--color-primary);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .attendance-table th:nth-child(3),
  .attendance-table td:nth-child(3) {
    display: none;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
