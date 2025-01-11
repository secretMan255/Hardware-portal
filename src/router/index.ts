import { createRouter, createWebHistory } from "vue-router";
import home from "@/views/home/home.vue";
import aboutUs from "@/views/aboutUs/aboutUs.vue";
import products from "@/views/products/products.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: home,
  },
  {
    path: "/about",
    name: "About",
    component: aboutUs,
  },
  {
    path: "/product",
    name: "Product",
    component: products,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
