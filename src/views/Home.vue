<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content container">
        <div class="hero-badge fade-in">
          <ZurichWappen :size="16" :opacity="0.8" />
          EST. 2015 · ZÜRICH
        </div>
        <h1 class="fade-in">Schwanen<br /><span class="gold">Club</span></h1>
        <p class="hero-subtitle fade-in">
          Mehr als ein Verein — eine Gemeinschaft für unvergessliche Momente in Zürich.
        </p>
        <div class="hero-actions fade-in">
          <router-link to="/kalender" class="btn btn-primary">Nächste Events</router-link>
          <router-link to="/kontakt" class="btn btn-outline">Kontakt</router-link>
        </div>
        <div class="hero-swan fade-in">
          <img src="/Schwanen-Logo.jpg.jpeg" alt="Schwanen Club Logo" class="swan-logo" />
        </div>
      </div>
      <div class="hero-wappen-left fade-in">
        <ZurichWappen :size="80" :opacity="0.06" />
      </div>
      <div class="hero-wappen-right fade-in">
        <ZurichWappen :size="60" :opacity="0.04" />
      </div>
    </section>

    <!-- About Section -->
    <section class="section about-section">
      <div class="container">
        <div class="section-header">
          <ZurichWappen :size="32" :opacity="0.5" />
          <h2>Über Uns</h2>
          <div class="gold-line"></div>
          <p>
            Der Schwanen Club wurde 2015 in Zürich gegründet und vereint Freunde,
            die gemeinsam das Leben feiern — von legendären Festen bis zu
            gemütlichen Zusammenkünften.
          </p>
        </div>

        <div class="features-grid">
          <div class="card fade-in" v-for="feature in features" :key="feature.title">
            <span class="feature-icon">{{ feature.icon }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <h2>Werde Teil des Clubs</h2>
          <p>Melde dich bei uns und sei bei den nächsten Events dabei.</p>
          <router-link to="/kontakt" class="btn btn-primary">Jetzt Kontakt aufnehmen</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ZurichWappen from '../components/ZurichWappen.vue'

const features = [
  {
    icon: '🎉',
    title: 'Legendäre Events',
    desc: 'Vom Züri Swagger Fäscht bis zum Weihnachtsessen — bei uns wird gefeiert.',
  },
  {
    icon: '🤝',
    title: 'Starke Gemeinschaft',
    desc: 'Ein Club, der zusammenhält. Freundschaften, die ein Leben lang halten.',
  },
  {
    icon: '🏙️',
    title: 'Mitten in Zürich',
    desc: 'Unsere Heimat ist Zürich — hier treffen wir uns, hier feiern wir.',
  },
]
</script>

<style scoped>
/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(30, 95, 170, 0.10) 0%, rgba(30, 95, 170, 0.03) 40%, transparent 70%),
    radial-gradient(ellipse at 20% 50%, rgba(30, 95, 170, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(58, 126, 213, 0.10) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  text-align: center;
  padding-top: 8rem;
  padding-bottom: 4rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  border: 1px solid rgba(30, 95, 170, 0.25);
  background: rgba(30, 95, 170, 0.06);
  border-radius: 50px;
  font-size: 0.75rem;
  letter-spacing: 3px;
  color: var(--color-primary);
  margin-bottom: 2rem;
}

.hero h1 {
  margin-bottom: 1.5rem;
}

.gold {
  color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  max-width: 520px;
  margin: 0 auto 2.5rem;
  color: var(--color-text-muted);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
}

.hero-swan {
  display: flex;
  justify-content: center;
}

.swan-logo {
  width: 320px;
  height: auto;
  border-radius: var(--radius);
  filter: drop-shadow(0 0 40px rgba(30, 95, 170, 0.2));
}

.hero-wappen-left {
  position: absolute;
  left: 5%;
  top: 30%;
  pointer-events: none;
}

.hero-wappen-right {
  position: absolute;
  right: 8%;
  bottom: 20%;
  pointer-events: none;
}

/* About */
.about-section {
  background: linear-gradient(180deg, transparent 0%, rgba(30, 95, 170, 0.04) 50%, transparent 100%);
}

.section-header .zurich-wappen {
  margin-bottom: 0.75rem;
}

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.features-grid .card h3 {
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.features-grid .card p {
  font-size: 0.95rem;
}

/* CTA */
.cta-section {
  padding: 4rem 0;
}

.cta-card {
  background: linear-gradient(135deg, rgba(30, 95, 170, 0.15), rgba(30, 95, 170, 0.06));
  border: 1px solid rgba(30, 95, 170, 0.25);
  border-radius: var(--radius);
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-dark), var(--color-primary), var(--color-primary-light));
}

.cta-card h2 {
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.cta-card p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .hero-content {
    padding-top: 6rem;
  }

  .swan-gif {
    width: 150px;
  }
}
</style>
