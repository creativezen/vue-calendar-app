<script setup>
  import { ref } from 'vue'

  // === Модальное окно ===
  const showModal = ref(false)

  function openMenuModal() {
    showModal.value = true
    document.body.classList.add('disable-scroll')
  }

  function closeModal() {
    showModal.value = false
    document.body.classList.remove('disable-scroll')
  }
</script>

<template>
  <div>
    <header class="header">
      <div class="container">
        <div class="header__content">
          <div class="header__logo">
            <img src="/logo_mapp.svg" alt="Календарь Мероприятий МАПП" />
          </div>
          <menu v-if="$device.isDesktop" class="header__menu">
            <li>
              <nuxt-link to="https://lp-edpro.ru/lk/25/common/association/">Перейти на сайт</nuxt-link>
            </li>
            <li>
              <nuxt-link to="https://t.me/vershinina_anastasiya" target="_blank">Задать вопрос</nuxt-link>
            </li>
          </menu>
          <div v-if="$device.isMobile || $device.isTablet" class="header__burger">
            <button @click="openMenuModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 17L20.1025 17.0049C20.6067 17.0562 21 17.4823 21 18C21 18.5177 20.6067 18.9438 20.1025 18.9951L20 19H4C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17H20ZM20 11L20.1025 11.0049C20.6067 11.0562 21 11.4823 21 12C21 12.5177 20.6067 12.9438 20.1025 12.9951L20 13H9.5C8.94772 13 8.5 12.5523 8.5 12C8.5 11.4477 8.94772 11 9.5 11H20ZM20 5L20.1025 5.00488C20.6067 5.05621 21 5.48232 21 6C21 6.51768 20.6067 6.94379 20.1025 6.99512L20 7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5H20Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Модальное окно -->

    <Modal v-if="$device.isMobile || $device.isTablet" :show-modal="showModal" :close-modal="closeModal">
      <ul>
        <li>
          <nuxt-link to="https://lp-edpro.ru/lk/25/common/association/">Перейти на сайт</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/contacts">Задать вопрос</nuxt-link>
        </li>
      </ul>
    </Modal>
  </div>
</template>
