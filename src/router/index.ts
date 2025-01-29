import { createRouter, createWebHistory } from "vue-router";
import home from "@/views/home/home.vue";
import aboutUs from "@/views/aboutUs/aboutUs.vue";
import products from "@/views/products/products.vue";
import contact from "@/views/contact/contact.vue";

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
    path: "/product/:id?",
    name: "Product",
    component: products,
    props: true,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
