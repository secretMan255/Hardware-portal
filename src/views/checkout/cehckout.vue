<template>
     <v-dialog :model-value="modelValue" @update:modelValue="closeDialog" width="800" persistent>
          <v-card>
               <v-card-title class="dialog-title">Checkout</v-card-title>
               <v-card-text>
                    <div class="mx-auto text-center">
                         <v-table density="compact" fixed-header >
                              <thead>
                                   <tr>
                                        <th class="text-center">Item</th>
                                        <th class="text-left">
                                             Name
                                        </th>
                                        <th class="text-center">
                                             Quantity
                                        </th>
                                        <th class="text-center">
                                             Price (RM)
                                        </th>
                                        <th class="text-center">
                                             Amount (RM)
                                        </th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr
                                        v-for="item in checkoutList"
                                        :key="item.name"
                                   >
                                        <td height="150" width="150">
                                             <v-img :aspect-ratio="1" max-height="150" max-width="150" :src="getProductImage(item.name)"></v-img>
                                        </td>
                                        <td class="text-left">{{ item.name }}</td>
                                        <td class="text-center">{{ item.qty }}</td>
                                        <td class="text-center">{{ priceDecimal(Number(item.amt)) }}</td>
                                        <td class="text-center">{{ priceDecimal(item.qty * item.amt) }}</td>
                                   </tr>
                                   <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="text-bold text-start">Total Amount (RM)</td>
                                        <td class="text-bold text-end">{{ priceDecimal(this.totalAmt)}}</td>
                                   </tr>
                                   <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="text-bold text-start">Total Shipping Fee (RM)</td>
                                        <td class="text-bold text-end">{{ priceDecimal(this.totalFee)}}</td>
                                   </tr>
                              </tbody>
                         </v-table>
                         <!-- <p>payment gateway</p> -->
                    </div>
               </v-card-text>
               <v-card-actions>
                    <v-btn @click="submitCheckout">Confirm</v-btn>
                    <v-btn @click="closeDialog">Cancel</v-btn>
               </v-card-actions>
          </v-card>
     </v-dialog>
</template>
   
<script>
import { CallApi } from '../../CallApi/callApi';
import { executeRecaptcha, priceDecimal } from '../../utils/utils'

export default {
     data: () => ({
          totalAmt: 0,
          totalFee: 0
     }),
     props: {
          modelValue: {
               type: Boolean,
               required: true          
          },
          checkoutList: {
               type: Array,
               required: true
          },
          itemFee: {
               type: Array,
               required: true
          },
          stateFee: {
               type: Number,
               required: true
          },
          userId: {
               type: [Number, null],
               required: true  
          }
     },
     methods: {
          priceDecimal,
          async closeDialog() {
               const data = {
                    userId: this.userId,
                    recaptchaToken: await executeRecaptcha('delete_checkout')
               }

               await CallApi.deleteCheckout(data)
               this.$emit("update:modelValue", false)
          },
          async submitCheckout() {

          },
          getProductImage(productName) {
               return new URL(`https://storage.googleapis.com/veryhardware/${productName}.jpeg`).href
          },
          calculateShippingFee(){
               this.totalFee = 0
               this.totalAmt = 0

               if (!this.checkoutList || !this.itemFee) {
                    console.log('Invalid data for shipping fee calculation.');
                    return;
               }
               
               this.checkoutList.forEach((item) => {
                    const itemFee = this.itemFee.find(fee => fee.itemId === item.itemId)

                    this.totalAmt += item.qty * Number(item.amt)
                    
                    if (itemFee) {
                         this.totalFee += (item.qty * Number(item.amt) * itemFee.fee)
                    }
               })

               this.totalFee *= this.stateFee
          }
     },
}
</script>

<style>
.dialog-title {
     font-weight: bold;
}

.v-table {
     border: 1px solid rgb(224, 224, 224) ;
}
</style>
   