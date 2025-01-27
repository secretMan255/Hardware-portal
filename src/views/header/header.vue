<template>
  <v-app-bar app dense>
    <div class="app-bar-content">
      <p class="company-name" @click="navigationTo('/')">Company Name</p>
      <div class="nav-links-container">
        <p class="nav-link" @click="navigationTo('/')">HOME</p>
        <p class="nav-link" @click="navigationTo('/about')">ABOUT US</p>
        <p class="nav-link" @click="navigationTo('/product')">PRODUCT</p>
      </div>
    </div>
    <div class="profile-card">
      <profile></profile> 
      <cart></cart>
    </div>
  </v-app-bar>
</template>

<script setup>
import { useRouter} from 'vue-router'
import cart from './cart.vue';
import profile from './profile.vue'

const router = useRouter()

function navigationTo(where) {
     router.push(where)
}
</script>

<style>
.app-bar-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 32px;
}

.company-name {
  cursor: pointer;
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

.profile-card {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-right: 10px;
}

@media (max-width: 600px) {
  .app-bar-content {
    display: inline;
    flex-direction: column;
    align-items: center; 
  }

  .company-name {
    text-align: center;
  }

  .nav-links-container {
    justify-content: center;
  }

  .profile-card {
    justify-content: center;
  }
}
</style>