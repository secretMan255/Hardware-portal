<template>
     <v-dialog :model-value="modelValue" max-width="550" @update:model-value="updateDialog" persistent>
          <v-card prepend-icon="mdi-account" title="Create Account">
               <v-card-text>
                    <v-row dense>
                         <v-col cols="12" md="12">
                              <v-text-field
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.email"
                                   label="Email*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-text-field
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.name"
                                   label="Name*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-text-field
                                   variant="outlined"
                                   density="compact"
                                   :type="showPassword ? 'text' : 'password'" 
                                   v-model="createAccount.password"
                                   label="Password*"
                                   required
                                   append-inner-icon="mdi-eye"
                                   @click:append-inner="togglePasswordVisibility"
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-text-field
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
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.postCode"
                                   label="Postcode*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="6">
                              <v-text-field
                                   variant="outlined"
                                   density="compact"
                                   v-model="createAccount.city"
                                   label="City*"
                                   required
                              ></v-text-field>
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
                              <v-btn :disabled="isRequestOtpDisabled" block class="mb-5">Request OTP</v-btn>
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
                    <v-btn :disabled="disableCreate" @click="createUser">
                         CREATE
                    </v-btn>
                    <v-btn @click="closeDialog">
                         CANCEL
                    </v-btn>
               </v-card-actions>
          </v-card>  
     </v-dialog>
</template>

<script>
export default {
     props: {
          modelValue: {
               type: Boolean,
               required: true          
          }
     },
     data() {
          return {
               showPassword: false,
               createAccount: {
                    email: '',
                    name: '',
                    password: '',
                    phone: '',
                    address: '',
                    postCode: '',
                    city: '',
                    country: 'Malaysia',
                    otp: ''
               },
               countryItem: ['Malaysia'],
               disableCreate: true,
               countryDisable: true
          }
     },
     methods: {
          togglePasswordVisibility() {
               this.showPassword = !this.showPassword;
          },
          closeDialog() {
               this.$emit("update:modelValue", false)
          },
          updateDialog(newValue) {
               this.$emit("update:modelValue", newValue)
          },
          emailValidate(email) {
               return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
          },
          validatePassword(pass) {
               return (
                    pass.length >= 8 &&
                    pass.length <= 16 &&
                    /[A-Z]/.test(pass) &&
                    /[a-z]/.test(pass) &&
                    /\d/.test(pass) &&
                    /[!@#$%^&*(),.?":{}|<>]/.test(pass)
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
          async createUser() {

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
                    this.validatePassword(this.createAccount.password) &&
                    this.createAccount.phone &&
                    this.validatePhone(this.createAccount.phone) &&
                    this.createAccount.address &&
                    this.validateAddress(this.createAccount.address) && 
                    this.createAccount.postCode &&
                    this.validateAddress(this.createAccount.postCode) && 
                    this.createAccount.city
                    // this.createAccount.country
               )
          },
     },
     mounted() {
          this.createAccount.email = ''
          this.createAccount.password = ''
          this.createAccount.phone = ''
          this.createAccount.address = ''
          this.createAccount.postCode = ''
          this.createAccount.city = ''
          // this.createAccount.country = ''
          this.createAccount.otp = ''
     }
}
</script>

<style>
.text-bold {
     font-weight: bold;
}
</style>