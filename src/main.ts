import App from "./App.vue";
import { createApp } from "vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css";
import { loadRecaptcha } from "./utils/utils";

loadRecaptcha()
  .then(() => {})
  .catch((error) => {});

createApp(App).use(vuetify).use(router).mount("#app");
