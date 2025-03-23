import { useToast } from "@/components/ui/toast";
import { apiUrl } from "@/config/env";
import { createFetch } from "@vueuse/core";
import { useAuthStore } from "@/stores/auth";

export const useApi = createFetch({
  baseUrl: apiUrl,
  options: {
    beforeFetch({ options }) {
      const { accessToken } = useAuthStore();

      if (accessToken) {
        options.headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }

      return { options };
    },
    onFetchError(ctx) {
      const msg = ctx.data?.message || "A requisição falhou.";

      const { toast } = useToast();

      toast({
        title: "Não foi possível concluir a requisição",
        description: msg,
        variant: "destructive",
      });

      return ctx;
    },
    immediate: false,
  },
  fetchOptions: {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
});
