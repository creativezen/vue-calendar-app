import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * uiStore.ts
 *
 * Данный модуль реализует Pinia store для управления состоянием загрузки (loading) и ошибок (error) различных сущностей приложения.
 *
 * Как работает:
 * - Для каждой сущности (например, 'events', 'directions') хранится свой статус загрузки и ошибка.
 * - loadingMap: объект, где ключ — имя сущности, значение — булево, показывающее, идет ли загрузка.
 * - errorMap: объект, где ключ — имя сущности, значение — текст ошибки или null.
 * - setLoading(key, value): установить статус загрузки для сущности.
 * - setError(key, error): установить текст ошибки для сущности.
 * - clearError(key): сбросить ошибку для сущности.
 *
 * Для чего нужен:
 * - Позволяет централизованно отслеживать и управлять состояниями загрузки и ошибок в разных частях приложения (например, при запросах к API).
 * - Упрощает отображение индикаторов загрузки и сообщений об ошибках в UI.
 */

export const useUiStore = defineStore('ui', () => {
  // loadingMap и errorMap: ключ — имя сущности (например, 'events', 'directions')
  const loadingMap = ref<Record<string, boolean>>({})
  const errorMap = ref<Record<string, string | null>>({})

  function setLoading(key: string, value: boolean) {
    loadingMap.value[key] = value
  }

  function setError(key: string, error: string | null) {
    errorMap.value[key] = error
  }

  function clearError(key: string) {
    errorMap.value[key] = null
  }

  return {
    loadingMap,
    errorMap,
    setLoading,
    setError,
    clearError,
  }
})
