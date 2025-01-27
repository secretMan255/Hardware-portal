<template>
     <v-dialog :model-value="modelValue" max-width="550" @update:model-value="updateDialog" persistent>
          <v-card prepend-icon="mdi-account" title="Reset Password">
               <v-card-text>
                    <v-row dense>
                         <v-col cols="12" md="10">
                              <v-text-field
                                   v-model="resetPasswordParam.email"
                                   label="Email*"
                                   required
                                   :disabled="disableEmail"
                                   variant="outlined"
                              ></v-text-field>
                         </v-col>

                         <v-col cols="12" md="2" class="d-flex justify-center">
                              <v-btn
                                   :loading="loadingSendOTP"
                                   :disabled="resetPasswordParam.email === '' || disableEmail || disableOTP || isEmailValid"
                                   variant="plain"
                                   size="x-large"
                                   class="otpText"
                                   @click="sendOTP"
                              >
                                   SEND OTP
                              </v-btn>
                         </v-col>

                         <v-col cols="12" md="12">
                              <v-text-field
                                   variant="outlined"
                                   v-model="resetPasswordParam.password"
                                   label="Password*"
                                   :type="showPassword ? 'text' : 'password'"
                                   hint="Password must contain numbers and letters"
                                   required
                                   :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                   @click:append-inner="togglePassword"
                                   class="mb-3"
                              ></v-text-field>
                              <v-text-field
                                   variant="outlined"
                                   v-model="confirmPassword"
                                   label="Confirm Password*"
                                   :type="showPassword ? 'text' : 'password'"
                                   hint="Password must be same"
                                   required
                                   :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                   @click:append-inner="togglePassword"
                              ></v-text-field>
                         </v-col>

                         <v-col cols="12" md="12">
                              <p class="d-flex justify-center mb-2 text-bold">Enter OTP</p>
                              <v-otp-input
                                   class="mt-0 pt-0"
                                   v-model="resetPasswordParam.otp"
                                   variant="outlined"
                              ></v-otp-input>
                         </v-col>
                    </v-row>
               </v-card-text>

               <v-divider></v-divider>

               <v-card-actions>
                    <v-spacer></v-spacer>
                         <v-btn
                              :loading="loadingResetPassword"
                              :disabled="isEmailValid || isPasswordMatch || isOtpValid"
                              text="RESET PASSWORD"
                              variant="plain"
                              @click="updatePassword"
                         ></v-btn>

                         <v-btn
                              :loading="loadingResetPassword"
                              text="CLOSE"
                              variant="plain"
                              @click="closeDialog"
                         ></v-btn>
               </v-card-actions>
          </v-card>
     </v-dialog>
</template>
   
<script>
import { emailValidate, validatePassword, validateOtp } from '../../../utils/utils';
   export default {
     props: {
          modelValue: {
               type: Boolean,
               required: true,
          },
          resetPasswordParam: {
               type: Object,
               required: true,
          },
          loadingSendOTP: {
               type: Boolean,
               default: false,
          },
          loadingResetPassword: {
               type: Boolean,
               default: false,
          },
          disableEmail: {
               type: Boolean,
               default: false,
          },
     },
     data() {
          return {
               disableOTP: false,
               showPassword: false,
               confirmPassword: ''
          }
     },
     computed: {
          isPasswordMatch() {
               return !(this.resetPasswordParam.password === this.confirmPassword && validatePassword(this.resetPasswordParam.password))
          },
          isEmailValid() {
               return !emailValidate(this.resetPasswordParam.email)
          },
          isOtpValid() {
               return !validateOtp(this.resetPasswordParam.otp)
          }
     },
     methods: {
          sendOTP() {
               this.$emit("send-otp")
               this.disableOTP = true

               setTimeout(() => {
                    this.disableOTP = false
               }, 300000)
          },
          updatePassword() {
               this.$emit("update-password")
          },
          closeDialog() {
               this.confirmPassword = ''
               this.$emit("update:modelValue", false)
          },
          updateDialog(newValue) {
               this.$emit("update:modelValue", newValue)
          },
          togglePassword() {
               this.showPassword = !this.showPassword
          },
     },
}
</script>
   
<style scoped>
.otpText {
font-size: 15px;
margin-left: 20px;
}

.resetPassword {
cursor: pointer;
text-decoration: underline;
}

.text-bold {
     font-weight: bold;
}
</style>
   