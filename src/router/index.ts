import { createRouter, createWebHashHistory } from "vue-router";
import { TheDashboard, TheDocumentation } from "../views";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: TheDashboard,
  },
  {
    path: "/documentation",
    name: "documentation",
    component: TheDocumentation,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
