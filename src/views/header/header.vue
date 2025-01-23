<template>
     <v-app-bar app dense>
                <div class="app-bar-content">
                    <p class="company-name" @click="navigationTo('/')">Company Name</p>
                    <p class="nav-link" @click="navigationTo('/')">HOME</p>
                    <p class="nav-link" @click="navigationTo('/about')">ABOUT US</p>
                    <p class="nav-link" @click="navigationTo('/product')">PRODUCT</p>
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
  width: 100%;
  gap: 32px;
}

.profile-card {
  display: flex;
  align-items: center;
  justify-content: end;
}

.nav-link {
  cursor: pointer;
  margin-left: 16px;
  color: black; 
  text-decoration: none;
  font-size: medium;
  font-weight: bold;
}

.nav-link:hover {
  text-decoration: none;
  color: #5c5c5c;
}

@media (max-width: 600px) {
  .app-bar-content {
    align-items: center; 
  }

  .profile-card {
    margin-left: auto;
    flex-direction: row;
    align-items: center;
  }

  .nav-link {
    font-size: small; /* Reduce font size */
    margin-left: 0; /* Remove margin */
  }

  .company-name {
    font-size: medium; /* Adjust company name size */
  }
}
</style>