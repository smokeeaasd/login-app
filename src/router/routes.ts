import type { RouteRecordRaw } from "vue-router";

type Route = RouteRecordRaw & {
  meta?: Record<"requireAuth", boolean>;
};

export const routes: readonly Route[] = [
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    redirect: { name: "login" },
    children: [
      {
        path: "/register",
        name: "register",
        component: () => import("@/views/RegisterPage.vue"),
      },
      {
        path: "/login",
        name: "login",
        component: () => import("@/views/LoginPage.vue"),
      },
    ],
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/HomePage.vue"),
    meta: { requireAuth: true },
  },
];
