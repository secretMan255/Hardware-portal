<template>
          <!-- <v-file-input 
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
          </v-btn> -->
          <v-card class="location-container pt-5 pb-5">
               <v-row>
                    <v-col cols="12" sm="6">
                         <div class="about-us-container">
                              <p class="font-weight-bold text-h5 text-red">ABOUT US</p>
                              <p class="font-weight-bold">
                                   We offer a comprehensive range of high-quality hardware products, proudly established in 2025 and headquartered in Selangor, Malaysia.
                              </p>
                              <p class="font-weight-bold">
                                   With a dedicated team of skilled and experienced professionals, we strive to understand our customers' needs thoroughly and deliver products tailored to meet their expectations.
                              </p>
                              <p class="font-weight-bold">
                                   If you're interested in our products or exploring potential collaborations, please don't hesitate to reach out to us. We look forward to connecting with you.
                              </p class="font-weight-bold">
                         </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                         <div class="about-us-container">
                              <v-list class="product-describe" density="compact">
                                   <v-list-subheader class="font-weight-bold text-h5 text-red">OUR GOALS</v-list-subheader>
                                   <v-list-item
                                        v-for="(text, index) in outGoal"
                                        :key="index"
                                   >
                                             <template v-slot:prepend>
                                                  <v-icon icon="mdi-circle-small"></v-icon>
                                             </template>
                                             <v-list-item-title class="font-weight-bold">{{ text }}</v-list-item-title>
                                   </v-list-item>
                              </v-list>
                         </div>
                    </v-col>
               </v-row>
          </v-card>
          <v-card class="location-container">
               <div class="mb-5 mt-5 text-center">
                    <p class="font-weight-bold text-h5 text-red">OUR LOCATION</p>
               </div>
               <div id="map" class="map-container"></div>
          </v-card>
</template>

<script>
import { CallApi } from '@/CallApi/callApi';
import { Loader } from '@googlemaps/js-api-loader';

export default {
     data() {
          return {
               imageUrl: null,
               isUploading: false,
               image: null,
               location: { lat: 3.019596625302822, lng: 101.7042589067457 },
               outGoal: ['Provide excellent service and cheap source to related industries', 'Reliable & efficient customer service', 'Fulfill customer’s need']
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
                         bucket: 'veryhardware',
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
          async initMap() {
               window.scrollTo({ top: 0, behavior: "smooth" })
               const loader = new Loader({
                    apiKey: import.meta.env.VITE_MAP_KEY,
                    version: "weekly",
               })

               loader.load().then(async () => {
                    const { Map } = await google.maps.importLibrary("maps")
                    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker")

                    const map = new Map(document.getElementById("map"), {
                         center: this.location,
                         zoom: 14,
                         mapId: "4504f8b37365c3d0"
                    })

                    const marker = new AdvancedMarkerElement({
                         map,
                         position: this.location
                    })
               })
          },
     },
     async mounted() {
               this.initMap()
          },
     }
</script>

<style scoped>
.location-container {
     width: 80%;
     display: flex;
     flex-direction: column;
     align-items: center;
     text-align: center;
     margin: 40px auto;
     border: 1px solid #bdbdbd5b;
     border-radius: 8px;
}

.map-container {
     width: 80%; 
     height: 400px; 
     border: 1px solid #a7a7a7;
     border-radius: 8px; 
     margin-bottom: 40px;
}

.about-us-container {
     width: 75%;
     margin: 0 auto;
     text-align: justify;
     font-family: Arial, sans-serif;
}

.about-us-container p {
     margin-bottom: 15px;
}

.b-color {
     height: auto;
     background-color: rgb(240, 240, 240);
     border-radius: 8px; 
     padding: 10px;
     align-items: center;
}

.icon{
     font-size: 20px;
}

.product-describe .v-list-item-title {
  font-size: 14px; /* Adjust for mobile */
  white-space: normal; /* Allow text wrapping */
  word-wrap: break-word; /* Break long words if needed */
}

@media (max-width: 600px) {
  .product-describe .v-list-item-title {
    font-size: 12px; /* Smaller font for narrow screens */
  }
}
</style>