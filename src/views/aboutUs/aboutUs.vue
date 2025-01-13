<template>
     <v-card>
          <p>abouUs</p>
          <!-- <v-btn @click="getImage">sohai</v-btn>
          <img v-if="imageUrl" :src="imageUrl" alt="Dynamic Image" /> -->

          <v-file-input 
               v-model="image" 
               accept="image/*" 
               clearable 
               label="Choose an image"
          ></v-file-input>
          <v-btn
               :disabled="!image || isUploading"
               class="mt-4"
               color="primary"
               @click="uploadImage"
          >
               {{ isUploading ? "Uploading..." : "Go Go Power Ranger" }}
          </v-btn>
     </v-card>
</template>

<script>
import { CallApi } from '@/CallApi/callApi';
export default {
     data() {
          return {
               imageUrl: null,
               isUploading: false,
               image: null
          }
     }, 
     methods: {
          async getImage() {
               try {
                    const blob = await CallApi.getImage('products', 'AIR COMPRESSOR.jpeg')

                    // Create an object URL for the image
                    this.imageUrl = URL.createObjectURL(blob)    
               } catch (err) {
                    console.log('getImage failed: ' , err)
               }
          },
          async uploadImage() {
               try {
                    if (!this.image) {
                         return
                    }

                    this.isUploading = true
                    const base64Image = await this.convertToBase64(this.image)

                    const payload = {   
                         imageName: this.image?.name,
                         imageBase64: base64Image
                    }

                    const res = await CallApi.uploadImage(payload)
                    console.log('res: ' , res)
               } catch (err) {
                    console.log('uploadImage failed: ' , err)
               } finally {
                    this.isUploading = false
               }
          },
          async convertToBase64(file) {
               return new Promise((resolve, reject) => {
               const reader = new FileReader()
               reader.onload = () => resolve(reader.result.split(",")[1])
               reader.onerror = (error) => reject(error)
               reader.readAsDataURL(file)
               })
          },
     }
}
</script>