<template>
  <div class="kontakt-page">
    <section class="page-hero">
      <div class="container">
        <ZurichWappen :size="28" :opacity="0.4" class="fade-in" />
        <h1 class="fade-in">Kontakt</h1>
        <div class="gold-line"></div>
        <p class="fade-in">Schreib uns — wir freuen uns von dir zu hören.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="kontakt-grid">
          <div class="kontakt-info">
            <div class="info-card card fade-in">
              <span class="info-icon">📧</span>
              <h3>E-Mail</h3>
              <a href="mailto:schwanenclub@gmail.com">schwanenclub@gmail.com</a>
            </div>

            <div class="info-card card fade-in">
              <span class="info-icon">📍</span>
              <h3>Standort</h3>
              <p>Zürich, Schweiz</p>
            </div>

            <div class="info-card card fade-in">
              <span class="info-icon">🦢</span>
              <h3>Gegründet</h3>
              <p>2016 in Zürich</p>
            </div>
          </div>

          <div class="kontakt-form-wrapper card fade-in">
            <h3>Nachricht senden</h3>
            <form class="kontakt-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name">Name</label>
                <input id="name" v-model="form.name" type="text" placeholder="Dis Name" required />
              </div>
              <div class="form-group">
                <label for="email">E-Mail</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="dis@email.ch"
                  required
                />
              </div>
              <div class="form-group">
                <label for="message">Nachricht</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="5"
                  placeholder="Was möchtest du uns sagen?"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%">
                Absenden
              </button>
            </form>
            <p v-if="submitted" class="success-msg">Danke für dini Nachricht! 🦢</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ZurichWappen from '../components/ZurichWappen.vue'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const submitted = ref(false)

function handleSubmit() {
  // For now just show a success message.
  // Hook up to a backend or Formspree later.
  submitted.value = true
  form.name = ''
  form.email = ''
  form.message = ''
  setTimeout(() => {
    submitted.value = false
  }, 4000)
}
</script>

<style scoped>
.page-hero {
  padding: 10rem 0 4rem;
  text-align: center;
  background:
    linear-gradient(180deg, rgba(30, 95, 170, 0.12) 0%, rgba(30, 95, 170, 0.04) 60%, transparent 100%),
    radial-gradient(ellipse at 50% 0%, rgba(30, 95, 170, 0.10) 0%, transparent 60%);
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

.kontakt-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.kontakt-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-card {
  text-align: center;
  padding: 2rem 1.5rem;
}

.info-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.info-card h3 {
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.info-card a,
.info-card p {
  font-size: 0.9rem;
}

.kontakt-form-wrapper {
  padding: 2.5rem;
}

.kontakt-form-wrapper h3 {
  color: var(--color-primary);
  margin-bottom: 2rem;
  font-size: 1.3rem;
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

.form-group input,
.form-group textarea {
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

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--color-primary);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--color-text-dim);
}

textarea {
  resize: vertical;
}

.success-msg {
  margin-top: 1.5rem;
  text-align: center;
  color: #66bb6a;
  font-weight: 500;
}

@media (max-width: 768px) {
  .kontakt-grid {
    grid-template-columns: 1fr;
  }

  .kontakt-info {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .info-card {
    flex: 1;
    min-width: 140px;
  }
}
</style>
