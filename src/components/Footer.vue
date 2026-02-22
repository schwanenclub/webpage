<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="/Schwanen-Logo.jpg.jpeg" alt="Schwanen Club" class="footer-logo-img" />
            <span class="logo-name">Schwanen Club</span>
          </div>
          <p>Seit 2015 in Zürich. Gemeinschaft, Spass und unvergessliche Momente.</p>
          <div class="footer-wappen">
            <ZurichWappen :size="28" variant="light" :opacity="0.7" />
            <span class="wappen-label">Stadt Zürich</span>
          </div>
        </div>

        <div class="footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/news">News</router-link></li>
            <li><router-link to="/kalender">Kalender</router-link></li>
            <li><router-link to="/kontakt">Kontakt</router-link></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4>Kontakt</h4>
          <p><a href="mailto:schwanenclub@gmail.com">schwanenclub@gmail.com</a></p>
          <p>Zürich, Schweiz</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ year }} Schwanen Club Zürich. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import ZurichWappen from './ZurichWappen.vue'

const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #14437a 0%, #1e5faa 50%, #14437a 100%);
  border-top: 3px solid var(--color-primary-light);
  padding: 4rem 0 2rem;
  margin-top: 4rem;
  color: rgba(255, 255, 255, 0.85);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer-logo-img {
  height: 36px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.footer-logo .logo-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.9rem;
  max-width: 320px;
}

.footer-wappen {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.wappen-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 500;
}

.footer-links h4,
.footer-contact h4 {
  font-family: var(--font-ui);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.25rem;
  font-weight: 600;
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: white;
}

.footer-contact p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.footer-contact a {
  color: rgba(255, 255, 255, 0.85);
}

.footer-contact a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 2rem;
  text-align: center;
}

.footer-bottom p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
