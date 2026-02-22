<template>
  <div class="news-page">
    <section class="page-hero">
      <div class="container">
        <ZurichWappen :size="28" :opacity="0.4" class="fade-in" />
        <h1 class="fade-in">News</h1>
        <div class="gold-line"></div>
        <p class="fade-in">Neuigkeiten und Updates aus dem Schwanen Club.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="news-grid">
          <article class="news-card card fade-in" v-for="post in posts" :key="post.title">
            <div class="news-meta">
              <span class="news-date">{{ post.date }}</span>
              <span class="news-tag" :class="post.tagClass">{{ post.tag }}</span>
            </div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ZurichWappen from '../components/ZurichWappen.vue'

const posts = [
  {
    date: '22. Feb 2026',
    tag: 'Update',
    tagClass: 'tag-update',
    title: 'Neue Website ist online!',
    excerpt:
      'Der Schwanen Club hat eine brandneue Website. Modern, schnell und schön — so wie wir.',
  },
  {
    date: '15. Jan 2026',
    tag: 'Event',
    tagClass: 'tag-event',
    title: 'Weihnachtsessen 2025 war ein voller Erfolg',
    excerpt:
      'Über 20 Mitglieder feierten gemeinsam ins neue Jahr. Danke an alle, die dabei waren!',
  },
  {
    date: '05. Mär 2025',
    tag: 'GV',
    tagClass: 'tag-gv',
    title: 'GV 2025 — Rückblick',
    excerpt:
      'An der Generalversammlung 2025 wurden wichtige Beschlüsse gefasst und der Vorstand bestätigt.',
  },
  {
    date: '07. Aug 2024',
    tag: 'Event',
    tagClass: 'tag-event',
    title: 'Züri Swagger Fäscht — Legändär!',
    excerpt:
      'Das Züri Swagger Fäscht war wie immer ein Highlight. 9000 Alte, ein Abend.',
  },
  {
    date: '23. Jul 2021',
    tag: 'GV',
    tagClass: 'tag-gv',
    title: 'GV 2021',
    excerpt:
      'Die Generalversammlung 2021 fand erfolgreich statt. Neue Ideen, neue Pläne.',
  },
  {
    date: '30. Nov 2021',
    tag: 'Jubiläum',
    tagClass: 'tag-update',
    title: '5 Jahre Schwanen Club!',
    excerpt:
      'Wir feiern unser 5-jähriges Bestehen. Was 2016 klein begann, ist heute grösser denn je.',
  },
]
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

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

.news-card {
  display: flex;
  flex-direction: column;
}

.news-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.news-date {
  font-size: 0.8rem;
  color: var(--color-text-dim);
}

.news-tag {
  font-size: 0.7rem;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tag-event {
  background: rgba(74, 144, 217, 0.15);
  color: var(--color-accent);
}

.tag-gv {
  background: rgba(30, 95, 170, 0.12);
  color: var(--color-primary);
}

.tag-update {
  background: rgba(76, 175, 80, 0.15);
  color: #66bb6a;
}

.news-card h3 {
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.news-card p {
  font-size: 0.95rem;
  flex: 1;
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>
