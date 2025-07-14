import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Event } from '@/types'
import { useUiStore } from './uiStore'
import axios from 'axios'

/**
 * eventsStore.ts
 *
 * Данное хранилище (store) отвечает за загрузку и хранение списка мероприятий (events) из API.
 *
 * Для чего нужно:
 * - Позволяет централизованно получать и хранить мероприятия, используемые в приложении (например, для отображения в календаре).
 * - Управляет состоянием загрузки и ошибок для мероприятий с помощью uiStore.
 * - Предоставляет функцию для получения всех мероприятий с сервера.
 *
 * Использование:
 * - Импортируйте и используйте useEventsStore() в компонентах для доступа к списку мероприятий и функции их загрузки.
 */

export const useEventsStore = defineStore('events', () => {
  const uiStore = useUiStore()
  // URL для получения всех мероприятий
  const URL_EVENTS = `${useRuntimeConfig().public.apiUrl}/api/v1/event/all`

  // Состояние хранилища
  const events = ref<Event[]>([])

  // Получаем все мероприятия
  async function getAllEvents() {
    uiStore.setLoading('events', true)
    uiStore.setError('events', null)

    try {
      const response = await axios.get(URL_EVENTS, {
        withCredentials: true,
      })
      events.value = response.data.data || []
    } catch (err: any) {
      uiStore.setError('events', err.message || 'Ошибка при загрузке мероприятий')
    } finally {
      uiStore.setLoading('events', false)
    }
  }

  // Возвращаем функции для использования в компонентах
  return {
    getAllEvents,
    events,
  }
})
