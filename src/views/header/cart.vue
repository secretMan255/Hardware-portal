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
          <v-card style="max-height: 400px; width: 400px;" :width="loginStatus ? '550' : '500'" class="scrollable-menu" @click.stop>
               <v-card-text>
                    <div v-if="loginStatus" class="mx-auto text-center">
                         <v-row dense v-if="cart.length > 0">
                              <v-col v-for="(item, index) in cart" :key="index" cols="12" md="12" class="d-flex align-center justify-space-between mb-1">
                                   <v-img :aspect-ratio="1" max-height="50" max-width="100" :src="getProductImage(item.name)"></v-img> 
                                        <div class="d-flex flex-column"> 
                                             <span class="text-subtitle-1">{{ item.name }}</span> 
                                             <span class="text-grey"> Stock remain: {{ item.stock_remain }} </span>
                                        </div>
                                        <v-icon @click.stop="minusItem(item.name)" >mdi-minus</v-icon>
                                        <span> {{ item.qty }} </span>
                                        <v-icon @click.stop="plusItem(item.name)">mdi-plus</v-icon>
                                   <v-icon @click.stop="removeItem(item.name)">mdi-close</v-icon>
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
                              @click="checkOut"
                              :disabled="cart.length <= 0"
                         >
                              CHECKOUT
                         </v-btn>
                    </div>
                    <div v-else class="mx-auto text-center">
                         
                              <p class="font-weight-bold text-caption mt-1">
                                   You are not logged in
                              </p>
                              <p class="text-caption"> 
                                   Please click profile to login before add item to cart.
                              </p>
                    </div>
               </v-card-text>
          </v-card>
     </v-menu>

     <v-snackbar
          v-model="snackbar"
          vertical
     >
          <div class="text-subtitle-1 pb-2">Cart</div>

          <p>{{ snackBarMsg }}</p>

          <template v-slot:actions>
          <v-btn
               color="indigo"
               variant="text"
               @click="snackbar = false"
          >
               Close
          </v-btn>
          </template>
     </v-snackbar>
</template>

<script>
import { CallApi } from '../../CallApi/callApi';
import { EventBus } from '../../utils/utils'
import { executeRecaptcha } from '../../utils/utils'

export default {
     data: () => ({
          loginStatus: false,
          user: null,
          cart: [],
          snackbar: false,
          snackBarMsg: ''
     }),
     computed: {
          itemCount() {
               return this.cart.length;
          }
     },
     methods: {
          async minusItem(itemName){
               const itemIndex = this.cart.findIndex(cartItem => cartItem.name === itemName)

               if (itemIndex !== -1 && this.loginStatus) {

                    const data = {
                         userId: this.user,
                         itemId: this.cart[itemIndex].id,
                         recaptchaToken: await executeRecaptcha('email_login')
                    }

                    try {
                         const res = await CallApi.minusItemFromCart(data)
                         
                         if (res.ret == 0) {
                              if (res.data?.[0]?.msg) {
                                   this.snackbar = true
                                   this.snackBarMsg = `${itemName} is out of stock, please contact us.`
                                   return 
                              }

                              this.cart = res.data
                              sessionStorage.setItem('cart', JSON.stringify(this.cart))
                         }
                    } catch (err) {
                         this.cart = []
                    }
               }
          },
          async plusItem(itemName){
               const itemIndex = this.cart.findIndex(cartItem => cartItem.name === itemName)

               if (itemIndex !== -1 && this.loginStatus) {
                   
                    const data = {
                         userId: this.user,
                         itemId: this.cart[itemIndex].id,
                         recaptchaToken: await executeRecaptcha('email_login')
                    }

                    try {
                         const res = await CallApi.addItemToCart(data)

                         if (res.ret == 0) {
                              if (res.data?.[0]?.msg) {
                                   this.snackbar = true
                                   this.snackBarMsg = `${itemName} ${res.data[0].msg}`
                                   return 
                              }

                              this.cart = res.data
                              sessionStorage.setItem('cart', JSON.stringify(this.cart))
                         }
                    } catch (err) {
                         this.cart = []
                    }
               }
          },
          async removeItem(itemName) {
               const itemIndex = this.cart.findIndex(cartItem => cartItem.name === itemName)

               if (itemIndex !== -1 && this.loginStatus) {
                    const data = {
                         userId: this.user,
                         itemId: this.cart[itemIndex].id,
                         recaptchaToken: await executeRecaptcha('email_login')
                    }

                    this.cart.splice(itemIndex, 1)
                   
                    try {
                         const res = await CallApi.removeItemFromCart(data)
                         
                         if (res.ret == 0 && res.data?.length > 0) {
                              this.cart = res.data
                              sessionStorage.setItem('cart', JSON.stringify(this.cart))
                         }
                    } catch (err) {
                         this.cart = []
                    }
               }
          },
          getProductImage(productName) {
               return new URL(`https://storage.googleapis.com/veryhardware/${productName}.jpeg`).href
          },
          async addItemToCart(item) {
               const data = {
                    userId: this.user,
                    itemId: item.id,
                    recaptchaToken: await executeRecaptcha('email_login')
               }

               try {
                    const res = await CallApi.addItemToCart(data)

                    if (res.ret == 0) {
                         if (res.data?.[0]?.msg) {
                              this.snackbar = true
                              this.snackBarMsg = `${item.name} ${res.data[0].msg}`
                              return 
                         }

                         this.cart = res.data
                         sessionStorage.setItem('cart', JSON.stringify(this.cart))
                    }
               } catch (err) {
                    this.cart = []
               }
          },
          handleUserLoggedIn(user) {
               if (user) {
                    this.user = user
                    this.loginStatus = true
                    this.checkLogin()
               } else {
                    this.checkLogin()
               }
          },
          handleUserLoggedOut(user) {
               this.user = null
               this.loginStatus = false
               this.cart = []
               sessionStorage.removeItem('cart')
          },
          async checkLogin() {
               const getUserIdSession = sessionStorage.getItem('user')
               
               if (getUserIdSession) {
                    const jsonUser = JSON.parse(getUserIdSession)
                    this.user = jsonUser.id
                    this.loginStatus = true
               } 

               if (!this.user) {
                    return
               }

               try {
                    const getItem = await CallApi.getCart(this.user)
                    
                    if (getItem.ret == 0 && getItem.data?.length > 0) {
                         getItem.data.forEach(item => {
                              this.cart.push(item)
                         })
                         sessionStorage.setItem('cart', JSON.stringify(this.cart))
                    }
               } catch (err) {
                    this.cart = []
               } 
          },
          async checkOut(){
               const userInfor = sessionStorage.getItem('user')
               
               if (userInfor.phone) {
                    this.snackbar = true
                    this.snackBarMsg = 'Please update your profile with a phone number before proceeding to checkout.'
                    return
               } else if (userInfor.address) {
                    this.snackbar = true
                    this.snackBarMsg = 'Please update your profile with a address before proceeding to checkout.'
                    return
               } else if (userInfor.postCode) {
                    this.snackbar = true
                    this.snackBarMsg = 'Please update your profile with a postcode before proceeding to checkout.'
                    return
               } else if (userInfor.city) {
                    this.snackbar = true
                    this.snackBarMsg = 'Please update your profile with a city before proceeding to checkout.'
                    return
               } else if (userInfor.country) {
                    this.snackbar = true
                    this.snackBarMsg = 'Please update your profile with a country before proceeding to checkout.'
                    return
               }

               const data = {
                    userId: this.user,
                    recaptchaToken: await executeRecaptcha('email_login')
               }

               const res = await CallApi.checkout(data)
          }
     },
     mounted() {
          EventBus.on('user-login-in', this.handleUserLoggedIn)
          EventBus.on('user-logout-out', this.handleUserLoggedOut)
          EventBus.on('add-to-cart', this.addItemToCart)
     },
     beforeMount() {
          this.checkLogin()
          EventBus.off('user-login-in', this.handleUserLoggedIn)
          EventBus.off('user-logout-out', this.handleUserLoggedOut)
          EventBus.off('add-to-cart', this.addItemToCart)
     }
}
</script>

<style scoped>
.scrollable-menu {
     max-height: 400px;
     overflow-y: auto;
     min-width: 250px;
     max-width: 100%;
     width: 100%;
}
</style>