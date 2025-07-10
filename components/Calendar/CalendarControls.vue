<script setup>
  import IconArrowLeft from '@/components/Icons/IconArrowLeft.vue'
  import IconArrowRight from '@/components/Icons/IconArrowRight.vue'

  defineProps({
    currentMonthName: {
      type: String,
      required: true,
    },
    nextMonth: {
      type: Function,
      required: true,
    },
    prevMonth: {
      type: Function,
      required: true,
    },
  })
</script>

<template>
  <!-- Кнопки переключения месяцев -->
  <div class="calendar__controls">
    <button @click="prevMonth" class="controls-button prev">
      <IconArrowLeft />
    </button>
    <span class="value">{{ currentMonthName }}</span>
    <button @click="nextMonth" class="controls-button next">
      <IconArrowRight />
    </button>
  </div>
</template>
