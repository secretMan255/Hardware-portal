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
                                   <div class="d-flex flex-column ml-5 mr-5"> 
                                        <span class="text-bold mb-1">{{ item.name }}</span> 
                                        <span class="text-grey">{{ priceDecimal(item.price, 'RM') }}</span>
                                        <span class="text-grey"> Stock remain: {{ item.stock_remain }} </span>
                                   </div>
                                   <v-icon @click.stop="minusItem(item.name)" class="ml-2 mr-2">mdi-minus</v-icon>
                                   <span> {{ item.qty }} </span>
                                   <v-icon @click.stop="plusItem(item.name)" class="ml-2">mdi-plus</v-icon>
                                   <v-icon @click.stop="removeItem(item.name)" class="ml-2">mdi-close</v-icon>
                              </v-col>
                              <v-col cols="12" md="12" class="mt-3">
                                   TOTAL AMOUNT: {{ priceDecimal(totalAmt, 'RM') }}
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
                              :disabled="cart.length <= 0 || !checkoutBtn"
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

     <checkOut 
          ref="checkoutComponent"
          v-model="checkoutDialog"
          :userId="user"
          :checkoutList="checkoutList"
          :itemFee="itemFee"
          :stateFee="stateFee"
     ></checkOut>
</template>

<script>
import { CallApi } from '../../CallApi/callApi';
import { EventBus } from '../../utils/utils'
import { executeRecaptcha, priceDecimal, getProductImage } from '../../utils/utils'
import CheckOut from '../checkout/cehckout.vue'

export default {
     data: () => ({
          checkoutBtn: false,
          checkoutDialog: false,
          loginStatus: false,
          snackbar: false,
          snackBarMsg: '',
          user: null,
          cart: [],
          checkoutList: [],
          itemFee: [],
          stateFee: 0,
          totalAmt: 0,
     }),
     components: {
          CheckOut
     },
     computed: {
          itemCount() {
               return this.cart.length;
          }
     },
     methods: {
          getProductImage,
          priceDecimal,
          async minusItem(itemName){
               const itemIndex = this.cart.findIndex(cartItem => cartItem.name === itemName)

               if (itemIndex !== -1 && this.loginStatus) {
                    const data = {
                         userId: this.user,
                         itemId: this.cart[itemIndex].id,
                         recaptchaToken: await executeRecaptcha('deduct_item')
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

                              this.updateTotalPrice(this.cart)

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
                         recaptchaToken: await executeRecaptcha('add_item')
                    }

                    try {
                         const res = await CallApi.addItemToCart(data)

                         if (res.ret == 0) {
                              if (res.data?.[0]?.msg) {
                                   this.triggerSnapbar(`${itemName} ${res.data[0].msg}`)
                                   return 
                              }

                              this.cart = res.data

                              this.updateTotalPrice(this.cart)
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
                         recaptchaToken: await executeRecaptcha('remove_item')
                    }

                    this.cart.splice(itemIndex, 1)
                   
                    try {
                         const res = await CallApi.removeItemFromCart(data)
                         
                         if (res.ret == 0 && res.data?.length > 0) {
                              this.cart = res.data
                              
                              this.totalAmt = 0
                              res.data.forEach(item => {
                                   this.totalAmt += Number(item.price) * item.qty
                              })
                              sessionStorage.setItem('cart', JSON.stringify(this.cart))
                         }
                    } catch (err) {
                         this.cart = []
                    }
               }
          },
          // getProductImage(productName) {
          //      return new URL(`https://storage.googleapis.com/veryhardware/${productName}.jpeg`).href
          // },
          async addItemToCart(item) {
               const data = {
                    userId: Number(this.user),
                    itemId: item.id,
                    recaptchaToken: await executeRecaptcha('add_item')
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
                         
                         this.updateTotalPrice(this.cart)
                         sessionStorage.setItem('cart', JSON.stringify(this.cart))
                    }
               } catch (err) {
                    this.cart = []
               }
          },
          async handleUserLoggedIn(user) {
               if (user) {
                    this.user = user
                    this.loginStatus = true
                    await this.checkLogin()
               } else {
                    await this.checkLogin()
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
                         this.updateTotalPrice(this.cart)
                         sessionStorage.setItem('cart', JSON.stringify(this.cart))
                    }
               } catch (err) {
                    this.cart = []
               } 
          },
          async checkOut(){
               const userInfor = sessionStorage.getItem('user')
               
               if (userInfor.phone) {
                    this.triggerSnapbar('Please update your profile with a phone number before proceeding to checkout.')
                    return
               } else if (userInfor.address) {
                    this.triggerSnapbar('Please update your profile with a address before proceeding to checkout.')
                    return
               } else if (userInfor.postCode) {
                    this.triggerSnapbar('Please update your profile with a postcode before proceeding to checkout.')
                    return
               } else if (userInfor.city) {
                    this.triggerSnapbar('Please update your profile with a city before proceeding to checkout.')
                    return
               } else if (userInfor.country) {
                    this.triggerSnapbar('Please update your profile with a country before proceeding to checkout.')
                    return
               }

               const data = {
                    userId: this.user,
                    recaptchaToken: await executeRecaptcha('checkout')
               }

               const res = await CallApi.checkoutPending(data)
               const itemFee = []

               if (res.data.status === true) {
                    this.checkoutDialog = true
                    this.checkoutList = res.data.items

                    for (const item of Object.values(res.data.fee[0])) {
                         if (item.type == "ItemShippingFee") {
                              itemFee.push({ itemId: item.itemId, fee: Number(item.shippingFee) })
                         } else if (item.type == 'StateShippingFee') {
                              this.stateFee = Number(item.shippingFee)
                         }
                    }
                    this.itemFee = itemFee

                    this.$nextTick(() => {
                         this.$refs.checkoutComponent.calculateShippingFee()
                    })
               } else { 
                    if (res.data?.nullFields){
                         const missingFields = res.data.nullFields
                              .map(field => field.toLowerCase()) 
                              .join(", ")
                         this.triggerSnapbar(`Please fill up these information, ${missingFields}`)
                    }

                    this.triggerSnapbar(`Some item are out of stock, please refresh the page and remove the item.`)
               }
          },
          updateTotalPrice(cart){
               this.totalAmt = 0
                         
               cart.forEach(item => {
                    this.totalAmt += Number(item.price) * item.qty
               })
          },
          triggerSnapbar(msg){
               this.snackbar = true
               this.snackBarMsg = msg
          },
          async clearCheckOut(){
               if(this.user) {
                    const data = {
                         userId: this.user,
                         recaptchaToken: await executeRecaptcha('delete_checkout')
                    }

                    await CallApi.deleteCheckout(data)
               }

               this.checkoutBtn = true
          }
     },
     async mounted() {
          EventBus.on('user-login-in', this.handleUserLoggedIn)
          EventBus.on('user-logout-out', this.handleUserLoggedOut)
          EventBus.on('add-to-cart', this.addItemToCart)
          
     },
     async beforeMount() {
          this.checkLogin()
          setTimeout( async () =>
               await this.clearCheckOut(),
               2000 
          )
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