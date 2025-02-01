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
                              @click="editAccount"
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
                              :type="showPassword ? 'text' : 'password'"
                              v-model="emailLoginParam.password"
                              label="Password*"
                              type="password"
                              required
                              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                              @click:append-inner="togglePassword"
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
                         :disabled="isEmailValid || emailLoginParam.password === ''"
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
          @send-otp="sendOTP"
          @update-password="updatePassword"
     ></ResetPasswordDialog>

     <CreateAccount 
          v-model="createAccountDialog"
          :cityItem="cityItem"
          :countryDisable="countryDisable"
          :countryItem="countryItem"
          @update-snackbar="updateSnackbar"
     />

     <EditAccount
          v-model="editAccountDialog"
          :cityItem="cityItem"
          :countryDisable="countryDisable"
          :countryItem="countryItem"
          :editAccountInfor="editAccountInfor"
          @update-snackbar="updateSnackbar"
     ></EditAccount>

     <v-snackbar
          v-model="snackbar"
          vertical
     >
          <div class="text-subtitle-1 pb-2">Profile</div>

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
import { executeRecaptcha, loadGoogleApi, emailValidate, EventBus } from '../../utils/utils';
import ResetPasswordDialog from './resetPassword/resetPasswordDialog.vue';
import CreateAccount from './createAccount/createAccount.vue';
import EditAccount from './editAccount/editAccount.vue';

export default {
     components: {
          ResetPasswordDialog,
          CreateAccount,
          EditAccount
     },
     data() {
          return {
               showPassword: false,
               snackbar: false,
               snackbarMsg: '',
               required: false,
               emailDialog: false,
               resetPasswordDialog: false,
               createAccountDialog: false,
               editAccountDialog: false,
               disableEmail: false,
               loadingSendOTP: false,
               loadingResetPassword: false,
               loadingEmailLogin: false,
               loginError: '*Please enter the required field',
               countryDisable: true,
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
               },
               editAccountInfor: {},
               cityItem: [],
               countryItem: ['Malaysia']
          }
     },
     computed: {
          isEmailValid() {
               return !emailValidate(this.emailLoginParam.email)
          },
     },
     methods: {
          togglePassword() {
               this.showPassword = !this.showPassword
          },
          async getCityItem(){
               const res = await CallApi.getCityItem(1)
               
               if (res.data.length <= 0) {
                    this.cityItem = [
                         'Alor Setar',
                         'Ampang Jaya',
                         'Batu Pahat',
                         'Bintulu',
                         'George Town',
                         'Ipoh',
                         'Iskandar Puteri',
                         'Johor Bahru',
                         'Kajang',
                         'Klang',
                         'Kuala Lumpur',
                         'Kuala Terengganu',
                         'Kuching',
                         'Miri',
                         'Petaling Jaya',
                         'Seberang Perai',
                         'Seremban',
                         'Shah Alam',
                         'Subang Jaya',
                         'Sungai Petani',
                         'Taiping',
                         'Tawau',
                         'Ulu Tiram',
                         'Victoria (Labuan)'
                    ]
               }

               for (let city of res.data) {
                    this.cityItem.push(city.name)
               }
          },
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
                         recaptchaToken: await executeRecaptcha('google_login')
                    }

                    const res = await CallApi.userLogin(userCredential)
                    if (res.ret == -1 || res.data.error) {
                         this.logout()
                         this.triggerSnackBar(`Failed to login. ${res.data.error}`)
                         return 
                    }

                    this.triggerSnackBar('Login Successfully')
                    sessionStorage.setItem('user', JSON.stringify(res.data))
                    
                    this.editAccountInfor = { ...res.data }
                    
                    this.user = {
                         name: userData.name,
                         email: userData.email,
                    }
               } catch (err) {
                    this.logout()
                    this.triggerSnackBar(`Failed to login. Please try latter.`)
               }
          },
          parseJwt(token) {
               const base64Url = token.split(".")[1]
               const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
               return JSON.parse(atob(base64))
          },
          emailLoginPage() {
               this.emailLoginParam.email = ''
               this.emailLoginParam.password = ''
               this.emailDialog = true
          },
          async emailLogin() {
               try {
                    this.loadingEmailLogin = true

                    const loginPayload = {
                         ... this.emailLoginParam,
                         recaptchaToken: await executeRecaptcha('email_login')
                    }
                    
                    const res = await CallApi.userLogin(loginPayload)
                   
                    if (res.ret == -1 || res.data.error) {
                         this.loginError = res.data.error
                         this.triggerSnackBar(res.data.error)
                         return
                    }

                    this.logout()
                    
                    sessionStorage.setItem('user', JSON.stringify(res.data))
                    EventBus.emit('user-login-in', res.data.id)
                    this.editAccountInfor = { ...res.data }

                    this.user = {
                         name: res.data.name,
                         email: res.data.email,
                    }
                    this.emailDialog = false
                    this.emailLoginParam.email = ''
                    this.emailLoginParam.password = ''
                    this.triggerSnackBar('Signin successfully')
               } catch (err) {
                    this.logout()
                    this.triggerSnackBar('Invalid email or password')
               } finally {
                    this.loadingEmailLogin = false
               }
          },
          resetPassword() {
               this.resetPasswordParam.email = ''
               this.resetPasswordParam.otp = ''
               this.resetPasswordParam.password = ''
               this.resetPasswordDialog = true    
          },
          createAccount() {
               this.createAccountDialog = true
          },
          editAccount() {
               this.editAccountDialog = true
          },
          async sendOTP() {
               try {
                    if (!this.isEmailValid) {
                         return 
                    }
                    
                    this.loadingSendOTP = true

                    const sendOtpPayload = {
                         email: this.resetPasswordParam.email,
                         recaptchaToken: await executeRecaptcha('send_otp')
                    }

                    const sendOTP = await CallApi.sendResetPasswordOTP(sendOtpPayload)

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
                    if (!this.isEmailValid) {    
                         this.triggerSnackBar('Invalid Email.')
                         return
                    }
                    
                    if (this.resetPasswordParam.password.length < 8 || this.resetPasswordParam.password > 16) {
                         this.disableEmail = false
                         this.triggerSnackBar('Invalid Password. Please try after 5 min')
                         return
                    }
                    
                    if (this.resetPasswordParam.otp.length <= 0) {
                         this.disableEmail = false
                         this.triggerSnackBar('Invalid OTP. Please try after 5 min')
                         return
                    }

                    this.loadingResetPassword = true

                    const updatePassPayload = {
                         email: this.resetPasswordParam.email,
                         password: this.resetPasswordParam.password,
                         otp: this.resetPasswordParam.otp,
                         recaptchaToken: await executeRecaptcha('update_password')
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

                    this.triggerSnackBar('Reset password successfully.')
                    this.resetPasswordDialog = false
               } catch (err) {
                    this.triggerSnackBar('Invalid OTP. Please try after 5 min')
               } finally {
                    this.loadingResetPassword = false
               }
          },
          logout() {
               EventBus.emit('user-logout-out', '')
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
          triggerSnackBar(msg){
               this.snackbar = true
               this.snackbarMsg = msg
          },
          updateSnackbar({ show, message }) {
               this.snackbar = show 
               this.snackbarMsg = message
          },
     },
     mounted() {
          this.getCityItem()

          const userData = sessionStorage.getItem('user')
          if (userData) {
               this.user = JSON.parse(userData)
          } else {
               this.user = {}
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