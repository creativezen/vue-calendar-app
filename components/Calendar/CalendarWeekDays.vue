<script setup>
  import { ref } from 'vue'

  // Названия дней недели на русском
  const weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
</script>

<template>
  <div v-show="$device.isDesktop" class="calendar__weekdays">
    <!-- Названия дней недели -->
    <span v-for="(day, index) in weekdays" :key="index" class="weekdays-day">
      {{ day }}
    </span>
  </div>
</template>
