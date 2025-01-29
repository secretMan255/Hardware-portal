<template>
  <v-app>
    <HeaderView />
    <v-main>
      <router-view />
      <WhatsApp />
    </v-main>
    <FooterView v-if="showFooter"></FooterView>
    
  </v-app>
</template>

<script setup>
import HeaderView from './views/header/header.vue'
import FooterView from './views/footer/footer.vue'
import WhatsApp from './views/whatsapp/whatsapp.vue'
import { useRoute } from 'vue-router';

const route = useRoute()

const showFooter = computed(() => {
  return route.name !== 'Product'
})
</script>
