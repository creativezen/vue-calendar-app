// Направление мероприятия
export interface EventDirection {
  id: number
  direction: string
  color: string
  text?: string // Поле присутствует в данных
  created_at?: string // Опциональное поле
  updated_at?: string // Опциональное поле
}

// Тип мероприятия
export interface EventType {
  id: number
  type: string
  created_at?: string // Присутствует в данных
  updated_at?: string // Присутствует в данных
}

// Спикер
export interface Speaker {
  id: number
  name: string
  photo: string | null
  text: string | null // Встречается как строка или null
  created_at?: string
  updated_at?: string
}

// Мероприятие
export interface Event {
  id: string // UUID в формате строки, например: "06340170-dfae-41c5-a280-1cd0b7d13b34"
  title: string
  text: string
  time: string
  url: string
  date: string // Формат даты: "YYYY-MM-DD"
  status: boolean // Поле есть в данных
  type_id: number // ID типа события
  direction_id: number // ID направления
  event_direction: EventDirection
  event_type: EventType
  speakers: Speaker[]
  created_at?: string
  updated_at?: string
}
