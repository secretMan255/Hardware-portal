<template>
     <v-card>
          <p>abouUs</p>
          <v-btn @click="getImage">sohai</v-btn>
          <img v-if="imageUrl" :src="imageUrl" alt="Dynamic Image" />
     </v-card>
</template>

<script>
import { AxiosClient } from '@/axios/axios';
import { CallApi } from '@/CallApi/callApi';
export default {
     data() {
          return {
               imageUrl: null
          }
     }, 
     methods: {
          async getImage() {
               try {
                    const blob = await CallApi.getImage('products', 'AIR COMPRESSOR.jpeg')
                    console.log('Blob:', blob)

                    // Create an object URL for the image
                    this.imageUrl = URL.createObjectURL(blob)    
               } catch (err) {

               }
          }
     }
}
</script>