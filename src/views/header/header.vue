<template>
  <v-app-bar app dense>
    <v-btn
      icon
      v-show="isMobile"
      @click="toggleDrawer"
      class="menu-button"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <div class="app-bar-content">
      <p class="agdasima-bold" @click="navigationTo('/')">WINGMAN</p>
      <div class="nav-links-container mt-1" v-show="!isMobile">
        <span class="nav-link" @click="navigationTo('/')">HOME</span>
        <span class="nav-link" @click="navigationTo('/about')">ABOUT US</span>
        <span class="nav-link" @click="navigationTo('/product')">PRODUCT</span>
      </div>
    </div>
    <div class="profile-card">
      <!-- <profile></profile>
      <cart></cart>-->
    </div> 
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    right
    class="mobile-drawer"
  >
    <v-list>
      <v-list-item
        link
        @click="navigationTo('/')"
      >
        <span class="drawer-font">HOME</span>
      </v-list-item>
      <v-list-item
        link
        @click="navigationTo('/about')"
      >
        <span class="drawer-font">ABOUT US</span>
      </v-list-item>
      <v-list-item
        link
        @click="navigationTo('/product')"
      >
      <span class="drawer-font">PRODUCT</span>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
// import cart from './cart.vue'
// import profile from './profile.vue'

const router = useRouter()
const isMobile = ref(false)
const drawer = ref(false)

function navigationTo(where) {
  router.push(where)
  drawer.value = false
}

function toggleDrawer() {
  drawer.value = !drawer.value
}

function checkMobileView() {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= 600

  if (!isMobile.value && wasMobile) {
    drawer.value = false
  }
}

onMounted(() => {
  checkMobileView()
  window.addEventListener('resize', checkMobileView)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobileView)
})
</script>

<style scoped>
.agdasima-bold {
  font-family: "Agdasima", serif;
  font-weight: bold;
  font-style: normal;
  font-size: 25px;
}

.app-bar-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 32px;
}

.company-name {
  cursor: pointer;
  font-weight: bold;
  font-size: 25px;
}

.nav-links-container {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  color: black;
}

.nav-link:hover {
  color: #5c5c5c;
}

.drawer-font {
  font-weight: bold;
  color: black;
}

.profile-card {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 43px;
}

.menu-button {
  margin-right: 10px;
}

.mobile-drawer {
  z-index: 3000;
}

@media (max-width: 600px) {
  .nav-links-container {
    display: none;
  }

  .menu-button {
    display: block;
  }
}
</style>
