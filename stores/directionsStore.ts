import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Direction } from '@/types'
import axios from 'axios'

export const useDirectionsStore = defineStore('directions', () => {
  // URL для получения всех мероприятий
  const URL_DIRECTIONS = `${useRuntimeConfig().public.apiUrl}/api/v1/direction/all`

  // Состояние хранилища
  const directions = ref<Direction[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Получаем все мероприятия
  async function getAllDirections() {
    // uiStore.setLoading('directions', true)
    // uiStore.setError('directions', null)
    try {
      const response = await axios.get(URL_DIRECTIONS, {
        withCredentials: true,
      })
      directions.value = response.data.data || []
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке мероприятий'
    } finally {
      loading.value = false
    }
  }

  return {
    getAllDirections,
    directions,
    loading,
    error,
  }
})
