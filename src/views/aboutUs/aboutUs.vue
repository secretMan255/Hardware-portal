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
          <v-card class="location-container">
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
                              <p class="font-weight-bold text-h5 text-red">OUR GOALS</p>
                              <div class="b-color mb-10 d-flex">
                                   <p><v-icon class="icon">mdi-chevron-right</v-icon> Provide excellent service and cheap source to related industries </p>
                              </div>
                              <div class="b-color mb-10 d-flex">
                                   
                                   <p><v-icon class="icon">mdi-chevron-right</v-icon>Reliable & efficient customer service</p>
                              </div>
                              <div class="b-color d-flex">
                                   <p><v-icon class="icon">mdi-chevron-right</v-icon>Fulfill customer’s need</p>
                              </div>
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
import { loadGoogleMap } from '@/utils/utils';

export default {
     data() {
          return {
               imageUrl: null,
               isUploading: false,
               image: null,
               map: null,
               marker: null,
               location: { lat: 3.019596625302822, lng: 101.7042589067457 }
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
          initMap() {
               this.map = new google.maps.Map(document.getElementById("map"), { 
                    center: this.location,
                    zoom: 100,
               })
               this.addMarker()
          },
          addMarker() {
               this.marker = new google.maps.Marker({
                    position: this.location,
                    map: this.map,
               })
          }
     },
     async mounted() {
          try {
               await loadGoogleMap();
               this.initMap();
          } catch (error) {
               console.error("Google Maps API failed to load:", error.message)
          }
          },
     }
</script>

<style>
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
     padding: 20px;
     font-family: Arial, sans-serif;
}

.about-us-container p {
     margin-bottom: 15px;
     line-height: 1.2;
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
</style>