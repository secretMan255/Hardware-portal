<template>
     <v-carousel 
          :height="carouselHeight" 
          hide-delimiter-background
          cycle
     >
          <template v-slot:prev="{ props }">
               <v-btn
                    color="black"
                    variant="plain"
                    @click="props.onClick"
                    icon="mdi-chevron-left"
               ></v-btn>
          </template>
          <template v-slot:next="{ props }">
               <v-btn
                    color="black"
                    variant="plain"
                    @click="props.onClick"
                    icon="mdi-chevron-right"
               ></v-btn>
          </template>
          <v-carousel-item
               v-for="(item,i) in slides"
               :key="i"
               :src="item.image"
               cover
          ></v-carousel-item>
     </v-carousel>
     <div class="text-center">
          <p class="font-weight-bold text-red text-h4 mb-5">What We Provide</p>
          <p class='introduce'>Our company provides high-quality and low-priced products, such as: power tools, pipes, bathroom accessories, etc.</p>
          <p class='introduce'>If you want to know more discounts or have other needs, please be sure to contact us.</p>
     </div>
     <v-card class="mt-10 text-center mb-0">
          <v-container>
               <p class="font-weight-bold text-red text-h4">Product Category</p>
               <v-row class="g-5 mb-10">
                    <v-col 
                         v-for="(product, i) in mainProduct" :key="i"
                         cols="12"
                         sm="6" 
                         md="4" 
                         lg="3" 
                         class="pa-3 mb-10 mt-10"
                    >
                         <v-sheet
                              elevation="10"
                              class="pa-4 mx-auto d-flex justify-center cursor-pointer img-container rounded-lg mr-0"
                              height="200"
                              @click="$router.push({ name: 'Product', params: { id: product.id } })"
                         >
                              <v-img
                                   :aspect-ratio="1"
                                   class="bg-white"
                                   width="200"
                                   :src="getProductImage(product.name)"
                              ></v-img>
                         </v-sheet>
                         <div class="text-subtitle-2 text-center">{{ product.name }}</div>
                    </v-col>
               </v-row>
          </v-container>
     </v-card>
</template>

<script>
import { CallApi } from '../../CallApi/callApi';

export default {
     data () {
          return {
               slides: [
                    { image: 'https://storage.googleapis.com/veryhardware/slide1.jpeg' },
                    { image: 'https://storage.googleapis.com/veryhardware/slide2.jpeg' },
                    { image: 'https://storage.googleapis.com/veryhardware/slide3.jpeg' },
                    { image: 'https://storage.googleapis.com/veryhardware/slide4.jpeg' },
               ],
               mainProduct: {},
               windowWidth: window.innerWidth,
          }
     },
     computed: {
          carouselHeight() {
               return this.windowWidth < 768 ? '300px' : '600px'
          }
     },
     methods: {
          async getMainProduct(){
               const getMainProduct = await CallApi.getMainProduct()

               if (getMainProduct.ret != 0) {
                    return 
               }
               this.mainProduct = getMainProduct.data
          },
          getProductImage(productName) {
               return new URL(`https://storage.googleapis.com/veryhardware/${productName}.jpeg`).href
          },
          updateWindowWidth() {
               this.windowWidth = window.innerWidth;
          }
     },
     mounted() {
          window.addEventListener('resize', this.updateWindowWidth)
          this.getMainProduct();
     },
     beforeUnmount() {
          window.removeEventListener('resize', this.updateWindowWidth)
     }
}
</script>

<style>
.layout-card {
     min-height: 1500px;
}

.text-center {
     text-align: center;
     margin-top: 10px;
}

.introduce {
     margin-bottom: 15px;
     line-height: 1.2;
     font-family: Arial, sans-serif;
     font-weight: bold
}
</style>