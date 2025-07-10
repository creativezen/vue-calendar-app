// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Календарь мероприятий МАПП',
      meta: [{ name: 'description', content: 'Календарь мероприятий Международной Ассоциации Помогающих Профессий' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  },
  css: ['~/assets/scss/main.scss'],
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxtjs/device'],
  plugins: ['~/plugins/motion.client.ts'],
})
