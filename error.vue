<template>
  <section class="section">
    <div class="container">
      <div class="section__header">
        <h2 class="title">404 - Странница не найдена</h2>
      </div>
      <div class="section__body"></div>
      <div class="section__footer">
        <NuxtLink to="/" class="button" :key="$route.path">На главную</NuxtLink>
      </div>
    </div>
  </section>
</template>
