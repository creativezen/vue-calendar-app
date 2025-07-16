# Календарь мероприятий МАПП (Nuxt 3)

Веб-приложение для отображения, фильтрации и просмотра событий. Пользователь может просматривать календарь событий, фильтровать их по направлениям, видеть подробности о каждом событии и спикерах.

---

## Cтек

- **Nuxt 3** (Vue 3, Composition API)
- **TypeScript**
- **Pinia** (state management)
- **SCSS** (модульная структура)
- **date-fns** (работа с датами)
- **@vueuse/motion** (анимации)
- **Axios** (HTTP-клиент)
- **@nuxt/image**, **@nuxtjs/device** (опционально)

---

## Структура

```
calendar-app/
├── components/
│   ├── Calendar/
│   │   ├── Calendar.vue
│   │   ├── CalendarControls.vue
│   │   ├── CalendarDays.vue
│   │   ├── CalendarWeekDays.vue
│   │   └── CalendarFilter.vue
│   ├── Header.vue
│   ├── Main.vue
│   ├── Modal.vue
│   └── Icons/
├── pages/
│   ├── index.vue
│   ├── contacts.vue
│   └── admin/auth.vue
├── stores/
│   ├── eventsStore.ts
│   └── uiStore.ts
├── types/
│   └── index.ts
├── assets/scss/
├── public/data/
│   ├── events.json
│   └── directions.json
└── nuxt.config.ts
```

---

## Основная бизнес-логика

- Отображение событий по дням с возможностью переключения месяцев.
- Модальное окно с деталями события.
- Адаптивность (десктоп/мобильные).
- События внутри дня сортируются по времени (`event.time`) по возрастанию.
- Фильтрация по направлениям через компонент `CalendarFilter.vue` (мультивыбор, кнопка "Показать все").
- Все запросы к API строятся на основе `${useRuntimeConfig().public.apiUrl}/api/v1/...`.
- Базовые пути к API предварительно настраиваются через nuxt.config.ts

---

## Основные сущности

### Event

```ts
interface Event {
  id: string;
  title: string;
  text: string;
  time: string;
  url: string;
  date: string; // YYYY-MM-DD
  status: boolean;
  type_id: number;
  direction_id: number;
  direction: Direction;
  type: Type;
  speakers: Speaker[];
  created_at?: string;
  updated_at?: string;
}
```

### Direction

```ts
interface Direction {
  id: number;
  direction: string;
  color: string;
  text?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Type

```ts
interface Type {
  id: number;
  type: string;
  created_at?: string;
  updated_at?: string;
}
```

### Speaker

```ts
interface Speaker {
  id: number;
  name: string;
  photo: string | null;
  text: string | null;
  created_at?: string;
  updated_at?: string;
}
```

---

## Запуск проекта

1. Установите зависимости:

   ```bash
   yarn install
   # или
   npm install
   ```

2. Запустите dev-сервер:

   ```bash
   yarn dev
   # или
   npm run dev
   ```

---
