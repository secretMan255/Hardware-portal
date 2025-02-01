<template>
     <v-dialog :model-value="modelValue" max-width="800" @update:model-value="updateDialog" persistent>
          <v-card prepend-icon="mdi-account" title="Edit Account">
               <v-card-text >
                    <v-row dense>
                         <v-col cols="12" md="12">
                              <v-text-field
                                   disabled
                                   variant="outlined"
                                   density="compact"
                                   v-model="editAccount.email"
                                   label="Email*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-text-field
                                   variant="outlined"
                                   density="compact"
                                   v-model="editAccount.name"
                                   label="Name*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="6">
                              <v-text-field
                                   variant="outlined"
                                   density="compact"
                                   :type="showPassword ? 'text' : 'password'"
                                   :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                   v-model="editAccount.password"
                                   label="Change Password*"
                                   hint="Password must contain number and alphabet"
                                   @click:append-inner="togglePasswordVisibility"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="6">
                              <v-text-field
                                   variant="outlined"
                                   density="compact"
                                   :type="showPassword ? 'text' : 'password'"
                                   :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                   v-model="confirmPassword"
                                   label="Confirm Password*"
                                   hint="Password must be same"
                                   @click:append-inner="togglePasswordVisibility"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-text-field
                                   variant="outlined"
                                   density="compact"
                                   v-model="editAccount.phone"
                                   label="Phone*"
                                   required
                              ></v-text-field>
                         </v-col>
                         <v-col cols="12" md="12">
                              <v-textarea
                                   row-height="1"
                                   rows="4"
                                   label="Address*"
                                   v-model="editAccount.address"
                                   name="input-7-1"
                                   variant="outlined"
                                   auto-grow
                              ></v-textarea>
                         </v-col>   
                         <v-col cols="12" md="12">
                              <v-text-field
                                   variant="outlined"
                                   density="compact"
                                   v-model="editAccount.postCode"
                                   label="Postcode*"
                                   required
                              ></v-text-field>
                         </v-col>       
                         <v-col cols="12" md="6">
                              <v-select
                                   variant="outlined"
                                   density="compact"
                                   v-model="editAccount.city"
                                   :items="cityItem"
                                   label="City*"
                              ></v-select>
                         </v-col>
                         <v-col cols="12" md="6">
                              <v-select
                                   variant="outlined"
                                   density="compact"
                                   v-model="editAccount.country"
                                   :items="countryItem"
                                   label="Country*"
                                   :disabled="countryDisable"
                              ></v-select>
                         </v-col>               
                    </v-row>
               </v-card-text>
               <v-divider></v-divider>
               <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="isEditAccountDisable" :loading="editLoading" @click="editUser">
                         EDIT
                    </v-btn>
                    <v-btn  :loading="editLoading" @click="closeDialog">
                         CLOSE
                    </v-btn>
               </v-card-actions>
          </v-card>
     </v-dialog>
</template>

<script>
import { emailValidate, validateName, validatePassword, validatePhone, validateAddress, validatePostcode } from '../../../utils/utils'
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
          countryItem: {
               type: Array,
               required: true
          },
          countryDisable: {
               type: Boolean,
               required: true
          },
          editAccountInfor: {
               type: Object,
               required: true
          }
     },
     data() {
          return {
               editAccount: {
                    id: this.editAccountInfor.id,
                    email: this.editAccountInfor.email || '',
                    name: this.editAccountInfor.name || '',
                    password: '',
                    phone: this.editAccountInfor.phone || '',
                    address: this.editAccountInfor.address || '',
                    postCode: this.editAccountInfor.postCode || '',
                    city: this.editAccountInfor.city || '',
                    country: this.editAccountInfor.country || 'Malaysia'
               },
               confirmPassword: '',
               editLoading: false,
               showPassword: false,
          }
     },
     methods: {
          togglePasswordVisibility() {
               this.showPassword = !this.showPassword;
          },
          async editUser() {
               try {
                    this.editLoading = true

                    const editAccountPayload = {
                         ... this.editAccount,
                         recaptchaToken: await executeRecaptcha('edit_infor')
                    }

                    const res = await CallApi.editAccount(editAccountPayload)
                    
                    if (res?.data) {
                         return
                    }

                    sessionStorage.setItem('user', JSON.stringify(this.editAccount))

                    this.$emit('update-snackbar', {
                         show: true,
                         message: 'Updated information'
                    })
                    this.closeDialog()
               } catch (err) {
                    this.$emit('update-snackbar', {
                         show: true,
                         message: 'Please check if the input is correct.'
                    })
               } finally {
                    this.editLoading = false
               }
          },
          updateDialog(newValue) {
               this.$emit("update:modelValue", newValue);
          },
          closeDialog() {
               this.editAccount.password = ''
               this.confirmPassword = ''
               this.$emit("update:modelValue", false)
          },
          passwordCheck() {
               if (this.editAccount.password) {
                    return validatePassword(this.editAccount.password) && this.editAccount.password === this.confirmPassword
               } else {
                    return true
               }
          },
          getUserFromSession() {
               const infor = JSON.parse(sessionStorage.getItem('user'))
          
               if (infor) {
                    this.editAccount.id = infor.id
                    this.editAccount.email = infor.email
                    this.editAccount.name = infor.name
                    this.editAccount.phone = infor.phone
                    this.editAccount.address = infor.address
                    this.editAccount.postCode = infor.postCode
                    this.editAccount.city = infor.city
               } else {
                    this.editAccount.id = '' 
                    this.editAccount.email = ''
                    this.editAccount.name = ''
                    this.editAccount.phone = ''
                    this.editAccount.address = ''
                    this.editAccount.postCode = ''
                    this.editAccount.city = ''
               }
          }
     },
     computed: {
          isEditAccountDisable() {
               return !(
                    this.editAccount.email &&
                    emailValidate(this.editAccount.email) &&
                    this.editAccount.name &&
                    validateName(this.editAccount.name) &&
                    this.passwordCheck() &&
                    this.editAccount.phone &&
                    validatePhone(this.editAccount.phone) &&
                    this.editAccount.address &&
                    validateAddress(this.editAccount.address) &&
                    this.editAccount.postCode &&
                    validatePostcode(String(this.editAccount.postCode)) &&
                    this.editAccount.city &&
                    this.editAccount.country
               )
          }
     },
     updated() {
          this.getUserFromSession()
     },
     mounted() {
          this.getUserFromSession()
     }
}
</script>