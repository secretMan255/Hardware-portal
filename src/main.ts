import App from "./App.vue";
import { createApp } from "vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import stores from "./stores/index";
import "@mdi/font/css/materialdesignicons.css";

// (async () => {
//   await loadRecaptcha();
//   ;
// })();

createApp(App).use(vuetify).use(router).use(stores).mount("#app");
