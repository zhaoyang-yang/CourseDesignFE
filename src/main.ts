import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

createApp(App).use(ElementPlus, { size: "small", zIndex: 3000 }).use(store).use(router).mount("#app");
