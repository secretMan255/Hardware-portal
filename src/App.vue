<template>
  <v-app>
    <HeaderView />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import HeaderView from './views/header/header.vue'
</script>
