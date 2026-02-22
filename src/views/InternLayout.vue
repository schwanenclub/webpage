<template>
  <div class="intern-layout">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-logo">
          <span>🦢</span>
          <span class="sidebar-title">Intern</span>
        </router-link>
        <button class="sidebar-close" @click="sidebarOpen = false">&times;</button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/intern" class="sidebar-link" @click="sidebarOpen = false">
          <span class="sidebar-icon">📊</span>
          Dashboard
        </router-link>
        <router-link to="/intern/anwesenheit" class="sidebar-link" @click="sidebarOpen = false">
          <span class="sidebar-icon">📋</span>
          Anwesenheit
        </router-link>
        <router-link to="/intern/dokumente" class="sidebar-link" @click="sidebarOpen = false">
          <span class="sidebar-icon">📁</span>
          Dokumente
        </router-link>
        <router-link to="/intern/antraege" class="sidebar-link" @click="sidebarOpen = false">
          <span class="sidebar-icon">✍️</span>
          Anträge
        </router-link>
        <router-link to="/intern/passwort" class="sidebar-link" @click="sidebarOpen = false">
          <span class="sidebar-icon">🔑</span>
          Passwort ändern
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user" v-if="user">
          <span class="user-avatar">{{ user.email?.[0]?.toUpperCase() }}</span>
          <div class="user-info">
            <span class="user-email">{{ user.email }}</span>
            <button @click="handleLogout" class="logout-btn">Abmelden</button>
          </div>
        </div>
      </div>
    </aside>

    <div class="intern-main">
      <header class="intern-header">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <span></span><span></span><span></span>
        </button>
        <h2>{{ currentPageTitle }}</h2>
        <router-link to="/" class="back-link">← Zurück zur Website</router-link>
      </header>

      <div class="intern-content">
        <router-view />
      </div>
    </div>

    <div class="sidebar-overlay" v-if="sidebarOpen" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { user, logout } = useAuth()
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

const currentPageTitle = computed(() => {
  const titles = {
    'InternDashboard': 'Dashboard',
    'InternAnwesenheit': 'Anwesenheit',
    'InternDokumente': 'Dokumente',
  }
  return titles[route.name] || 'Intern'
})

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.intern-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform var(--transition);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 1.25rem;
}

.sidebar-title {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.1rem;
}

.sidebar-close {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-muted);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 400;
  text-decoration: none;
  transition: all var(--transition);
}

.sidebar-link:hover {
  background: var(--color-surface);
  color: var(--color-text);
}

.sidebar-link.router-link-exact-active {
  background: rgba(30, 95, 170, 0.08);
  color: var(--color-primary);
  font-weight: 500;
}

.sidebar-icon {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

.sidebar-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-border);
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-email {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.75rem;
  color: var(--color-primary);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body);
}

.logout-btn:hover {
  color: var(--color-primary-dark);
}

/* Main */
.intern-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.intern-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2rem;
  background: #ffffff;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.intern-header h2 {
  flex: 1;
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.back-link {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--color-primary);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.menu-toggle span {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text);
  border-radius: 1px;
}

.intern-content {
  flex: 1;
  padding: 2rem;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-close {
    display: block;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
  }

  .intern-main {
    margin-left: 0;
  }

  .menu-toggle {
    display: flex;
  }

  .intern-content {
    padding: 1.25rem;
  }
}
</style>
