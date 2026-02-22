<template>
  <div class="kalender-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="fade-in">Kalender</h1>
        <div class="gold-line"></div>
        <p class="fade-in">Unsere kommenden und vergangenen Events.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Kommende Events</h2>
        </div>
        <div class="timeline">
          <div
            class="timeline-item card fade-in"
            v-for="event in upcomingEvents"
            :key="event.title"
          >
            <div class="event-date-block">
              <span class="event-day">{{ event.day }}</span>
              <span class="event-month">{{ event.month }}</span>
              <span class="event-year">{{ event.year }}</span>
            </div>
            <div class="event-info">
              <h3>{{ event.title }}</h3>
              <p>{{ event.description }}</p>
            </div>
            <span class="event-badge upcoming">Bald</span>
          </div>
        </div>

        <div class="section-header" style="margin-top: 4rem">
          <h2>Vergangene Events</h2>
        </div>
        <div class="timeline">
          <div
            class="timeline-item card fade-in past"
            v-for="event in pastEvents"
            :key="event.title"
          >
            <div class="event-date-block">
              <span class="event-day">{{ event.day }}</span>
              <span class="event-month">{{ event.month }}</span>
              <span class="event-year">{{ event.year }}</span>
            </div>
            <div class="event-info">
              <h3>{{ event.title }}</h3>
              <p>{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const upcomingEvents = [
  {
    day: '14',
    month: 'Mär',
    year: '2026',
    title: 'GV 2026',
    description: 'Generalversammlung des Schwanen Clubs. Alle Mitglieder sind herzlich eingeladen.',
  },
  {
    day: '20',
    month: 'Jun',
    year: '2026',
    title: 'Sommerfest',
    description: 'Das grosse Sommerfest am See. Grillen, Musik und gute Laune.',
  },
]

const pastEvents = [
  {
    day: '08',
    month: 'Jan',
    year: '2022',
    title: 'Weihnachtsessen',
    description: 'Gemütliches Beisammensein zum Jahresstart.',
  },
  {
    day: '05',
    month: 'Mär',
    year: '2022',
    title: 'GV 2022',
    description: 'Generalversammlung mit Rückblick und Ausblick.',
  },
  {
    day: '30',
    month: 'Nov',
    year: '2021',
    title: 'Jubiläum — 5 Jahre!',
    description: 'Feier zum 5-jährigen Bestehen des Schwanen Clubs.',
  },
  {
    day: '02',
    month: 'Okt',
    year: '2021',
    title: 'Irgendöbbis',
    description: 'Es isch sicher öbbis passiert.',
  },
  {
    day: '07',
    month: 'Aug',
    year: '2021',
    title: 'Züri Swagger Fäscht',
    description: '9000 Alte — legendär wie immer.',
  },
  {
    day: '23',
    month: 'Jul',
    year: '2021',
    title: 'GV 2021',
    description: 'Generalversammlung mit wichtigen Beschlüssen.',
  },
]
</script>

<style scoped>
.page-hero {
  padding: 10rem 0 4rem;
  text-align: center;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(30, 95, 170, 0.06) 0%, transparent 60%);
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

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.75rem 2rem;
}

.timeline-item.past {
  opacity: 0.6;
}

.timeline-item.past:hover {
  opacity: 1;
}

.event-date-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  padding: 0.75rem;
  background: rgba(30, 95, 170, 0.06);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(30, 95, 170, 0.12);
}

.event-day {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1;
}

.event-month {
  font-size: 0.8rem;
  color: var(--color-primary-light);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.event-year {
  font-size: 0.7rem;
  color: var(--color-text-dim);
}

.event-info {
  flex: 1;
}

.event-info h3 {
  color: var(--color-text);
  margin-bottom: 0.25rem;
  font-size: 1.15rem;
}

.event-info p {
  font-size: 0.9rem;
}

.event-badge {
  font-size: 0.7rem;
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
}

.event-badge.upcoming {
  background: rgba(30, 95, 170, 0.12);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .event-date-block {
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>
