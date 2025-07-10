<template>
  <Header />

  <Main>
    <slot />
  </Main>

  <!-- <Footer /> -->
</template>

<style lang="scss" global>
  #__nuxt {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
