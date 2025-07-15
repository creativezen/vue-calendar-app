<script setup>
  import { computed, ref, onMounted } from 'vue'
  import { format, startOfMonth, addMonths, subMonths, getDaysInMonth, getDay, isSameDay } from 'date-fns'
  import { useEventsStore } from '@/stores/eventsStore'
  import { useDirectionsStore } from '@/stores/directionsStore'
  import CalendarFilter from './CalendarFilter.vue'
  import { useUiStore } from '#imports'
  import { ru } from 'date-fns/locale'

  /* 
    Calendar.vue — компонент календаря для отображения мероприятий по дням.

    Особенности:
    - Получает список мероприятий и направлений из Pinia stores (eventsStore, directionsStore).
    - Позволяет фильтровать мероприятия по выбранным направлениям.
    - Генерирует сетку дней для выбранного месяца, отмечая дни с мероприятиями.
    - Поддерживает переключение месяцев, отображение текущего дня, работу с мобильными и десктопными версиями.
    - Использует date-fns для работы с датами и локализацией.
    - Взаимодействует с UI store для отображения состояния загрузки и ошибок.
  */

  // === Получение данных ===
  const uiStore = useUiStore()
  const eventsStore = useEventsStore()
  const directionsStore = useDirectionsStore()
  const allEvents = computed(() => eventsStore.events)
  const allDirections = computed(() => directionsStore.directions)

  const directionsLoading = computed(() => uiStore.loadingMap.directions)
  const directionsError = computed(() => uiStore.errorMap.directions)
  const eventsLoading = computed(() => uiStore.loadingMap.events)
  const eventsError = computed(() => uiStore.errorMap.events)

  // === Фильтрация по направлениям ===
  const selectedDirections = ref([])

  function toggleDirection(id) {
    if (selectedDirections.value.includes(id)) {
      selectedDirections.value = selectedDirections.value.filter((d) => d !== id)
    } else {
      selectedDirections.value.push(id)
    }
  }

  function showAllDirections() {
    selectedDirections.value = []
  }

  // Фильтрованные события
  const filteredEvents = computed(() => {
    if (!selectedDirections.value.length) return allEvents.value
    return allEvents.value.filter((event) => selectedDirections.value.includes(event.direction_id))
  })

  // === Создание календаря ===
  const today = new Date()

  // Аббревиатуры дней недели на русском
  const weekdayAbbreviations = {
    воскресенье: 'Вс.',
    понедельник: 'Пн.',
    вторник: 'Вт.',
    среда: 'Ср.',
    четверг: 'Чт.',
    пятница: 'Пт.',
    суббота: 'Сб.',
  }

  // Текущий месяц и год
  const currentMonth = ref(today.getMonth())
  const currentYear = ref(today.getFullYear())

  // Получаем текущий месяц на русском
  const currentMonthName = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value)
    return format(date, 'LLLL', { locale: ru })
  })

  // Получаем индекс дня недели для текущего дня (0 - понедельник)
  const getCurrentWeekdayIndex = computed(() => {
    // 0 - воскресенье, 1 - понедельник и т.д.
    const day = today.getDay()
    // приводим к системе: понедельник - 0, вторник - 1 и т.д.
    return (day + 6) % 7
  })

  // Название дня недели
  function getWeekdayName(date, isMobile) {
    if (!date) return ''
    // Полное название дня недели
    const dayName = format(date, 'EEEE', { locale: ru })
    return isMobile ? weekdayAbbreviations[dayName.toLowerCase()] : dayName
  }

  // Переключение месяцев
  function prevMonth() {
    const newDate = subMonths(new Date(currentYear.value, currentMonth.value), 1)
    currentMonth.value = newDate.getMonth()
    currentYear.value = newDate.getFullYear()
  }

  function nextMonth() {
    const newDate = addMonths(new Date(currentYear.value, currentMonth.value), 1)
    currentMonth.value = newDate.getMonth()
    currentYear.value = newDate.getFullYear()
  }

  // Для триггера Transition
  const currentMonthKey = computed(() => {
    return `${currentYear.value}-${currentMonth.value}`
  })

  // Генерация календаря
  const daysInGrid = computed(() => {
    const firstDayOfMonth = startOfMonth(new Date(currentYear.value, currentMonth.value))
    const daysInMonth = getDaysInMonth(firstDayOfMonth)
    const grid = []

    const startDayOfWeek = (getDay(firstDayOfMonth) + 6) % 7 // коррекция под понедельник
    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push({ day: null })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear.value, currentMonth.value, i)
      const dateStr = format(date, 'yyyy-MM-dd')

      let dayEvents = filteredEvents.value.filter((event) => event.date === dateStr)
      // Сортировка по времени (по возрастанию)
      dayEvents = dayEvents.slice().sort((a, b) => {
        // Если time пустое, считаем его самым поздним
        if (!a.time && !b.time) return 0
        if (!a.time) return 1
        if (!b.time) return -1
        // Сравниваем как HH:mm
        return a.time.localeCompare(b.time)
      })

      grid.push({
        day: i,
        date,
        isCurrentDay: isSameDay(date, today),
        events: dayEvents.length ? dayEvents : undefined,
      })
    }

    while (grid.length % 7 !== 0) {
      grid.push({ day: null })
    }

    return grid
  })

  // === Модальное окно ===
  const selectedDay = ref(null)
  const showModal = ref(false)

  function openEventModal(day) {
    if (day.events?.length > 0) {
      selectedDay.value = day
      showModal.value = true
      document.body.classList.add('disable-scroll')
    }
  }

  function closeModal() {
    showModal.value = false
    selectedDay.value = null
    document.body.classList.remove('disable-scroll')
  }

  onMounted(async () => {
    await eventsStore.getAllEvents()
    await directionsStore.getAllDirections()
  })
</script>

<template>
  <div>
    <section class="section stream" data-stream-top="no">
      <div class="container">
        <CalendarFilter
          :all-directions="allDirections"
          :selected-directions="selectedDirections"
          :directions-loading="directionsLoading"
          :directions-error="directionsError"
          :toggle-direction="toggleDirection"
          :show-all-directions="showAllDirections"
        />
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__header">
          <div class="calendar__header">
            <h2 class="title">
              Календарь Мероприятий
              <span>на {{ currentMonthName }} </span>
            </h2>
            <!-- Кнопки переключения месяцев -->
            <CalendarControls :prev-month="prevMonth" :next-month="nextMonth" :current-month-name="currentMonthName" />
          </div>
        </div>

        <div class="section__body">
          <CalendarWeekDays />

          <div v-if="!eventsLoading && !eventsError" class="calendar__body">
            <ClientOnly>
              <ul
                v-motion
                :initial="{ opacity: 0, transition: { duration: 600 } }"
                :enter="{ opacity: 1, transition: { duration: 700, ease: 'easeOut' } }"
                :leave="{ opacity: 0, transition: { duration: 600, ease: 'easeIn' } }"
                :key="currentMonthKey"
                :class="{ calendar__grid: $device.isDesktop, 'calendar__mobile-grid': $device.isMobile || $device.isTablet }"
              >
                <CalendarDays
                  :days-in-grid="daysInGrid"
                  :get-weekday-name="getWeekdayName"
                  :open-event-modal="openEventModal"
                  :selected-directions="selectedDirections"
                />
              </ul>
            </ClientOnly>
          </div>
          <div v-if="eventsLoading" class="calendar__body">
            <div class="loader"></div>
          </div>
          <div v-if="eventsError" class="calendar__body">
            <div class="error">Ошибка: {{ eventsError }}</div>
          </div>
        </div>

        <div class="section__footer flex">
          <!-- Кнопки переключения месяцев -->
          <CalendarControls :prev-month="prevMonth" :next-month="nextMonth" :current-month-name="currentMonthName" />
          <div class="section__logo left-auto">
            <img src="/logo_mapp.svg" alt="Календарь Мероприятий МАПП" />
          </div>
        </div>
      </div>
    </section>

    <!-- Модальное окно -->

    <Modal v-if="selectedDay?.events" :show-modal="showModal" :close-modal="closeModal">
      <div class="modal-date">
        <span class="date">{{ format(selectedDay.date, 'dd MMMM', { locale: ru }) }}</span> —
        <span class="week-day">{{ getWeekdayName(selectedDay.date, $device.isTablet || $device.isMobile) }}</span>
      </div>
      <ul>
        <li v-for="event in selectedDay?.events" :key="event.id" class="card">
          <div class="card__bg"><ImageDirection :src="event.direction.direction" /></div>
          <div class="card__header">
            <div class="badge-group">
              <div v-if="event.time" class="badge white">{{ event.time }}</div>
              <div v-else-if="event.direction.direction !== 'Экспертный день'" class="badge red">Время уточняется</div>
              <div class="badge black">{{ event.direction.direction }}</div>
              <div class="badge zero">{{ event.type.type }}</div>
            </div>
          </div>
          <div class="card__body">
            <div class="card__title">{{ event.title }}</div>
            <p>{{ event.text }}</p>
          </div>

          <div class="card__footer">
            <!-- Спикеры -->
            <div class="card__group">
              <div v-for="speaker in event.speakers" :key="speaker.id" class="card__speaker">
                <div class="photo">
                  <img v-if="speaker.photo" :src="speaker.photo" :alt="speaker.name" width="32" height="32" />
                  <img v-else src="/img/users/user_placeholder.png" alt="" />
                </div>
                <span class="name">{{ speaker.name }}</span>
              </div>
            </div>
            <a :href="event.url" target="_blank" rel="noopener noreferrer">
              <span>Присоединиться</span>
              <IconsIconArrowLink />
            </a>
          </div>
        </li>
      </ul>
    </Modal>
  </div>
</template>
