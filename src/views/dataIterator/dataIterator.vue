<template>
     <v-card v-show="showList.length > 0">
          <v-card-text>
               <v-data-iterator
                    :items="showList"
                    :items-per-page="itemsPerPage"
               >    
               <template v-slot:default="{ items }">
                    <v-footer
                         class="mb-4 text-bold"
                    >
                         Total Items: {{ showList.length }}
                    </v-footer>
                    <v-row>
                         <v-col
                              v-for="(item, i) in items"
                              :key="i"
                              cols="12"
                              sm="6"
                              xl="3"
                         >
                              <v-sheet border>
                                   <v-img
                                        class="cursor-pointer"
                                        :gradient="`to top right, rgba(255, 255, 255, .1), rgba(${item.raw.color}, .15)`"
                                        :src="getProductImage(item.raw.img)"
                                        height="300"
                                        @click="findProductParent(item.raw)"
                                        cover
                                   >
                                   </v-img>
                                   <v-list-item
                                        :subtitle="getParentName(item.raw.p_id)"
                                   >
                                        <template v-slot:title>
                                             <strong class="text-h6 cursor-pointer">
                                                  {{ item.raw.name }}
                                             </strong>
                                        </template>
                                   </v-list-item>
                    
                                   <v-table class="text-caption" density="compact">
                                        <tbody>
                                             <tr v-for="(desc, index) in JSON.parse(item.raw.describe)" :key="index">
                                                  <th>{{ index }}</th>
                                                  <th>{{ desc }}</th>
                                             </tr>
                                        </tbody>
                                   </v-table>
                              </v-sheet>
                         </v-col>
                    </v-row>
               </template>
          
               <template v-slot:footer="{ page, pageCount }">
                    <v-footer
                         class="mt-4 text-bold"
                         color="surface-variant"
                    >
                         Total Items: {{ showList.length }}
                    </v-footer>
               </template>
               </v-data-iterator>
          </v-card-text>
     </v-card>
</template>

<script>
import { getProductImage } from '../../utils/utils';
export default {
     props: {
          showList : {
               type: Array,
               required: true
          },
          products: {
               type: Object,
               required: true
          }
     }, 
     data () {
          return {
               itemsPerPage: this.showList.length,
               parentName: ''
          }
     },
     methods: {
          getProductImage,
          getParentName(parentId){
               for (const element of this.products) {
                    if (parentId == element.id) {
                         return element.name
                    }

                    if (element.children) {
                         for (const child of element.children) {
                              if (child.id == parentId) {
                                   return child.name
                              }
                         }
                    }
               }
          },
          findProductParent(item) {
               this.$emit("findProductParent", item)
          }
     },
}
</script>

<style scoped>
.cursor-pointer {
     cursor: pointer;
}

.text-bold {
     font-weight: bold;
}
</style>