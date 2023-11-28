import { createRouter, createWebHashHistory } from "vue-router";
import { TheDashboard, TheDocumentation } from "../views";
import { TheSecondStep, TheThirdStep } from "@/components";

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
  {
    path: "/step-2",
    name: "step 2",
    component: TheSecondStep,
  },
  {
    path: "/step-3",
    name: "step 3",
    component: TheThirdStep,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
