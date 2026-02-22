<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <router-link to="/" class="nav-logo">
        <img src="/Schwanen-Logo.jpg.jpeg" alt="Schwanen Club" class="logo-img" />
        <div class="logo-text">
          <span class="logo-name">Schwanen Club</span>
          <span class="logo-since">seit 2015</span>
        </div>
      </router-link>

      <button class="nav-toggle" @click="isOpen = !isOpen" :class="{ active: isOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul class="nav-links" :class="{ open: isOpen }">
        <li v-for="link in links" :key="link.path">
          <router-link :to="link.path" @click="isOpen = false">
            {{ link.name }}
          </router-link>
        </li>
        <li class="nav-divider"></li>
        <li v-if="user">
          <router-link to="/intern" class="nav-login" @click="isOpen = false">
            Intern
          </router-link>
        </li>
        <li v-else>
          <router-link to="/login" class="nav-login" @click="isOpen = false">
            Login
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()
const isScrolled = ref(false)
const isOpen = ref(false)

const links = [
  { name: 'Home', path: '/' },
  { name: 'News', path: '/news' },
  { name: 'Kalender', path: '/kalender' },
  { name: 'Kontakt', path: '/kontakt' },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.25rem 0;
  transition: all var(--transition);
  background: transparent;
  border-top: 3px solid var(--color-primary);
}

.navbar.scrolled {
  background: rgba(230, 238, 250, 0.95);
  backdrop-filter: blur(20px);
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 2px 16px rgba(30, 95, 170, 0.10);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-text);
}

.logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.logo-since {
  font-size: 0.7rem;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 0.5rem;
}

.nav-links a {
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 400;
  transition: all var(--transition);
  text-decoration: none;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--color-primary);
  background: rgba(30, 95, 170, 0.08);
}

.nav-divider {
  width: 1px;
  background: var(--color-border);
  margin: 0.25rem 0.5rem;
}

.nav-login {
  border: 1.5px solid var(--color-primary) !important;
  color: var(--color-primary) !important;
  font-weight: 500 !important;
}

.nav-login:hover {
  background: var(--color-primary) !important;
  color: white !important;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.nav-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  transition: all var(--transition);
  border-radius: 1px;
}

.nav-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle.active span:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(244, 247, 251, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition);
  }

  .nav-links.open {
    opacity: 1;
    pointer-events: all;
  }

  .nav-links a {
    font-size: 1.5rem;
    padding: 1rem 2rem;
  }
}
</style>
