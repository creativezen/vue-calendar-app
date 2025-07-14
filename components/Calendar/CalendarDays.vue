<script setup>
  import IconChatExpert from '@/components/Icons/IconChatExpert.vue'

  defineProps({
    daysInGrid: {
      type: Array,
      required: true,
    },
    getWeekdayName: {
      type: Function,
      required: true,
    },
    openEventModal: {
      type: Function,
      required: false,
    },
  })
</script>

<template>
  <!-- Календарь версия для ПК -->
  <li
    v-if="$device.isDesktop"
    v-for="(item, index) in daysInGrid"
    :key="item.date ? item.date.toISOString() : `empty-${index}`"
    :class="{ 'current-day': item.isCurrentDay, 'has-events': item.events, 'zero-day': !item.day }"
    class="calendar__day"
  >
    <div class="calendar__day-header">
      <div v-if="item.events" class="calendar__day-marker">
        <span v-for="event in item.events" :style="{ 'background-color': event.direction?.color || '#000' }"></span>
      </div>
      <div v-if="item.day" class="calendar__day-num">
        <span>{{ item.day }}</span>
        <!-- Сокращённое название дня недели -->
      </div>
    </div>
    <div v-if="item.events" class="calendar__day-body">
      <ul class="calendar__event-list">
        <li v-for="event in item.events">
          <div v-if="event.direction.direction == 'Экспертный день'" class="calendar__day-expert">
            <IconChatExpert />
            <p>Экспертный день</p>
          </div>
          <div v-else class="calendar__day-event">
            <span class="direction">{{ event.direction.direction }}</span>
            <span class="time">{{ event.time }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="calendar__event-none">
      <small v-if="item.day">Без мероприятий</small>
    </div>
    <div class="calendar__day-footer">
      <button v-if="item.events" @click="openEventModal(item)" class="button small black">Смотреть</button>
    </div>
  </li>

  <!-- Календарь версия для мобильных устройств -->
  <li
    v-else
    v-for="item in daysInGrid"
    :key="item.date?.toISOString()"
    :class="{
      'calendar__mobile-day': true,
      'current-day': item.isCurrentDay,
      'has-events': item.events,
      'visually-hidden': !item.day,
    }"
    @click="openEventModal(item)"
  >
    <div class="calendar__mobile-day-header">
      <div v-if="item.events" class="calendar__day-marker">
        <span v-for="event in item.events" :style="{ 'background-color': event.direction.color }"></span>
      </div>
      <span>{{ item.day }} {{ getWeekdayName(item.date, $device.isTablet || $device.isMobile) }}</span>
    </div>
    <div v-if="item.events" class="calendar__mobile-day-body">
      <ul class="calendar__event-list">
        <li v-for="event in item.events">
          <div v-if="event.direction.direction == 'Экспертный день'" class="calendar__day-expert">
            <IconChatExpert />
            <p>Экспертный день</p>
          </div>
          <div v-else class="calendar__day-event">
            <span class="direction">{{ event.direction.direction }}</span>
            <span class="time">{{ event.time }}</span>
          </div>
        </li>
      </ul>
      <button class="button small black">Смотреть</button>
    </div>
  </li>
</template>
