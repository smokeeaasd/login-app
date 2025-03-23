import { useApi } from "@/composables/api";
import type { LoginResource, RefreshResource, RegisterResource, UserResource } from "@/models/responses";
import router from "@/router";
import { useStorage } from "@vueuse/core"; // Import useStorage
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: useStorage("access_token", null as string | null),
    refreshToken: useStorage("refresh_token", null as string | null),
  }),
  actions: {
    register(data: { name: string; email: string; password: string }) {
      return useApi("/student/register")
        .post({ ...data })
        .json<RegisterResource>();
    },
    login(data: { email: string; password: string }) {
      return useApi("/student/login")
        .post({ ...data })
        .json<LoginResource>();
    },
    logout(refresh_token: string) {
      return useApi("/logout", {
        afterFetch: async (ctx) => {
          this.setAccessToken(null);
          this.setRefreshToken(null);

          router.push({ name: "login" });

          return ctx;
        },
      }).post({ refresh_token });
    },
    refreshAccessToken(refresh_token: string) {
      return useApi("/token/refresh")
        .post({ refresh_token })
        .json<RefreshResource>();
    },
    me() {
      return useApi("/users/me").get().json<UserResource>();
    },
    setAccessToken(token: string | null) {
      this.$state.accessToken = token;
    },
    setRefreshToken(token: string | null) {
      this.$state.refreshToken = token;
    },
  },
});
