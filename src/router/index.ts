import type { JwtPayload } from "@/models/jwtPayload";
import { useAuthStore } from "@/stores/auth";
import { useJwt } from "@vueuse/integrations/useJwt";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const { accessToken, refreshToken } = authStore;

  // Se o usuário tá indo pra login/register e já tem tokens, redireciona pra home
  if (
    (to.name === "login" || to.name === "register") &&
    accessToken &&
    refreshToken
  ) {
    return next({ name: "home" });
  }

  // Se faltar algum token e o usuário não estiver tentando acessar login/register, redireciona pra login
  if (
    (!accessToken || !refreshToken) &&
    to.name !== "login" &&
    to.name !== "register"
  ) {
    return next({ name: "login" });
  }

  // Se faltar tokens e o usuário está tentando acessar login/register, deixa ele acessar
  if (!accessToken || !refreshToken) {
    return next();
  }

  // Pega o payload dos tokens
  const { payload: accessTokenPayload } = useJwt<JwtPayload>(accessToken);
  const { payload: refreshTokenPayload } = useJwt<JwtPayload>(refreshToken);

  const currentTime = Math.floor(Date.now() / 1000);

  // Se o access token expirou...
  if (accessTokenPayload.value!.exp < currentTime) {
    // Se o refresh token também tá expirado, faz logout e redireciona pro login
    if (refreshTokenPayload.value!.exp < currentTime) {
      await authStore.logout(refreshToken);
      return next({ name: "login" });
    }

    // Se o refresh token é válido, atualiza o access token
    const { execute: refreshAccessToken, data: refreshData } =
      authStore.refreshAccessToken(refreshToken);
    await refreshAccessToken();

    console.log("Novo access token: ", refreshData.value!.access_token);
    authStore.setAccessToken(refreshData.value!.access_token);
  }

  next(); // Se tudo estiver ok, permite a navegação
});

export default router;
