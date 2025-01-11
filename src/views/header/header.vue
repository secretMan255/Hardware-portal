<template>
     <v-app-bar app dense>
               <!-- <v-toolbar-title>company name</v-toolbar-title> -->
               <div class="app-bar-content">
                    <p class="company-name" @click="navigationTo('/')">Company Name</p>
                    <p class="nav-link" @click="navigationTo('/')">HOME</p>
                    <p class="nav-link" @click="navigationTo('/about')">ABOUT US</p>
                    <p class="nav-link" @click="navigationTo('/product')">PRODUCT</p>
               </div>
               <!-- <v-btn to="/" plain>Home</v-btn>
          <v-btn to="/about" plain>About</v-btn> -->
     </v-app-bar>
</template>

<script setup>
import { useRouter} from 'vue-router'

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
</style>