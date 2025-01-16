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
    path: "/product",
    name: "Product",
    component: products,
  },
  {
    path: "/contactUs",
    name: "Contact Us",
    component: contact,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
