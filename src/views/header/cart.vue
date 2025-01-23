<template>
     <v-menu
        min-width="200px"
        rounded
      >
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
          <v-avatar icon="mdi-cart-outline"></v-avatar>
          </v-btn>
        </template>
        <v-card :width="loginStatus ? '700' : '500'">
               <div v-if="loginStatus" class="mx-auto text-center">
                     <v-cad-text>
                         {{ cart }}
                         <v-divider class="my-3"></v-divider>
                         <v-btn
                              variant="text"
                              rounded
                         >
                              CHECKOUT
                         </v-btn>
                    </v-cad-text>
               </div>
               <div v-else class="mx-auto text-center">
                    <v-card-text>
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
                    </v-card-text>
               </div>
        </v-card>
      </v-menu>
</template>

<script>
import { EventBus } from '../../utils/utils'

export default {
     data: () => ({
          loginStatus: false,
          user: null,
          cart: []
     }),
     methods: {
          handleUserLoggedIn(user) {
               if (user) {
                    this.user = user
                    this.loginStatus = true
               } 
               console.log('getUser: ', this.user)
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

               sessionStorage.removeItem('cart')
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