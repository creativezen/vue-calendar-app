<script setup>
  import { computed, ref } from 'vue'
  import { format, startOfMonth, addMonths, subMonths, getDaysInMonth, getDay, isSameDay } from 'date-fns'
  import { ru } from 'date-fns/locale'

  // === Получение данных ===
  const allEvents = ref([])

  async function getEvents() {
    try {
      const response = await fetch('/data/events.json')
      const data = await response.json()
      allEvents.value = data.all_events || []
    } catch (error) {
      console.log('Ошибка при загрузке мероприятий:', error)
    }
  }

  // === Создание календаря ===
  const today = new Date()

  // Названия дней недели на русском
  const weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

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

      const dayEvents = allEvents.value.filter((event) => event.date === dateStr)

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

  onMounted(() => {
    getEvents()
  })
</script>

<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="section__header">
          <div class="calendar__header">
            <h2 class="title">
              Календарь Мероприятий
              <span>на {{ currentMonthName }} </span>
            </h2>
            <!-- Кнопки переключения месяцев -->
            <div class="calendar__controls">
              <button @click="prevMonth" class="controls-button prev">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.70711 6.29289C9.09763 6.68342 9.09763 7.31658 8.70711 7.70711L5.41421 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H5.41421L8.70711 16.2929C9.09763 16.6834 9.09763 17.3166 8.70711 17.7071C8.31658 18.0976 7.68342 18.0976 7.29289 17.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L7.29289 6.29289C7.68342 5.90237 8.31658 5.90237 8.70711 6.29289Z"
                  />
                </svg>
              </button>
              <span class="value">{{ currentMonthName }}</span>
              <button @click="nextMonth" class="controls-button next">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.2929 6.29289C14.9024 6.68342 14.9024 7.31658 15.2929 7.70711L18.5858 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H18.5858L15.2929 16.2929C14.9024 16.6834 14.9024 17.3166 15.2929 17.7071C15.6834 18.0976 16.3166 18.0976 16.7071 17.7071L21.7071 12.7071C22.0976 12.3166 22.0976 11.6834 21.7071 11.2929L16.7071 6.29289C16.3166 5.90237 15.6834 5.90237 15.2929 6.29289Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="section__body">
          <!-- Mobile view -->
          <div v-if="$device.isTablet || $device.isMobile" class="calendar__body">
            <ClientOnly>
              <ul
                v-motion
                :initial="{ opacity: 0, transition: { duration: 600 } }"
                :enter="{ opacity: 1, transition: { duration: 700, ease: 'easeOut' } }"
                :leave="{ opacity: 0, transition: { duration: 600, ease: 'easeIn' } }"
                :key="currentMonthKey"
                class="calendar__mobile-grid"
              >
                <li
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
                      <span v-for="event in item.events" :style="{ 'background-color': event.event_direction.color }"></span>
                    </div>
                    <span>{{ item.day }} {{ getWeekdayName(item.date, $device.isTablet || $device.isMobile) }}</span>
                  </div>
                  <div v-if="item.events" class="calendar__mobile-day-body">
                    <ul class="calendar__event-list">
                      <li v-for="event in item.events">
                        <div v-if="event.event_direction.direction == 'Экспертный день'" class="calendar__day-expert">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M17.1669 4.00033C17.1669 3.356 16.6443 2.83334 15.9999 2.83334H4.00041C3.35608 2.83334 2.83341 3.356 2.83341 4.00033V11.8259C2.83341 12.4702 3.35607 12.9928 4.00041 12.9928H5.56535C6.02556 12.9929 6.39868 13.366 6.39868 13.8262V15.9885L9.15015 13.237L9.21118 13.1816C9.35947 13.0601 9.54594 12.9928 9.73934 12.9928H15.9999C16.6443 12.9928 17.1669 12.4702 17.1669 11.8259V4.00033ZM9.99976 9.16635C10.4599 9.16635 10.8329 9.53959 10.8331 9.99968C10.8331 10.4599 10.46 10.833 9.99976 10.833H5.99992C5.53976 10.8329 5.16659 10.4599 5.16659 9.99968C5.16676 9.53965 5.53986 9.16643 5.99992 9.16635H9.99976ZM13.0002 5.16651L13.0849 5.17058C13.5053 5.21305 13.8335 5.56829 13.8336 5.99984C13.8336 6.43145 13.5053 6.78662 13.0849 6.82911L13.0002 6.83318H5.99992C5.53976 6.83309 5.16659 6.46003 5.16659 5.99984C5.16667 5.53973 5.53981 5.1666 5.99992 5.16651H13.0002ZM18.8336 11.8259C18.8336 13.3907 17.5647 14.6595 15.9999 14.6595H10.0844L6.15454 18.5894C5.91621 18.8276 5.55771 18.899 5.24634 18.77C4.935 18.6411 4.73208 18.3372 4.73202 18.0002V14.6595H4.00041C2.4356 14.6595 1.16675 13.3907 1.16675 11.8259V4.00033C1.16675 2.43552 2.4356 1.16667 4.00041 1.16667H15.9999C17.5647 1.16667 18.8336 2.43552 18.8336 4.00033V11.8259Z"
                              fill="#DB4388"
                            />
                          </svg>
                          <p>Экспертный день</p>
                        </div>
                        <div v-else class="calendar__day-event">
                          <span class="direction">{{ event.event_direction.direction }}</span>
                          <span class="time">{{ event.time }}</span>
                        </div>
                      </li>
                    </ul>
                    <button class="button small black">Смотреть</button>
                  </div>
                </li>
              </ul>
            </ClientOnly>
          </div>

          <!-- Desktop view -->
          <div v-else class="calendar__body">
            <div class="calendar__weekdays">
              <!-- Названия дней недели -->
              <span v-for="(day, index) in weekdays" :key="index" class="weekdays-day">
                {{ day }}
              </span>
            </div>
            <!-- Календарь -->
            <ClientOnly>
              <ul
                v-motion
                :initial="{ opacity: 0, transition: { duration: 600 } }"
                :enter="{ opacity: 1, transition: { duration: 700, ease: 'easeOut' } }"
                :leave="{ opacity: 0, transition: { duration: 600, ease: 'easeIn' } }"
                :key="currentMonthKey"
                class="calendar__grid"
              >
                <li
                  v-for="(item, index) in daysInGrid"
                  :key="item.date ? item.date.toISOString() : `empty-${index}`"
                  :class="{ 'current-day': item.isCurrentDay, 'has-events': item.events, 'zero-day': !item.day }"
                  class="calendar__day"
                >
                  <div class="calendar__day-header">
                    <div v-if="item.events" class="calendar__day-marker">
                      <span v-for="event in item.events" :style="{ 'background-color': event.event_direction.color }"></span>
                    </div>
                    <div v-if="item.day" class="calendar__day-num">
                      <span>{{ item.day }}</span>
                      <!-- Сокращённое название дня недели -->
                      <!-- <small>{{ getWeekdayName(item.date) }}</small> -->
                    </div>
                  </div>
                  <div v-if="item.events" class="calendar__day-body">
                    <ul class="calendar__event-list">
                      <li v-for="event in item.events">
                        <div v-if="event.event_direction.direction == 'Экспертный день'" class="calendar__day-expert">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M17.1669 4.00033C17.1669 3.356 16.6443 2.83334 15.9999 2.83334H4.00041C3.35608 2.83334 2.83341 3.356 2.83341 4.00033V11.8259C2.83341 12.4702 3.35607 12.9928 4.00041 12.9928H5.56535C6.02556 12.9929 6.39868 13.366 6.39868 13.8262V15.9885L9.15015 13.237L9.21118 13.1816C9.35947 13.0601 9.54594 12.9928 9.73934 12.9928H15.9999C16.6443 12.9928 17.1669 12.4702 17.1669 11.8259V4.00033ZM9.99976 9.16635C10.4599 9.16635 10.8329 9.53959 10.8331 9.99968C10.8331 10.4599 10.46 10.833 9.99976 10.833H5.99992C5.53976 10.8329 5.16659 10.4599 5.16659 9.99968C5.16676 9.53965 5.53986 9.16643 5.99992 9.16635H9.99976ZM13.0002 5.16651L13.0849 5.17058C13.5053 5.21305 13.8335 5.56829 13.8336 5.99984C13.8336 6.43145 13.5053 6.78662 13.0849 6.82911L13.0002 6.83318H5.99992C5.53976 6.83309 5.16659 6.46003 5.16659 5.99984C5.16667 5.53973 5.53981 5.1666 5.99992 5.16651H13.0002ZM18.8336 11.8259C18.8336 13.3907 17.5647 14.6595 15.9999 14.6595H10.0844L6.15454 18.5894C5.91621 18.8276 5.55771 18.899 5.24634 18.77C4.935 18.6411 4.73208 18.3372 4.73202 18.0002V14.6595H4.00041C2.4356 14.6595 1.16675 13.3907 1.16675 11.8259V4.00033C1.16675 2.43552 2.4356 1.16667 4.00041 1.16667H15.9999C17.5647 1.16667 18.8336 2.43552 18.8336 4.00033V11.8259Z"
                              fill="#DB4388"
                            />
                          </svg>
                          <p>Экспертный день</p>
                        </div>
                        <div v-else class="calendar__day-event">
                          <span class="direction">{{ event.event_direction.direction }}</span>
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
              </ul>
            </ClientOnly>
          </div>
        </div>

        <div class="section__footer flex">
          <!-- Кнопки переключения месяцев -->
          <div class="calendar__controls">
            <button @click="prevMonth" class="controls-button prev">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.70711 6.29289C9.09763 6.68342 9.09763 7.31658 8.70711 7.70711L5.41421 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H5.41421L8.70711 16.2929C9.09763 16.6834 9.09763 17.3166 8.70711 17.7071C8.31658 18.0976 7.68342 18.0976 7.29289 17.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L7.29289 6.29289C7.68342 5.90237 8.31658 5.90237 8.70711 6.29289Z"
                />
              </svg>
            </button>
            <span class="value">{{ currentMonthName }}</span>
            <button @click="nextMonth" class="controls-button next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.2929 6.29289C14.9024 6.68342 14.9024 7.31658 15.2929 7.70711L18.5858 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H18.5858L15.2929 16.2929C14.9024 16.6834 14.9024 17.3166 15.2929 17.7071C15.6834 18.0976 16.3166 18.0976 16.7071 17.7071L21.7071 12.7071C22.0976 12.3166 22.0976 11.6834 21.7071 11.2929L16.7071 6.29289C16.3166 5.90237 15.6834 5.90237 15.2929 6.29289Z"
                />
              </svg>
            </button>
          </div>
          <div class="section__logo left-auto">
            <img src="/public/logo_mapp.svg" alt="Календарь Мероприятий МАПП" />
          </div>
        </div>
      </div>
    </section>

    <!-- Модальное окно -->

    <Modal v-if="selectedDay?.events" :show="showModal" @close="closeModal">
      <div class="modal-date">
        <span class="date">{{ format(selectedDay.date, 'dd MMMM', { locale: ru }) }}</span> —
        <span class="week-day">{{ getWeekdayName(selectedDay.date, $device.isTablet || $device.isMobile) }}</span>
      </div>
      <ul>
        <li v-for="event in selectedDay?.events" :key="event.id" class="card">
          <div class="card__bg"><ImageDirection :src="event.event_direction.direction" /></div>
          <div class="card__header">
            <div class="badge-group">
              <div class="badge white">{{ event.time }}</div>
              <div class="badge black">{{ event.event_direction.direction }}</div>
              <div class="badge zero">{{ event.event_type.type }}</div>
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
                  <img v-else src="/public/img/users/user_placeholder.png" alt="" />
                </div>
                <span class="name">{{ speaker.name }}</span>
              </div>
            </div>
            <a href="event.url" target="_blank" rel="noopener noreferrer">
              <span>Присоедениться</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15 5C14.4477 5 14 4.55228 14 4C14 3.44772 14.4477 3 15 3H20C20.5523 3 21 3.44772 21 4V9C21 9.55228 20.5523 10 20 10C19.4477 10 19 9.55228 19 9V6.41421L13.7071 11.7071C13.3166 12.0976 12.6834 12.0976 12.2929 11.7071C11.9024 11.3166 11.9024 10.6834 12.2929 10.2929L17.5858 5H15ZM8.16168 4H10.0002C10.5525 4 11.0002 4.44772 11.0002 5C11.0002 5.55228 10.5525 6 10.0002 6H8.2002C7.62365 6 7.25126 6.00078 6.9678 6.02393C6.69595 6.04613 6.59517 6.08383 6.54579 6.10899C6.35763 6.20487 6.20487 6.35763 6.109 6.54579C6.08383 6.59517 6.04614 6.69595 6.02393 6.9678C6.00078 7.25126 6 7.62365 6 8.2002V15.8002C6 16.3768 6.00078 16.7489 6.02393 17.0322C6.04612 17.3037 6.08378 17.4044 6.109 17.4539C6.20516 17.6426 6.35819 17.7956 6.54579 17.8912C6.59501 17.9163 6.69554 17.9539 6.96686 17.9761C7.2498 17.9992 7.62146 18 8.19691 18H15.8031C16.3786 18 16.75 17.9992 17.0327 17.9761C17.3036 17.9539 17.4041 17.9164 17.4534 17.8912C17.6418 17.7952 17.7955 17.6416 17.8912 17.4536C17.9163 17.4043 17.9539 17.3038 17.9761 17.0328C17.9992 16.75 18 16.3786 18 15.8031V14C18 13.4477 18.4477 13 19 13C19.5523 13 20 13.4477 20 14V15.8416C20 16.3677 20 16.8217 19.9695 17.1958C19.9372 17.5906 19.8659 17.9835 19.6732 18.3616C19.3855 18.9263 18.9257 19.3857 18.3614 19.6732C17.9833 19.8659 17.5905 19.9372 17.1957 19.9695C16.8217 20 16.3677 20 15.8416 20H8.15839C7.6323 20 7.17815 20 6.80397 19.9695C6.40906 19.9372 6.016 19.8659 5.63781 19.6732C5.07276 19.3853 4.61431 18.9258 4.32698 18.3619C4.13421 17.9835 4.06288 17.5904 4.03057 17.1951C3.99997 16.8206 3.99998 16.3659 4 15.8388V8.16168C3.99998 7.6345 3.99997 7.17965 4.03057 6.80498C4.06286 6.40962 4.13416 6.01624 4.32698 5.63781C4.6146 5.07332 5.07332 4.6146 5.63781 4.32698C6.01625 4.13416 6.40962 4.06286 6.80499 4.03057C7.17965 3.99997 7.6345 3.99998 8.16168 4Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </li>
      </ul>
    </Modal>
  </div>
</template>
