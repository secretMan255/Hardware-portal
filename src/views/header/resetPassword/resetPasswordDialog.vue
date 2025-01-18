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
                                   :disabled="resetPasswordParam.email === '' || disableEmail || disableOTP"
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
                                   type="password"
                                   hint="Password must contain number and alphabet"
                                   required
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
                    {{ resetError }}
               </v-card-text>

               <v-divider></v-divider>

               <v-card-actions>
                    <v-spacer></v-spacer>
                         <v-btn
                              :loading="loadingResetPassword"
                              :disabled="resetPasswordParam.password === '' || resetPasswordParam.opt === ''"
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
          resetError: {
               type: String,
               default: "",
          },
          disableEmail: {
               type: Boolean,
               default: false,
          },
     },
     data() {
          return {
               disableOTP: false
          }
     },
     methods: {
          sendOTP() {
               this.$emit("send-otp")
               this.disableOTP = true

               setTimeout(() => {
                    this.disableOTP = false
               }, 30000)
          },
          updatePassword() {
               this.$emit("update-password")
          },
          closeDialog() {
               this.$emit("update:modelValue", false)
          },
          updateDialog(newValue) {
               this.$emit("update:modelValue", newValue)
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
   