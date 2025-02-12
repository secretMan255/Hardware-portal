<template>
     <v-navigation-drawer v-model="drawer" :permanent="isDesktop" width="400" temporary >
          <v-list>
               <v-list-item
                    prepend-avatar="../../assets/ponke.png"
                    subtitle="PRODUCTS"
               >
                    <template v-slot:append>
                         <v-btn
                              icon="mdi-arrow-left-bold-box"
                              variant="text"
                              v-if="!isDesktop"
                              @click="toggleDrawer"
                         ></v-btn>
                    </template>
               </v-list-item>
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
               
               <template v-for="(product, index) in vuexProducts" :key="`group=${product.id}`">
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
     <v-btn
          icon="mdi-arrow-right-bold-box"
          variant="text"
          v-if="!isDesktop"
          @click="toggleDrawer"
          class="drawer-toggle-btn"
     >
     </v-btn>

     <!-- main content -->
     <v-card class="layout-card">
          <v-container>
               <v-text-field
                    v-model="searchItem"
                    label="Search"
                    clearable
                    prepend-inner-icon="mdi-search-web"
                    variant="outlined"
                    @update:modelValue="handleSearchInput"
                    density="compact"
               >
                    <template #append>
                         <v-btn variant="plain" block @click="searchItems">SEARCH</v-btn>
                    </template>
               </v-text-field>   
               <!-- breadcrumbs -->    
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
               
               <!-- display products -->
               <v-row class="g-5" v-if="0 == itemTableData.length"> 
                    <!-- search item -->
                    <template v-if="searchList">
                         <DataIterator
                              :showList="showList"
                              :products="products"
                              @findProductParent="findProductParent"
                         ></DataIterator>
                    </template>
                    <!-- display all product -->
                    <template v-else>
                         <v-col 
                              v-for="(product, index) in showList"
                              :key="index"
                              cols="12"
                              sm="6" 
                              md="4" 
                              lg="3" 
                              class="pa-3"
                         >
                              <v-sheet class="pa-5">
                                   <v-sheet
                                        elevation="10"
                                        class="mx-auto d-flex justify-center cursor-pointer img-container rounded-lg"
                                        height="265"
                                        @click= navigateToProduct(product)
                                   >
                                        <div class="pa-5"> 
                                             <v-img
                                                  :aspect-ratio="1"
                                                  class="bg-white mb-5"
                                                  :src="getProductImage(product.img || product.name)"
                                                  width="200"
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
                    </template>
               </v-row>
               <!-- display items -->
               <v-row v-else>
                    <v-col cols="12" md="6" class="mt-5">
                         <v-carousel show-arrows="hover" height="255" cycle interval="3000" hide-delimiters>
                              <v-carousel-item
                                   v-for="(image, index) in showImageList"
                                   :key="index"
                              >
                                   <v-img :src="getProductImage(image)" @click=openImageDialog(image) height="255" class="cursor-pointer"></v-img>
                              </v-carousel-item>
                         </v-carousel>
                    </v-col>
                    <!-- product describe-->
                    <v-col cols="12" md="6">
                         <v-card class="pa-2">
                              <v-list class="product-describe" density="compact">
                                   <v-list-subheader class="font-weight-bold text-h6">Describe</v-list-subheader>
                                   <v-list-item
                                        v-for="(item, index) in productDescribe"
                                        :key="index"
                                   >
                                             <template v-slot:prepend>
                                                  <v-icon icon="mdi-circle-small"></v-icon>
                                             </template>
                                             <v-list-item-title>{{ item }}</v-list-item-title>
                                   </v-list-item>
                              </v-list>
                         </v-card>
                    </v-col>
                    <!-- data table -->
                    <v-col cols="12" md="12">
                         <v-pagination
                              v-model="page"
                              :length="pageCount"
                              density="compact"
                         ></v-pagination>
                         <v-data-table 
                              v-model:page="page"
                              :loading="loading"
                              :items="itemTableData"
                              :items-per-page="itemsPerPage"
                              density="compact"
                         >
                              <template v-slot:item.Image="{ item }">
                                   <v-img
                                        @click=openImageDialog(item.Image)
                                        :src="getProductImage(item.Image)" 
                                        class="item-img cursor-pointer"    
                                   ></v-img>
                              </template>
                              <template v-slot:item.price="{ item }">
                                   {{ 'RM ' + priceDecimal(Number(item.price))}}
                              </template>
                         </v-data-table>
                    </v-col>
               </v-row>
          </v-container>

          <!-- item dialog -->
          <v-dialog 
               v-model="itemDialog"
               width="700"
          >
               <v-card>
                    <v-card-title>{{ selectedItem?.name || 'No Item Selected' }}</v-card-title>
                    <v-card-text class="pt-0">
                         <v-img
                              :aspect-ratio="1"
                              class="mx-auto d-flex justify-center cursor-pointer img-container rounded-lg"
                              :src="getProductImage(selectedItem.name)"
                              width="200"
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
                    <!-- <v-btn v-if="selectedItem.qty > 0 && isUserLogin" @click="addToCart">
                         ADD TO CART
                    </v-btn>
                    <v-btn v-if="!isUserLogin" disabled>
                         PLEASE LOGIN
                    </v-btn>
                    <v-btn v-if="selectedItem.qty <= 0" disabled>
                         OUT OF STOCK
                    </v-btn> -->
               </v-card>
          </v-dialog>

          <!-- image amplifier -->
          <ImageAmplifier
               v-model="ImageAmpDialog"
               :imgUrl="imgUrl"
          >
          </ImageAmplifier>
     </v-card>
     <Footer></Footer>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Footer from '../footer/footer.vue'
import { EventBus, priceDecimal, parseProductDescribe, getProductImage } from '../../utils/utils';
import ImageAmplifier from '../imageAmplifier/imageAmplifier.vue'
import DataIterator from '../dataIterator/dataIterator.vue';

export default {
     props: {
          // props from home page
          id: {
               type: [String, Number],
               required: false
          },
     },
     data() {
          return {
               itemTableData: [],
               // products: [],
               showList: [],
               // items: [],
               // image: [],
               showImageList: [],
               bread: ['ALL'],
               productDescribe: [],
               itemDialog: false,
               ImageAmpDialog: false,
               loading: true,
               drawer: false,
               searchList: false,
               selectedItem: null,
               imgUrl: '',
               searchItem: '',
               activeItem: 0,
               page: 1,
               itemsPerPage: 10,
               windowWidth: window.innerWidth
          }
     },
     computed: {
          ...mapState({vuexProducts: 'products',vuexItems: 'items',vuexImages: 'images', }),
          isDesktop() {
               return this.windowWidth >= 1024
          }, 
          // isUserLogin() {
          //      const user = sessionStorage.getItem('user')

          //      return user
          // },
          pageCount () {
               return Math.ceil(this.itemTableData.length / this.itemsPerPage)
          },
     },
     components: {
          DataIterator,
          Footer,
          ImageAmplifier
     },
     methods: {
          ...mapActions(['fetchProducts']),
          getProductImage,
          priceDecimal,
          parseProductDescribe,
          openImageDialog(img) {
               this.ImageAmpDialog = true
               this.imgUrl = this.getProductImage(img)
          },
          // check user is login or no before add item to cart
          addToCart() {
               const user = sessionStorage.getItem('user')
               if (this.selectedItem && user) {
                    EventBus.emit('add-to-cart', this.selectedItem)
               }
          },
          // expend navigation drawer
          toggleDrawer() {
               this.drawer = !this.drawer
          },
          updateWindowWidth() {
               this.windowWidth = window.innerWidth
               if (this.isDesktop) {
                    this.drawer = true
               } else {
                    this.drawer = false
               }
          },
          falseDrawer() {
               this.drawer = false
          },
          clearData() {
               this.products = []
               this.showList = []
               this.items = []
          },
          async getProductsFromHomepage(){
               try {
                    this.$nextTick(() => {
                         window.scrollTo({ top: 0, behavior: "smooth" });
                    })
                    // if user click the product from home page
                    if (this.id) {
                         const showItem = this.showList.find((item) => item.id == this.id)
                         
                         if (showItem) {
                              this.showList = [showItem]
                              this.bread = this.getBreadcrumbTrail(showItem)
                              this.navigateToProduct(showItem)
                         }
                    }
               } catch(err) {
                    this.clearData()
               }
          },
          navigateToProduct(product) {
               if (!this.isDesktop) {
                    this.falseDrawer()
               }
               this.searchList = false
               this.itemTableData = []
               this.$nextTick(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" })
               })

               // reset pagination 
               this.page = 1

               // set which item is selected and display in the navigation drawer
               this.activeItem = product.id
               // if user click ALL
               if (product === 0) {
                    this.resetProductPage()
                    return
               } 
               
               // get product describe
               this.productDescribe = product.describe
               ? this.parseProductDescribe(JSON.stringify(product.describe))
               : []

               // clear search each naviagtion
               this.searchItem = ''
               this.loading = true

               // search item from parent 
               const item = this.vuexItems.filter((item) => item.p_id === product.id)

               this.showImageList = this.vuexImages
                    .filter((item) => item.id === product.id)
                    .map((item) => `${item.image}`)
               
               // generate bread
               this.bread = this.getBreadcrumbTrail(product)
               
               if (item.length > 0 ) {
                    // push item detaild to display items
                    item.forEach(value => {
                         let describe
                         try {
                              describe = typeof value.describe === 'string' ? JSON.parse(value.describe) : value.describe || {}
                         } catch (err) {
                              describe = {}
                         }
                         this.itemTableData.push({Image: value.img || value.name, name: value.name, ...describe, price: value.price})
                    })
                    this.loading = false
                    return
               }
               this.loading = false

               const filteredItems = this.vuexItems.filter((item) => item.p_id === product.id)
               this.showList = filteredItems.length > 0 ? filteredItems : product.children || []  
          },
          findProductParent(product){
               // find parent product from dataIterator component
               this.vuexProducts.forEach(element => {
                    element.children.forEach(children => {
                         if (product.p_id === children.id) {
                              this.navigateToProduct(children)
                              return
                         }
                    })
               })
          },
          getBreadcrumbTrail(product) {
               const trail = []
               this.itemTableData = []

               const findParentHierarchy = (currentProduct) => {
                    if (currentProduct) {
                         // Add the current product's name and a delimiter at the beginning of the trail
                         trail.unshift(currentProduct.name)
                         trail.unshift(' / ')

                         // A helper function to search through a tree of products
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

                         // Find the parent of the current product
                         const parent = findParent(this.vuexProducts, currentProduct.p_id)
                         if (parent) {
                              // Recursively process the parent's hierarchy
                              findParentHierarchy(parent)
                         }
                    }
               };

               // Start building the trail from the given product
               findParentHierarchy(product)

               // Always start the breadcrumb trail with 'ALL'
               trail.unshift('ALL')
               return trail
          },
          handleBreadcrumbClick(index) {
               // if click ALL
               if (index === 0) {
                    this.resetProductPage()
                    return
               }

               const targetCrumbName = this.bread[index]

               const findProductByName = (products, name) => {
                    for (const product of products) {
                         // if product is parent
                         if (product.name === name) {
                              return product
                         }

                         // if product inside parent
                         if (product.children && product.children.length > 0) {
                              const found = findProductByName(product.children, name)
                              if (found) {
                                   return found
                              }
                         }
                    }
                    return null
               };

               // navigate to product else navigate to the child list p_id
               const targetProduct = findProductByName(this.vuexProducts, targetCrumbName)
               if (targetProduct) {
                    this.bread = this.bread.slice(0, index + 1)
                    this.activeItem = targetProduct.id
                    this.navigateToProduct(targetProduct)
               }
          },
          // reset params
          resetProductPage() {
               this.searchList = false
               this.searchItem = ''
               this.itemTableData = []

               // display all product
               this.showList = this.vuexProducts
               this.activeItem = 0
               this.bread = ['ALL']
          },
          handleSearchInput(value) {
               // reset params if user clear search textfield
               if (!value || value == '') {
                    this.searchList = false
                    this.resetProductPage()
               }
          }, 
          searchItems(){
               // reset params if user search nothing
               if (!this.searchItem || this.searchItem.trim() === '') {
                    this.resetProductPage()
                    return 
               }
               
               this.itemTableData = []

               const search = this.searchItem.toLowerCase()
               const result = this.vuexItems.filter((item) =>  
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

               // display search item component
               this.searchList = true
          }
     },
     async mounted() {
          await this.getProductsFromHomepage()
          
          // get data from vuex store
          await this.fetchProducts()
          
          // reset the product page to display all products initial
          this,this.resetProductPage()
          
          // set drawer based on screen size
          this.updateWindowWidth()
          this.drawer = this.isDesktop
          
          // add a resize event listener
          window.addEventListener("resize", this.updateWindowWidth)
     },
     beforeMount() {
          this.clearData()
          window.removeEventListener("resize", this.updateWindowWidth)
     },
}
</script>

<style scoped> 
.layout-card {
     min-height: 1500px;
}

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
    background-color: #555555 !important;
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

.drawer-toggle-btn {
     position: fixed; 
     top: 55%; 
     transform: translateY(-50%); 
     z-index: 1000;
     margin-left: -8px;
}

.v-navigation-drawer { 
    scrollbar-color: white #f0f0f0;
    overflow-y: auto !important
}

.item-img {
     width: 100px;
}

.cursor-pointer {
     cursor: pointer;
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