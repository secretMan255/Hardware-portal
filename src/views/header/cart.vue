<template>
     <v-menu
        min-width="200px"
        rounded
     >
          <template v-slot:activator="{ props }">
               <v-btn icon v-bind="props">
                    <v-badge :content="itemCount">
                         <v-avatar icon="mdi-cart-outline"></v-avatar>
                    </v-badge>
               </v-btn>
          </template>
          <v-card :width="loginStatus ? '550' : '500'" class="scrollable-menu" @click.stop>
               <v-card-text>
                    <div v-if="loginStatus" class="mx-auto text-center">
                         <v-row dense v-if="cart.length > 0">
                              <v-col v-for="(item, index) in cart" :key="index" cols="12" md="12" class="d-flex align-center justify-space-between">
                                   <v-img :aspect-ratio="1" max-height="50" max-width="100" :src="getProductImage(item.name)"></v-img>  
                                   <span class="text-subtitle-1">{{ item.name }}</span> 
                                   <div class="">
                                        <v-icon class="mr-5" @click.stop="minusItem(item.name)" >mdi-minus</v-icon>
                                        <span>{{ item.qty }}</span>
                                        <v-icon class="ml-5" @click.stop="plusItem(item.name)">mdi-plus</v-icon>
                                   </div>
                              </v-col>
                         </v-row>
                         <v-row v-else="cart.length <= 0" class="text-center d-flex align-center justify-center">
                              <v-empty-state
                                   image="https://vuetifyjs.b-cdn.net/docs/images/components/v-empty-state/astro-dog.svg"
                                   size="100"
                                   text-width="250"
                              >
                                   <template v-slot:media>
                                        <v-img class="mb-8"></v-img>
                                   </template>

                                   <template v-slot:title>
                                        <div class="text-h6 text-high-emphasis">Empty in cart</div>
                                   </template>

                                   <template v-slot:text>
                                        <div class="text-body-1">Add some item here</div>
                                   </template>
                              </v-empty-state>
                         </v-row>
                         <v-divider class="my-3"></v-divider>
                         <v-btn
                              variant="text"
                              rounded
                         >
                              CHECKOUT
                         </v-btn>
                    </div>
                    <div v-else class="mx-auto text-center">
                         
                              <p class="text-caption mt-1">
                                   You are not logged in.
                              </p>
                              <v-btn
                                   variant="text"
                                   rounded
                                   @click="login"
                              >
                                   LOGIN
                              </v-btn>
                    </div>
               </v-card-text>
          </v-card>
     </v-menu>
</template>

<script>
import { EventBus } from '../../utils/utils'

export default {
     data: () => ({
          loginStatus: false,
          user: null,
          cart: [],
     }),
     computed: {
          itemCount() {
               return this.cart.reduce((total, item) => total + item.qty, 0);
          }
     },
     methods: {
          minusItem(itemName){
               const itemIndex = this.cart.findIndex(cartItem => cartItem.name === itemName)

               if (itemIndex !== -1) {
                    const qty = this.cart[itemIndex].qty
                    
                    if (qty === 1) {
                         this.cart.splice(itemIndex, 1)
                    } else {
                         this.cart[itemIndex].qty -= 1
                    }

                    sessionStorage.setItem('cart' , JSON.stringify(this.cart))
               }
          },
          plusItem(itemName){
               const itemIndex = this.cart.findIndex(cartItem => cartItem.name === itemName)

               if (itemIndex !== -1) {
                    this.cart[itemIndex].qty += 1

                    sessionStorage.setItem('cart' , JSON.stringify(this.cart))
               }
          },
          getProductImage(productName) {
               console.log('product: ' , productName)
               return new URL(`https://storage.googleapis.com/veryhardware/${productName}.jpeg`).href
          },
          handleUserLoggedIn(user) {
               if (user) {
                    this.user = user
                    this.loginStatus = true
               }               
          },
          handleUserLoggedOut(user) {
               this.user = null
               this.loginStatus = false
          },
          addItemToCart(item) {
               const existingItemIndex = this.cart.findIndex(cartItem => cartItem.name === item.name)
               if (existingItemIndex !== -1) {
                    this.cart[existingItemIndex].qty += 1
               } else {
                    this.cart.push({ name: item.name, qty: 1 })
               }
               sessionStorage.setItem('cart', JSON.stringify(this.cart))
          },
          checkLogin() {
               const getUserIdSession = sessionStorage.getItem('user')
               if (getUserIdSession) {
                    const jsonUser = JSON.parse(getUserIdSession)
                    console.log('jsonUser: ' , jsonUser)
                    this.user = jsonUser.id
                    this.loginStatus = true
               } 
               console.log('getUserIdSession: ' , getUserIdSession)

               const itemSession = sessionStorage.getItem('cart')
               if (itemSession) {
                    const jsonCart = JSON.parse(itemSession)
                    this.cart = []
                    jsonCart.forEach(item => {
                         this.cart.push({ name: item.name, qty: item.qty })
                    })
               }
          },
          login() {

          }
     },
     mounted() {
          this.checkLogin()
          EventBus.on('user-login-in', this.handleUserLoggedIn)
          EventBus.on('user-logout-out', this.handleUserLoggedOut)
          EventBus.on('add-to-cart', this.addItemToCart)
     },
     beforeMount() {
          EventBus.off('user-login-in', this.handleUserLoggedIn)
          EventBus.off('user-logout-out', this.handleUserLoggedOut)
          EventBus.off('add-to-cart', this.addItemToCart)
     }
}
</script>

<style scoped>
.scrollable-menu {
     overflow-y: auto;
}
.scrollable-menu {
     max-height: 400px;
     overflow-y: auto;
}
</style>