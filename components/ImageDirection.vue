<script setup>
  import { ClientOnly } from '#components'
  import { defineProps } from 'vue'

  defineProps({
    src: {
      type: String,
      required: true,
    },
  })

  function setSrc(imgSrc) {
    if (imgSrc == 'Коучинг') {
      return '/img/events/bg/kouching.jpg'
    } else if (imgSrc == 'Нутрициология') {
      return '/img/events/bg/nutriciologia.jpg'
    } else if (imgSrc == 'Сексология') {
      return '/img/events/bg/seksologia.jpg'
    } else if (imgSrc == 'Психология') {
      return '/img/events/bg/psihologia.jpg'
    } else if (imgSrc == 'Дизайн интерьера') {
      return '/img/events/bg/dizain-interera.jpg'
    } else if (imgSrc == 'Экспертный день') {
      return '/img/events/bg/ekspertniy-den.jpg'
    }
  }
</script>

<template>
  <ClientOnly><img :src="setSrc(src)" /></ClientOnly>
</template>
