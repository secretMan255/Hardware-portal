<template>
     <v-card>
          <v-navigation-drawer :width="460" permanent expand-on-hover rail>
               <v-list>
                    <v-list-item
                         prepend-avatar="../../assets/ponke.png"
                         subtitle="PRODUCTS"
                    ></v-list-item>
               </v-list>
                    <v-divider></v-divider>
               <v-list density="compact" nav >
                    <v-list-item
                         :prepend-icon="'mdi-alpha-a-circle'"
                         :key="0"
                         :title="'ALL'"
                         :class="{ 'active-item': activeItem === 0 }"
                         @click="navigateToProduct(0)"
                    >
                    </v-list-item>
                    
                    <template v-for="(product, index) in products" :key="`group=${product.id}`">
                         <v-list-group
                              v-if="product.children.length > 0"
                              :prepend-icon="product.icon"
                              :class="{ 'active-item': activeItem === 0 }"
                              :title="product.name"
                         >
                              <template v-slot:activator="{ props }">
                                   <v-list-item 
                                        v-bind="props" 
                                        :title="product.name" 
                                        :class="{ 'active-item': activeItem === product.id }">
                                   </v-list-item>
                              </template>

                              <template
                                   v-for="(child, index) in product.children" :key="`group=${child.id}`"
                                   :title="child.name"
                                   @click="navigateToProduct(child)"
                                   :class="{ 'active-item': activeItem === 0 }"
                              >
                                   <v-list-group
                                        v-if="child.children && child.children.length > 0"
                                        :title="child.name"
                                   >
                                        <template v-slot:activator="{ props }">
                                             <v-list-item v-bind="props" :title="child.name"></v-list-item>
                                        </template>
                                        <v-list-item
                                             v-for="(grandChild, grandChildIndex) in child.children"
                                             :key="`grandchild-group=${grandChild}`"
                                             :title="grandChild.name"
                                             :class="{ 'active-item': activeItem === grandChild.id }"
                                             @click="navigateToProduct(grandChild)"
                                        ></v-list-item>
                                   </v-list-group>
                                   <v-list-item
                                        v-else
                                        :title="child.name"
                                        :class="{ 'active-item': activeItem === child.id }"
                                        @click="navigateToProduct(child)"
                                   ></v-list-item>
                                   <v-divider></v-divider>
                              </template>
                         </v-list-group>
                         <v-list-item
                              v-else
                              :prepend-icon="product.icon"
                              :title="product.name"
                              :class="{ 'active-item': activeItem === product.id }"
                              @click="navigateToProduct(product)"
                         ></v-list-item>
                    </template>
               </v-list>
          </v-navigation-drawer>
          
          <v-container >
               <!-- <div class="breadcrumb-container rounded-lg"> -->
               <v-text-field
                    v-model="searchItem"
                    label="Search"
                    clearable
                    prepend-inner-icon="mdi-search-web"
                    variant="outlined"
                    @keydown.enter.prevent="searchItems" 
               ></v-text-field>
               <v-breadcrumbs class="pt-0">
                    <v-breadcrumbs-item
                         v-for="(crumb, index) in bread"
                         :key="index"
                         @click="handleBreadcrumbClick(index)"
                         class="cursor-pointer"
                         :disabled="index === bread.length - 1"
                    >
                         {{ crumb }}
                    </v-breadcrumbs-item>
               </v-breadcrumbs>
                              
               <!-- </div> -->
               <v-row class="g-5">
                    <v-col 
                         v-for="(product, index) in showList"
                         :key="index"
                         cols="12"
                         sm="6" 
                         md="4" 
                         lg="3" 
                         class="pa-3"
                         
                    >
                         <v-sheet class="pa-4">
                              <v-sheet
                                   :elevation="elevation"
                                   class="mx-auto d-flex justify-center cursor-pointer img-container"
                                   height="300"
                                   @click= navigateToProduct(product)
                              >
                                   <div> 
                                        <v-img
                                             :aspect-ratio="1"
                                             class="bg-white"
                                             :src="getProductImage(product.name)"
                                             width="250"
                                        >
                                             <template v-slot:error>
                                                  <v-img
                                                       class="mx-auto"
                                                       height="300"
                                                       max-width="500"
                                                       src="../../assets/missingImage.jpeg"
                                                  ></v-img>
                                             </template>
                                        </v-img>
                                        <div class="text-subtitle-2 text-center">{{ product.name }}</div>
                                   </div>
                              </v-sheet>
                         </v-sheet>
                    </v-col>
               </v-row>
          </v-container>

          <v-dialog 
               v-model="itemDialog"
               width="700"
          >
               <v-card>
                    <v-card-title>{{ selectedItem?.name || 'No Item Selected' }}</v-card-title>
                    <v-card-text>
                         <v-row class="align-start mb-1" no-gutters>
                              <v-col cols="6">
                                   <div class="key">
                                        Price
                                   </div>
                                   <div class="value">
                                        {{ selectedItem?.price }}
                                   </div>
                              </v-col>
                              <v-col cols="6" v-for="(value, key) in selectedItem.describe" :key="key" class="text-start">
                                   <div class="key">
                                        {{ key }}
                                   </div>
                                   <div class="value">
                                        {{ value }}
                                   </div>
                              </v-col>
                         </v-row>
                    </v-card-text>
                    <v-btn>
                              ADD TO CART
                         </v-btn>
               </v-card>
          </v-dialog>
     </v-card>
</template>

<script>
import { CallApi } from '@/CallApi/callApi';

export default {
     data() {
          return {
               products: [],
               showList: [],
               items: [],
               bread: ['ALL'],
               itemDialog: false,
               selectedItem: null,
               searchItem: '',
               activeItem: 0,
               elevation: 10,
          }
     },
     methods: {
          clearData() {
               this.products = []
               this.showList = []
               this.items = []
          },
          async getProducts(){
               try {
                    const productList = await CallApi.getProductList(1)
                    const itemList = await CallApi.getItemList()
                    if (productList.ret != 0 || !productList || itemList.ret != 0 || !itemList) {
                         this.clearData()
                         return
                    } 

                    this.products = productList.data
                    this.showList = productList.data
                    this.items = itemList.data
               } catch(err) {
                    this.clearData()
               }
          },
          navigateToProduct(product) {
               this.activeItem = product.id
               if (product === 0) {
                    this.bread = ['ALL']
                    this.activeItem = 0
                    this.showList = this.products
                    return
               } 

               const item = this.items.filter((item) => item.name === product.name)

               if (item.length > 0 ) {
                    this.itemDialog = true
                    this.selectedItem = item[0]
                    this.selectedItem.describe = JSON.parse(this.selectedItem.describe.trim())
                    return
               }

               this.bread = this.getBreadcrumbTrail(product)

               const filteredItems = this.items.filter((item) => item.p_id === product.id)

               this.showList = filteredItems.length > 0 ? filteredItems : product.children || []  
          },
          getBreadcrumbTrail(product) {
               const trail = []

               const findParentHierarchy = (currentProduct) => {
                    if (currentProduct) {
                         trail.unshift(currentProduct.name)
                         trail.unshift(' / ')

                         const findParent = (products, id) => {
                              for (const prod of products) {
                                   if (prod.id === id) {
                                   return prod
                                   }

                                   if (prod.children && prod.children.length > 0) {
                                        const parent = findParent(prod.children, id)
                                        if (parent) {
                                             return parent
                                        }
                                   }
                              }
                              return null;
                         };

                         const parent = findParent(this.products, currentProduct.p_id)
                         if (parent) {
                              findParentHierarchy(parent)
                         }
                    }
               };

               findParentHierarchy(product)

               trail.unshift('ALL')
               return trail
          },
          handleBreadcrumbClick(index) {
               if (index === 0) {
                    this.bread = ['ALL']
                    this.activeItem = 0
                    this.showList = this.products
                    return
               }

               const targetCrumbName = this.bread[index]

               const findProductByName = (products, name) => {
                    for (const product of products) {
                         if (product.name === name) {
                              return product
                         }

                         if (product.children && product.children.length > 0) {
                              const found = findProductByName(product.children, name)
                              if (found) {
                                   return found
                              }
                         }
                    }
                    return null
               };

               const targetProduct = findProductByName(this.products, targetCrumbName)
               if (targetProduct) {
                    this.bread = this.bread.slice(0, index + 1)
                    this.activeItem = targetProduct.id
                    this.navigateToProduct(targetProduct)
               }
          },
          getProductImage(productName) {
               // return new URL(`../../assets/products/${productName}.jpeg`, import.meta.url).href
               return new URL(`https://storage.googleapis.com/veryhardware/${productName}.jpeg`).href
          },
          searchItems(){
               if (!this.searchItem || this.searchItem.trim() === '') {
                    this.showList = this.products
                    this.activeItem = 0
                    this.bread = ['ALL']
                    return 
               }
               
               const search = this.searchItem.toLowerCase()
               const result = this.items.filter((item) =>  
                    item.name.toLowerCase().includes(search)
               )
               
               if (result.length > 0) {
                    this.showList = result
                    this.bread = ['Search Result']
                    this.activeItem = null
               } else {
                    this.showList = []  
                    this.bread = ['No item found']
                    this.activeItem = null
               }
          }
     },
     async mounted() {
          await this.getProducts()
     },
     beforeMount() {
          this.clearData()
     }
}
</script>

<style>
.breadcrumb-container {
     position: fixed;
     top: 10;
     z-index: 1000;
     width: 100%;
     background-color: white;
     max-width: calc(100vw - 150px);
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
     overflow: hidden;
}

.img-container {
     overflow: hidden;
}

.v-list-item.active-item {
    background-color: #6200ea !important;
    color: white !important;
}

.key {
  font-weight: bold;
  padding-bottom: 0px;
  color: black;
}

.value {
  color: #919191;
  padding-bottom: 0px;
}

</style>