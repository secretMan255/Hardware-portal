<template>
     <v-card border class="d-flex flex-column justify-space-evenly pa-3" >
          <v-row class="mb-2 mt-1">
               <v-col class="right-border" cols="12" md="6">
                    <p class="subTitle">NEWSLETTER</p>
                    <p class="hrefText" @click="subscribe()">Subscribe to our newsletter</p>
               </v-col>
               <v-col cols="12" md="6">
                    <p class="subTitle">CONTACT US</p>
                    <ul class="pt-1 pt-1 contact-list ">
                         <li class="mb-2">
                              <p class="subTitle">Our client advisors are available Mon-Sat 10am-6pm</p>
                         </li>
                         <li>
                              <p class="subTitle">Call Us: </p> 
                         </li>
                         <li class="mb-2">
                              <p class="subTitle">+60 17 2223 195</p>
                         </li>
                         <li>
                              <p class="subTitle">WhatsApp: </p>
                         </li>
                         <li class="mb-2">
                              <a class="hrefText" href="https://wa.me/60172223915">+60 17 2223 195</a>
                         </li>
                         <li>
                              <p class="subTitle">Email Us: </p>
                         </li>
                         <li  class="mb-2">
                              <p class="subTitle">company@gmail.com</p>
                         </li>
                    </ul>
               </v-col>
          </v-row>
          <div class="top-border">
               <p class="text-center">© {{ new Date().getFullYear() }} Company Name</p>
          </div>
     </v-card>

     <v-dialog 
               v-model="subscribeDialog"
               max-width="800"
          >
               <v-card title="Subscribe Newsletter" class="pa-5">
                    <v-card-text>
                         <p>Our Customer Service will answer your enquiry as quickly as possible excluding weekend.</p>
                         <v-text-field
                              v-model="email"
                              color="primary"
                              label="Email"
                              variant="underlined"
                              clearable
                         >
                              <template #label>
                                   <span class="text-red"><strong>* </strong></span>Email
                              </template>
                         </v-text-field>

                         <p v-if="emailError" class="text-red"> {{ emailHint }}</p>

                         <v-row class="mt-1">
                              <v-col cols="12" sm="6">
                                   <v-btn block :loading="loading" @click="submitSubscripton()">SUBSCRIBE</v-btn>
                              </v-col>
                              <v-col cols="12" sm="6">
                                   <v-btn block @click="cancelSubscription()">CANCEL</v-btn>
                              </v-col>
                         </v-row>
                    </v-card-text>
               </v-card>
     </v-dialog>
</template>

<script>
import { CallApi } from '@/CallApi/callApi'

export default {
     data() {
          return {
               subscribeDialog: false,
               email: '',
               emailHint: 'xxxxxx@gmail.com',
               emailError: false,
               loading: false,
          }
     },
     methods: {
          subscribe(){
               this.subscribeDialog = true
          },
          cancelSubscription() {
               this.subscribeDialog = false;
               this.email = '';
          },
          async submitSubscripton() {
               try {
                    if (!this.validateEmail()) {
                         return
                    }

                    this.loading = true
                    this.emailError = false
                    const res = await CallApi.subscribe(this.email)
                    if (res.ret != 0) {
                         return
                    }

                    this.cancelSubscription()
               } catch (err) {
                    console.log('failed: ', err)
                    this.cancelSubscription()
               } finally {
                    this.loading = false
               }
          },
          validateEmail() {
               const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
               if (!this.email) {
                    this.emailHint = 'Email is required.'
                    this.emailError = true
                    return false
               }

               if (!emailRegex.test(this.email)) {
                    this.emailHint = 'Invalid email address'
                    this.emailError = true
                    return false
               }

               this.emailHint = 'example@gmail.con'
               this.emailError = false
               return true
          }
     }
}
</script>

<style>
.top-border {
     border-top: 1px solid black;
}

.right-border {
     border-right: 1px solid black;
}

.contact-list{
     list-style: none;
}

.title {
     font-weight: bold
}

.subTitle {
     font-size: 12px;
     font-weight: bold;
     margin: 0;
     text-decoration: none;
     color: inherit;
}

.hrefText {
     font-size: 12px;
     font-weight: bold;
     margin: 0;
     text-decoration: none;
     color: inherit;
     cursor: pointer;
}

.hrefText:hover {
     color: #525252;
     text-decoration: underline;
}
</style>