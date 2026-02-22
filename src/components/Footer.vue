<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-icon">🦢</span>
            <span class="logo-name">Schwanen Club</span>
          </div>
          <p>Seit 2016 in Zürich. Gemeinschaft, Spass und unvergessliche Momente.</p>
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
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 4rem 0 2rem;
  margin-top: 4rem;
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

.footer-logo .logo-icon {
  font-size: 1.5rem;
}

.footer-logo .logo-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.footer-brand p {
  color: var(--color-text-dim);
  font-size: 0.9rem;
  max-width: 320px;
}

.footer-links h4,
.footer-contact h4 {
  font-family: var(--font-body);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-text-muted);
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
  color: var(--color-text-dim);
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-contact p {
  color: var(--color-text-dim);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding-top: 2rem;
  text-align: center;
}

.footer-bottom p {
  font-size: 0.8rem;
  color: var(--color-text-dim);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
