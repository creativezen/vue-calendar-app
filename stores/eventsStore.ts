import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Event } from '@/types'
import axios from 'axios'

export const useEventsStore = defineStore('events', () => {
  // URL для получения всех мероприятий
  const URL_EVENTS = `${useRuntimeConfig().public.apiUrl}/api/v1/event/all`

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
  async function getAllEvents() {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(URL_EVENTS, {
        withCredentials: true,
      })
      events.value = response.data.all_events || []
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке мероприятий'
    } finally {
      loading.value = false
    }
  }

  // Возвращаем функции для использования в компонентах
  return {
    getAllEvents,
    getEventsByDate,
    events,
    loading,
    error,
  }
})
