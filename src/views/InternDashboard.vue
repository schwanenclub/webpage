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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const memberCount = ref(0)
const eventCount = ref(0)
const docCount = ref(0)

onMounted(async () => {
  try {
    const membersSnap = await getDocs(collection(db, 'members'))
    memberCount.value = membersSnap.size

    const eventsSnap = await getDocs(collection(db, 'events'))
    eventCount.value = eventsSnap.size

    const docsSnap = await getDocs(collection(db, 'documents'))
    docCount.value = docsSnap.size
  } catch {
    // Firebase not configured yet — show placeholder
    memberCount.value = 0
    eventCount.value = 0
    docCount.value = 0
  }
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
</style>
