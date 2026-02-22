<template>
  <div class="dashboard">
    <div class="dash-grid">
      <div class="dash-card card fade-in">
        <span class="dash-icon">👥</span>
        <div class="dash-stat">
          <span class="stat-number">{{ memberCount }}</span>
          <span class="stat-label">Mitglieder</span>
        </div>
      </div>

      <div class="dash-card card fade-in">
        <span class="dash-icon">📅</span>
        <div class="dash-stat">
          <span class="stat-number">{{ eventCount }}</span>
          <span class="stat-label">Events dieses Jahr</span>
        </div>
      </div>

      <div class="dash-card card fade-in">
        <span class="dash-icon">📁</span>
        <div class="dash-stat">
          <span class="stat-number">{{ docCount }}</span>
          <span class="stat-label">Dokumente</span>
        </div>
      </div>
    </div>

    <div class="dash-section">
      <h3>Willkommen im internen Bereich</h3>
      <p>
        Hier findest du die Anwesenheitsliste für Events und gemeinsame Dokumente.
        Nutze die Navigation links, um zu den verschiedenen Bereichen zu gelangen.
      </p>
    </div>

    <div class="dash-section">
      <h3>Schnellzugriff</h3>
      <div class="quick-links">
        <router-link to="/intern/anwesenheit" class="quick-link card">
          <span>📋</span>
          <span>Anwesenheit</span>
        </router-link>
        <router-link to="/intern/dokumente" class="quick-link card">
          <span>📁</span>
          <span>Dokumente</span>
        </router-link>
      </div>
    </div>

    <!-- Ewige Tabelle -->
    <div class="dash-section">
      <h3>🏆 Ewige Tabelle</h3>
      <p class="table-desc">Gesamte Anwesenheit über alle Events hinweg.</p>

      <div v-if="loadingTable" class="loading-state">Laden...</div>
      <div v-else-if="rankings.length === 0" class="empty-state-small">
        Noch keine Anwesenheitsdaten vorhanden.
      </div>
      <table v-else class="ranking-table card">
        <thead>
          <tr>
            <th class="rank-col">#</th>
            <th>Mitglied</th>
            <th class="num-col">Anwesend</th>
            <th class="num-col">Events</th>
            <th class="num-col">Quote</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rankings" :key="row.id">
            <td class="rank-col">
              <span v-if="i === 0" class="medal">🥇</span>
              <span v-else-if="i === 1" class="medal">🥈</span>
              <span v-else-if="i === 2" class="medal">🥉</span>
              <span v-else class="rank-num">{{ i + 1 }}</span>
            </td>
            <td>
              <div class="rank-member">
                <span class="rank-avatar">{{ row.name?.[0]?.toUpperCase() || '?' }}</span>
                <span>{{ row.name || row.email }}</span>
              </div>
            </td>
            <td class="num-col">{{ row.attended }}</td>
            <td class="num-col">{{ totalEvents }}</td>
            <td class="num-col">
              <span class="quote-bar">
                <span class="quote-fill" :style="{ width: row.percentage + '%' }"></span>
                <span class="quote-text">{{ row.percentage }}%</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const memberCount = ref(0)
const eventCount = ref(0)
const docCount = ref(0)
const rankings = ref([])
const totalEvents = ref(0)
const loadingTable = ref(true)

onMounted(async () => {
  try {
    const membersSnap = await getDocs(collection(db, 'members'))
    memberCount.value = membersSnap.size

    const eventsSnap = await getDocs(collection(db, 'events'))
    eventCount.value = eventsSnap.size

    const docsSnap = await getDocs(collection(db, 'documents'))
    docCount.value = docsSnap.size

    // Build eternal table
    const members = membersSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
    const events = eventsSnap.docs.map((d) => d.id)
    totalEvents.value = events.length

    if (events.length > 0 && members.length > 0) {
      // Count attendance per member across all events
      const attendanceCount = {}
      members.forEach((m) => { attendanceCount[m.id] = 0 })

      for (const eventId of events) {
        const attSnap = await getDocs(collection(db, 'events', eventId, 'attendance'))
        attSnap.docs.forEach((d) => {
          if (d.data().present && attendanceCount[d.id] !== undefined) {
            attendanceCount[d.id]++
          }
        })
      }

      rankings.value = members
        .map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          attended: attendanceCount[m.id] || 0,
          percentage: totalEvents.value > 0
            ? Math.round((attendanceCount[m.id] || 0) / totalEvents.value * 100)
            : 0,
        }))
        .sort((a, b) => b.attended - a.attended || a.name?.localeCompare(b.name))
    }
  } catch {
    memberCount.value = 0
    eventCount.value = 0
    docCount.value = 0
  }
  loadingTable.value = false
})
</script>

<style scoped>
.dash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.dash-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
}

.dash-icon {
  font-size: 2rem;
}

.dash-stat {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.dash-section {
  margin-bottom: 2rem;
}

.dash-section h3 {
  color: var(--color-text);
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
}

.dash-section p {
  font-size: 0.95rem;
  max-width: 600px;
}

.quick-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  font-size: 0.95rem;
}

.quick-link span:first-child {
  font-size: 1.5rem;
}

/* Ewige Tabelle */
.table-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
}

.ranking-table th {
  text-align: left;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  padding: 0.875rem 1rem;
  border-bottom: 2px solid var(--color-border);
  font-weight: 600;
}

.ranking-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.ranking-table tbody tr:last-child td {
  border-bottom: none;
}

.ranking-table tbody tr:hover {
  background: rgba(30, 95, 170, 0.03);
}

.rank-col {
  width: 48px;
  text-align: center !important;
}

.num-col {
  text-align: center !important;
  width: 90px;
}

.medal {
  font-size: 1.25rem;
}

.rank-num {
  font-weight: 600;
  color: var(--color-text-muted);
}

.rank-member {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rank-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.quote-bar {
  display: inline-flex;
  align-items: center;
  position: relative;
  width: 80px;
  height: 22px;
  background: var(--color-border);
  border-radius: 11px;
  overflow: hidden;
}

.quote-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--color-primary);
  border-radius: 11px;
  opacity: 0.2;
  transition: width 0.5s ease;
}

.quote-text {
  position: relative;
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text);
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

.empty-state-small {
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-dim);
  font-size: 0.9rem;
}
</style>
