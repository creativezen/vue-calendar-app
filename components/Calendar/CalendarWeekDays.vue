<script setup>
  /* 
    CalendarWeekDays.vue — компонент отображения дней недели в календаре.
    Особенности:
    - Отображает названия дней недели.
    - Используется в компоненте Calendar.vue для отображения дней недели.
  */

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
