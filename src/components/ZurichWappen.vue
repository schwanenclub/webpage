<template>
  <svg
    :width="size"
    :height="size * 1.15"
    viewBox="0 0 100 115"
    xmlns="http://www.w3.org/2000/svg"
    :class="['zurich-wappen', variant]"
    :style="{ opacity }"
    role="img"
    aria-label="Wappen der Stadt Zürich"
  >
    <!-- Shield shape -->
    <defs>
      <clipPath id="shield">
        <path d="M 5 2 L 95 2 Q 98 2 98 5 L 98 70 Q 98 95 50 113 Q 2 95 2 70 L 2 5 Q 2 2 5 2 Z" />
      </clipPath>
    </defs>
    <g clip-path="url(#shield)">
      <!-- White background -->
      <rect x="0" y="0" width="100" height="115" fill="white" />
      <!-- Blue diagonal half (upper-left) -->
      <polygon points="0,0 100,0 0,115" :fill="blueColor" />
    </g>
    <!-- Shield border -->
    <path
      d="M 5 2 L 95 2 Q 98 2 98 5 L 98 70 Q 98 95 50 113 Q 2 95 2 70 L 2 5 Q 2 2 5 2 Z"
      fill="none"
      :stroke="strokeColor"
      stroke-width="2"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: Number, default: 40 },
  opacity: { type: Number, default: 1 },
  variant: { type: String, default: '' },
})

const blueColor = computed(() =>
  props.variant === 'light' ? '#4a8ad4' : '#1e5faa'
)
const strokeColor = computed(() =>
  props.variant === 'light' ? 'rgba(255,255,255,0.3)' : 'rgba(30,95,170,0.3)'
)
</script>

<style scoped>
.zurich-wappen {
  flex-shrink: 0;
  display: inline-block;
}
</style>
