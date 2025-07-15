<script setup>
  /**
   * Компонент CalendarFilter отвечает за отображение фильтра по направлениям для календаря мероприятий.
   * Он показывает список всех доступных направлений (allDirections) в виде кнопок, позволяя пользователю выбрать одно или несколько направлений для фильтрации событий календаря.
   * Также есть кнопка "Показывать все" для сброса фильтра и отображения всех направлений.
   * Компонент отображает индикатор загрузки и сообщение об ошибке, если данные направлений загружаются или произошла ошибка.
   * Внешние обработчики (toggleDirection, showAllDirections) и данные (selectedDirections, directionsLoading, directionsError) передаются через props.
   */

  const props = defineProps({
    allDirections: {
      type: Array,
      required: true,
    },
    selectedDirections: {
      type: Array,
      required: true,
    },
    directionsLoading: {
      type: Boolean,
      required: true,
    },
    directionsError: {
      type: [String, null],
      required: false,
      default: null,
    },
    toggleDirection: {
      type: Function,
      required: true,
    },
    showAllDirections: {
      type: Function,
      required: true,
    },
  })
</script>

<template>
  <div class="filter-directions">
    <button class="button-filter" :class="{ active: !selectedDirections.length }" @click="showAllDirections">Показывать все</button>
    <template v-if="!directionsLoading && !directionsError">
      <button
        v-for="direction in allDirections"
        :key="direction.id"
        class="button-filter"
        :class="{ active: selectedDirections.includes(direction.id) }"
        @click="toggleDirection(direction.id)"
        :style="{
          'background-color': selectedDirections.includes(direction.id) ? direction.color : '#fff',
          color: selectedDirections.includes(direction.id) ? '#fff' : '#000',
          borderColor: direction.color,
        }"
      >
        {{ direction.direction }}
      </button>
    </template>
    <span v-if="directionsLoading" class="filter-directions__loading">Загрузка направлений...</span>
    <span v-if="directionsError" class="filter-directions__error">Ошибка: {{ directionsError }}</span>
  </div>
</template>
