import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import router from "./router";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import { createPinia } from "pinia";

import "../src/styles/_global.scss";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

const app = createApp(App);

const pinia = createPinia();

app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.use(pinia);

app.mount("#app");
