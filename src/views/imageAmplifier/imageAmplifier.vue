<template>
     <v-dialog :model-value="modelValue" @update:model-value="updateDialog" width="500">
          <v-card>
               <v-card-text>
                    <v-img
                         :src="this.imgUrl"
                    ></v-img>
               </v-card-text>
          </v-card>
     </v-dialog>
</template>

<script>
export default {
     props: {
          modelValue: {
               type: Boolean,
               required: true          
          },
          imgUrl: {
               type: String,
               required: true
          }
     },
     methods: {
          updateDialog(newValue) {
               this.$emit("update:modelValue", newValue)
          },
     }
}
</script>