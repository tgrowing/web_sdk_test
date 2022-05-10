/* eslint-disable */
// Library
import Vue from "vue";
import router from "./router/index";
// Page & Component
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

export default new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
