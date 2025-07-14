import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Direction } from '@/types'
import { useUiStore } from './uiStore'
import axios from 'axios'

/**
 * directionsStore.ts
 *
 * Данное хранилище (store) отвечает за загрузку и хранение списка направлений (directions) из API.
 *
 * Для чего нужно:
 * - Позволяет централизованно получать и хранить направления, используемые в приложении (например, для фильтрации мероприятий по направлениям).
 * - Управляет состоянием загрузки и ошибок для направлений с помощью uiStore.
 * - Предоставляет функцию для получения всех направлений с сервера.
 *
 * Использование:
 * - Импортируйте и используйте useDirectionsStore() в компонентах для доступа к списку направлений и функции их загрузки.
 */

export const useDirectionsStore = defineStore('directions', () => {
  const uiStore = useUiStore()
  // URL для получения всех мероприятий
  const URL_DIRECTIONS = `${useRuntimeConfig().public.apiUrl}/api/v1/direction/all`

  // Состояние хранилища
  const directions = ref<Direction[]>([])

  // Получаем все мероприятия
  async function getAllDirections() {
    uiStore.setLoading('directions', true)
    uiStore.setError('directions', null)
    try {
      const response = await axios.get(URL_DIRECTIONS, {
        withCredentials: true,
      })
      directions.value = response.data.data || []
    } catch (err: any) {
      uiStore.setError('directions', err.message || 'Ошибка при загрузке мероприятий')
    } finally {
      uiStore.setLoading('directions', false)
    }
  }

  return {
    getAllDirections,
    directions,
  }
})
