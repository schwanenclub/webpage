<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content container">
        <div class="hero-badge fade-in">EST. 2016 · ZÜRICH</div>
        <h1 class="fade-in">Schwanen<br /><span class="gold">Club</span></h1>
        <p class="hero-subtitle fade-in">
          Mehr als ein Verein — eine Gemeinschaft für unvergessliche Momente in Zürich.
        </p>
        <div class="hero-actions fade-in">
          <router-link to="/kalender" class="btn btn-primary">Nächste Events</router-link>
          <router-link to="/kontakt" class="btn btn-outline">Kontakt</router-link>
        </div>
        <div class="hero-swan fade-in">
          <img src="/2PawMmk.gif" alt="Swan" class="swan-gif" />
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Über Uns</h2>
          <div class="gold-line"></div>
          <p>
            Der Schwanen Club wurde 2016 in Zürich gegründet und vereint Freunde,
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
    radial-gradient(ellipse at 20% 50%, rgba(30, 95, 170, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(176, 190, 201, 0.08) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  text-align: center;
  padding-top: 8rem;
  padding-bottom: 4rem;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 50px;
  font-size: 0.75rem;
  letter-spacing: 3px;
  color: var(--color-text-muted);
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

.swan-gif {
  width: 200px;
  height: auto;
  border-radius: var(--radius);
  opacity: 0.8;
  filter: drop-shadow(0 0 40px rgba(30, 95, 170, 0.15));
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
  background: linear-gradient(135deg, rgba(30, 95, 170, 0.08), rgba(30, 95, 170, 0.02));
  border: 1px solid rgba(30, 95, 170, 0.15);
  border-radius: var(--radius);
  padding: 4rem 2rem;
  text-align: center;
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
