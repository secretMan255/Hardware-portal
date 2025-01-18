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
                    <v-avatar icon="mdi-account"></v-avatar>
               </v-btn>
          </template>
          <v-card>
               <v-card-text>
                    <div v-if="user.name" class="mx-auto text-center">
                         <h3>{{ user.name }}</h3>
                         <p class="text-caption mt-1">
                              {{ user.email }}
                         </p>
                         <v-divider class="my-3"></v-divider>
                         <v-btn
                              variant="text"
                              rounded
                              @click=""
                         >
                              Edit Account
                         </v-btn>
                         <v-divider class="my-3"></v-divider>
                         <v-btn
                              variant="text"
                              rounded
                              @click="logout"
                         >
                              LOGOUT
                         </v-btn>
                    </div>
                    <div v-else class="mx-auto text-center">
                         <p class="text-caption mt-1 pb-3">
                              You are not logged in.
                         </p>
                         <v-btn
                              variant="text"
                              rounded
                              @click="emailLoginPage"
                         >
                              EMAIL LOGIN
                         </v-btn>
                         <v-btn
                              variant="text"
                              rounded
                              @click="googleLogin"
                         >
                              GOOGLE LOGIN
                         </v-btn>
                    </div>
               </v-card-text>
          </v-card>
     </v-menu>

     <v-dialog
          v-model="emailDialog"
          max-width="600"
          persistent
     >
          <v-card
               prepend-icon="mdi-account"
               title="User Profile"
          >
               <v-card-text>
                    <v-row dense>
                         <v-col
                              cols="12"
                              md="12"
                         >
                         <v-text-field
                              variant="outlined"
                              v-model="emailLoginParam.email"
                              label="Email*"
                              required
                         ></v-text-field>
                         </v-col>

                         <v-col
                              cols="12"
                              md="12"
                         >
                         <v-text-field
                              variant="outlined"
                              v-model="emailLoginParam.password"
                              label="Password*"
                              type="password"
                              required
                         ></v-text-field>
                         </v-col>
                    </v-row>

                    <p v-if="required" class="text-red text-caption pt-0">{{ this.loginError }}</p>
                    <small class="text-caption text-medium-emphasis">*indicates required field</small>
                    <div>
                         <a class="text-caption resetPassword" @click="createAccount">Create Account</a>
                    </div>
                    <div>
                         <a class="text-caption resetPassword" @click="resetPassword">Reset password</a>
                    </div>
               </v-card-text>

               <v-divider></v-divider>

               <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                         :loading="loadingEmailLogin"
                         :disabled="emailLoginParam.email === '' || emailLoginParam.password === ''"
                         text="LOGIN"
                         variant="plain"
                         @click="emailLogin"
                    ></v-btn>

                    <v-btn
                         :loading="loadingEmailLogin"
                         text="CLOSE"
                         variant="plain"
                         @click="emailDialog = false"
                    ></v-btn>
               </v-card-actions>
          </v-card>
     </v-dialog>

     <ResetPasswordDialog
          v-model="resetPasswordDialog"
          :reset-password-param="resetPasswordParam"
          :loading-send-otp="loadingSendOTP"
          :loading-reset-password="loadingResetPassword"
          :disable-email="disableEmail"
          :reset-error="resetError"
          @send-otp="sendOTP"
          @update-password="updatePassword"
     ></ResetPasswordDialog>

     <CreateAccount v-model="createAccountDialog" />

     <v-snackbar
          v-model="snackbar"
          vertical
     >
          <div class="text-subtitle-1 pb-2">LOGIN</div>

          <p>{{ snackbarMsg }}</p>

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
import { executeRecaptcha, loadGoogleApi } from '../../utils/utils';
import ResetPasswordDialog from './resetPassword/resetPasswordDialog.vue';
import CreateAccount from './createAccount/createAccount.vue';

export default {
     components: {
          ResetPasswordDialog,
          CreateAccount
     },
     data() {
          return {
               emailDialog: false,
               snackbar: false,
               snackbarMsg: '',
               required: false,
               resetPasswordDialog: false,
               createAccountDialog: false,
               disableEmail: false,
               loadingSendOTP: false,
               loadingResetPassword: false,
               loadingEmailLogin: false,
               loginError: '*Please enter the required field',
               resetError: '',
               user: {
                    name: '',
                    email: '',
               },
               emailLoginParam: {
                    email: '',
                    password: ''
               },
               resetPasswordParam: {
                    email: '',
                    otp: '',
                    password: ''
               }
          }
     },
     mounted() {
          sessionStorage.removeItem('user')
          const userData = sessionStorage.getItem('user')
          if (userData) {
               this.user = JSON.parse(userData)
          }
     },
     methods: {
          async googleLogin() {
               await loadGoogleApi()
               .then(() => {
                    this.initializeGoogleLogin()
               })
               .catch((error) => {
                    this.snackbar = true
                    this.snackbarMsg = `Error loading Google API: ${error}`
               })
          },
          initializeGoogleLogin() {
               google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: this.handleCredentialResponse
               })

               google.accounts.id.prompt()
          },
          async handleCredentialResponse(response) {
               try{
                    const userData = this.parseJwt(response.credential)
                    
                    const userCredential = {
                         sub: userData.sub,
                         name: userData.name,
                         email: userData.email,
                         recaptchaToken: await executeRecaptcha('email_login')
                    }

                    const res = await CallApi.userLogin(userCredential)
                    
                    if (res.ret == -1 || res.data.error) {
                         this.logout()
                         this.triggerSnackBar(`Failed to login. ${res.data.error}`)
                         return 
                    }

                    this.triggerSnackBar('Login Successfully')
                    this.logout()
                    sessionStorage.setItem('user', JSON.stringify(this.user))
                    this.user = {
                         name: userData.name,
                         email: userData.email,
                    }
               } catch (err) {
                    this.logout()
                    this.triggerSnackBar(`Failed to login. ${err}`)
               }
          },
          parseJwt(token) {
               const base64Url = token.split(".")[1]
               const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
               return JSON.parse(atob(base64))
          },
          emailLoginPage() {
               this.emailDialog = true
          },
          
          async emailLogin() {
               try {
                    if (this.emailLoginParam.email == '' || this.emailLoginParam.password == '') {
                         this.loginError = '*Please enter the required field'
                         this.required = true
                         return
                    }

                    this.loadingEmailLogin = true

                    const loginPayload = {
                         ... this.emailLoginParam,
                         recaptchaToken: await executeRecaptcha('email_login')
                    }
                    
                    const res = await CallApi.userLogin(loginPayload)
                    console.log('res: ' , res)
                    if (res.ret == -1 || res.data.error) {
                         this.loginError = res.data.error
                         this.triggerSnackBar(res.data.error)
                         return
                    }

                    this.logout()
                    sessionStorage.setItem('user', JSON.stringify(res.data))
                    this.user = {
                         name: res.data.name,
                         email: res.data.email,
                    }
                    console.log('user: ', this.user)
                    this.emailDialog = false
                    this.emailLoginParam.email = ''
                    this.emailLoginParam.password = ''
                    this.triggerSnackBar('Signin successfilly')
               } catch (err) {
                    this.logout()
                    console.log('err: ' , err)
                    this.triggerSnackBar('Invalid email or password')
               } finally {
                    this.loadingEmailLogin = false
               }
          },
          resetPassword() {
               this.resetPasswordDialog = true    
          },
          createAccount() {
               this.createAccountDialog = true
          },
          async sendOTP() {
               try {
                    if (!this.emailValidate(this.resetPasswordParam.email)) {
                         this.resetError = 'Invalid email.'
                         return 
                    }
                    
                    this.loadingSendOTP = true

                    const sendOtpPayload = {
                         email: this.resetPasswordParam.email,
                         recaptchaToken: await executeRecaptcha('email_login')
                    }

                    const sendOTP = await CallApi.sendOTP(sendOtpPayload)

                    if (sendOTP?.data) {
                         this.triggerSnackBar(sendOTP.data[0]?.ErrorMsg)
                         this.loadingSendOTP = true
                         return
                    }

                    this.disableEmail = true
               } catch (error) {
                    this.triggerSnackBar('Failed to send OTP')
               } finally {
                    this.loadingSendOTP = false
               }
          },
          async updatePassword() {
               try {
                    if (!this.emailValidate(this.resetPasswordParam.email)) {
                         this.disableEmail = false     
                         this.triggerSnackBar('Invalid Email.')
                         return
                    }
                    
                    if (this.resetPasswordParam.password.length <= 7 || this.resetPasswordParam.password > 16) {
                         this.disableEmail = false
                         this.triggerSnackBar('Invalid Password.')
                         return
                    }
                    console.log('otp: ' , this.resetPasswordParam.otp)
                    if (this.resetPasswordParam.otp.length <= 0) {
                         this.disableEmail = false
                         this.triggerSnackBar('Invalid OTP.')
                         return
                    }

                    this.loadingResetPassword = true

                    const updatePassPayload = {
                         email: this.resetPasswordParam.email,
                         password: this.resetPasswordParam.password,
                         otp: Number(this.resetPasswordParam.otp),
                         recaptchaToken: await executeRecaptcha('email_login')
                    }

                    const updatePassword = await CallApi.updatePassword(updatePassPayload)
                    
                    if (updatePassword?.data) {
                         this.triggerSnackBar(updatePassword.data[0]?.ErrorMsg)
                         this.loadingResetPassword = false
                         return
                    }

                    this.eraseResetPassword()

                    this.disableEmail = false
                    this.resetPasswordDialog = false
               } catch (err) {
                    console.log('err: ' , err)
                    this.triggerSnackBar('Invalid OTP.')
               } finally {
                    this.loadingResetPassword = false
                    this.triggerSnackBar('Reset password successfully.')
               }
          },
          logout() {
               this.user = {
                    name: '',
                    email: ''
               }

               this.emailLoginParam.email = ''
               this.emailLoginParam.password = ''

               try{ google.accounts.id.disableAutoSelect() }
               catch (err) {

               }
               this.triggerSnackBar('Logged out sucessfully')

               sessionStorage.removeItem('user')
          },
          eraseResetPassword() {
               this.resetPasswordParam.email = ''
               this.resetPasswordParam.otp = ''
               this.resetPasswordParam.password = ''
          },
          emailValidate(email) {
               return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
          },
          triggerSnackBar(msg){
               this.snackbar = true
               this.snackbarMsg = msg
          }
     }
}
</script>

<style scoped>
.resetPassword {
     cursor: pointer;
     text-decoration: underline;
}
</style>