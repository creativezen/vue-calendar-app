<script setup>
  import { defineProps, defineEmits } from 'vue'

  const props = defineProps({
    showModal: {
      type: Boolean,
      required: true,
    },
    closeModal: {
      type: Function,
      required: true,
    },
  })
</script>

<template>
  <div v-if="showModal" class="modal-overlay">
    <!-- Анимация фона окна -->
    <ClientOnly>
      <div
        v-motion
        :initial="{ opacity: 0, transition: { duration: 500, ease: 'easeInOut' } }"
        :enter="{ opacity: 1, transition: { duration: 500, ease: 'easeInOut' } }"
        :leave="{ opacity: 0, transition: { duration: 500, ease: 'easeInOut' } }"
        class="modal-backdrop"
      ></div>

      <!-- Анимация контента окна -->
      <div
        v-motion
        :initial="{ x: 500, transition: { duration: 500, ease: 'easeInOut' } }"
        :enter="{ x: 0, opacity: 1, transition: { duration: 500, ease: 'easeInOut' } }"
        :leave="{ x: -500, transition: { duration: 500, ease: 'easeInOut' } }"
        class="modal-content"
      >
        <button @click="closeModal" class="modal-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6835 4.90237 18.3166 4.90237 18.7071 5.29289C19.0977 5.68342 19.0977 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3165 18.7071 18.7071C18.3165 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0977 5.68342 19.0977 5.29289 18.7071C4.90237 18.3166 4.90237 17.6835 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
            />
          </svg>
        </button>
        <slot />
      </div>
    </ClientOnly>
  </div>
</template>
