import Vue from "vue";
import VueRouter from "vue-router";
import TestA from "../pages/A";
import TestB from "../pages/B";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "hash",
  base: "/",
  routes: [
    { name: "A", path: "/a", component: TestA },
    { name: "B", path: "/b", component: TestB }
  ]
});
