import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/index.css";

const pinia = createPinia();

const app = createApp(App).use(router).use(pinia);
router.isReady().then(() => {
	app.mount("#app");
});
