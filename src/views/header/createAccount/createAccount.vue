<template>
     <v-dialog :model-value="modelValue" max-width="730" @update:model-value="updateDialog" persistent>
          <v-card prepend-icon="mdi-account" title="Create Account">
               <v-card-text >
                    <v-row dense>
                         <v-col cols="12" md="12">
                              <v-text-field
                                   :disabled="disable"
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.email"
                                   label="Email*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-text-field
                                   :disabled="disable"
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.name"
                                   label="Name*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="6">
                              <v-text-field
                                   :disabled="disable"
                                   variant="outlined"
                                   density="compact"
                                   :type="showPassword ? 'text' : 'password'" 
                                   v-model="createAccount.password"
                                   label="Password*"
                                   required
                                   append-inner-icon="mdi-eye"
                                   hint="Password must contain number and alphabet"
                                   @click:append-inner="togglePasswordVisibility"
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="6">
                              <v-text-field
                                   :disabled="disable"
                                   variant="outlined"
                                   density="compact"
                                   :type="showPassword ? 'text' : 'password'" 
                                   v-model="confirmPass"
                                   label="Confirm Password*"
                                   required
                                   append-inner-icon="mdi-eye"
                                   @click:append-inner="togglePasswordVisibility"
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-text-field
                                   :disabled="disable"
                                   prefix="+60"
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.phone"
                                   label="Phone*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-textarea
                                   :disabled="disable"
                                   row-height="1"
                                   rows="4"
                                   label="Address*"
                                   v-model="createAccount.address"
                                   name="input-7-1"
                                   variant="outlined"
                                   auto-grow
                              ></v-textarea>
                         </v-col>
                         <v-col cols="12" md="6">
                              <v-text-field
                                   :disabled="disable"
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.postCode"
                                   label="Postcode*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="6">
                              <v-select
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.city"
                                   :items="cityItem"
                                   label="City*"
                                   :disabled="disable"
                              ></v-select>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-select
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.country"
                                   :items="countryItem"
                                   label="Country*"
                                   :disabled="countryDisable"
                              ></v-select>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-btn :loading="otpLoading" :disabled="isRequestOtpDisabled || disableResuestOTP || disable" block class="mb-5" @click="requestOTP">Request OTP</v-btn>
                         </v-col>
                         <v-col cols="12" md="12">
                              <p class="d-flex justify-center mb-2 text-bold">Enter OTP</p>
                              <v-otp-input
                                   class="mt-0 pt-0"
                                   v-model="createAccount.otp"
                                   variant="outlined"
                              ></v-otp-input>
                         </v-col>
                    </v-row>
               </v-card-text>
               <v-divider></v-divider>
               <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="isCreateAccountDisabled" :loading="registerLoading" @click="createUser">
                         REGISTER
                    </v-btn>
                    <v-btn @click="closeDialog">
                         CLOSE
                    </v-btn>
               </v-card-actions>
          </v-card>  
     </v-dialog>
</template>

<script>
import { CallApi } from '../../../CallApi/callApi'
import { executeRecaptcha } from '../../../utils/utils'

export default {
     props: {
          modelValue: {
               type: Boolean,
               required: true          
          },
          cityItem: {
               type: Array,
               required: true,
          },
     },
     data() {
          return {
               disable: false,
               showPassword: false,
               createAccount: {
                    email: '',
                    name: '',
                    password: '',
                    phone: null,
                    address: '',
                    postCode: '',
                    city: '',
                    country: 'Malaysia',
                    otp: ''
               },
               confirmPass: '',
               countryItem: ['Malaysia'],
               disableCreate: true,
               countryDisable: true,
               disableResuestOTP: false,
               otpLoading: false,
               registerLoading: false
          }
     },
     methods: {
          togglePasswordVisibility() {
               this.showPassword = !this.showPassword;
          },
          closeDialog() {
               this.clearParams()
               this.$emit("update:modelValue", false)
          },
          updateDialog(newValue) {
               this.$emit("update:modelValue", newValue)
          },
          emailValidate(email) {
               return (email.length <= 45 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.com)$/.test(email))
          },
          validatePassword(pass) {
               return (
                    pass.length >= 8 &&
                    pass.length <= 16 &&
                    /[A-Z]/.test(pass) &&
                    /[a-z]/.test(pass) &&
                    /\d/.test(pass) &&
                    /[!_@#$%^&*(),.?":{}|<>]/.test(pass) &&
                    pass === this.confirmPass
               )
          },
          validatePhone(phone) {
               return /^\d{8,15}$/.test(phone)
          },
          validateAddress(address) {
               return (
                    address.length >= 1 &&
                    address.length <= 255
               )
          },
          validatePostcode(postcode) {
               return (
                    postcode.length === 5
               )
          },
          validateName(name) {
               return (
                    name.length >= 1 &&
                    name.length <= 45
               )
          },
          validateOtp(otp) {
               return (
                    otp.length === 6
               )
          },
          async requestOTP() {
               try {
                    const sendOtpPayload = {
                         email: this.createAccount.email,
                         recaptchaToken: await executeRecaptcha('email_login')
                    }
                    
                    this.otpLoading = true
                    const res = await CallApi.sendCreateAccountOTP(sendOtpPayload)

                    if (res.data) {
                         this.$emit('update-snackbar', {
                              show: true,
                              message: res.data[0].errorMsg
                         })
                         return 
                    }
                    
                    this.$emit('update-snackbar', {
                         show: true,
                         message: 'OTP sent successfully.'
                    });
                    this.disable = true
                    this.disableResuestOTP = true

                    setTimeout(() => {
                         this.disableResuestOTP = false
                    }, 300000)
               } catch (err) {
                    this.$emit('update-snackbar', {
                         show: true,
                         message: 'Please request OTP again after 5 min.'
                    })
                    this.disable = false
               } finally {
                    this.otpLoading = false
               }
          },
          async createUser() {
               try {
                    this.registerLoading = true
                    this.createAccount.recaptchaToken = await executeRecaptcha('email_login')
                    const res = await CallApi.createAccount(this.createAccount)

                    if (res?.data) {
                         this.$emit('update-snackbar', {
                              show: true,
                              message: `Register failed. ${res?.data[0].errorMsg}`
                         })     
                         return
                    }

                    this.closeDialog()

                    this.$emit('update-snackbar', {
                         show: true,
                         message: `Registered successfully.`
                    })

               } catch (err) {
                    this.$emit('update-snackbar', {
                         show: true,
                         message: `Register failed.`
                    })
                    this.disable = false
               } finally {
                    this.registerLoading = false
               }
          },
          clearParams() {
               this.createAccount.email = ''
               this.createAccount.password = ''
               this.createAccount.name = ''
               this.createAccount.phone = ''
               this.createAccount.address = ''
               this.createAccount.postCode = ''
               this.createAccount.city = ''
               // this.createAccount.country = ''
               this.createAccount.otp = ''
               this.disable = false
          }
     },
     computed: {
          isRequestOtpDisabled() {
               return !(
                    this.createAccount.email &&
                    this.emailValidate(this.createAccount.email) &&
                    this.createAccount.name &&
                    this.validateName(this.createAccount.name) &&
                    this.createAccount.password &&
                    this.validatePassword(this.createAccount.password) 
                    // &&
                    // this.createAccount.phone &&
                    // this.validatePhone(this.createAccount.phone) &&
                    // this.createAccount.address &&
                    // this.validateAddress(this.createAccount.address) && 
                    // this.createAccount.postCode &&
                    // this.validateAddress(this.createAccount.postCode) && 
                    // this.createAccount.city &&
                    // this.createAccount.country
               )
          },
          isCreateAccountDisabled() {
               return !(
                    this.createAccount.email &&
                    this.emailValidate(this.createAccount.email) &&
                    this.createAccount.name &&
                    this.validateName(this.createAccount.name) &&
                    this.createAccount.password &&
                    this.validatePassword(this.createAccount.password) &&
                    this.createAccount.phone &&
                    this.validatePhone(this.createAccount.phone) &&
                    this.createAccount.address &&
                    this.validateAddress(this.createAccount.address) && 
                    this.createAccount.postCode &&
                    this.validateAddress(this.createAccount.postCode) && 
                    this.createAccount.city &&
                    this.createAccount.country &&
                    this.createAccount.otp &&
                    this.validateOtp(this.createAccount.otp) &&
                    this.createAccount.country
               )
          }
     }
}
</script>

<style>
.text-bold {
     font-weight: bold;
}
</style>