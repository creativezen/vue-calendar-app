import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Event } from '@/types'

export const useEventsStore = defineStore('events', () => {
  // Состояние хранилища
  const events = ref<Event[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Фильтрация мероприятий по дате
  const getEventsByDate = computed(() => {
    return (date: string) => {
      return events.value.filter((event) => event.date === date)
    }
  })

  // Получаем все мероприятия
  async function fetchEvents() {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get<Event[]>('/api/events')
      events.value = response.data.all_events || []
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке мероприятий'
    } finally {
      loading.value = false
    }
  }

  // Возвращаем функции для использования в компонентах
  return {
    getEventsByDate,
    events,
    loading,
    error,
    fetchEvents,
  }
})
