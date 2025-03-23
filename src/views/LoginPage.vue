<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import { z } from "zod";

import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import router from "@/router";

const { toast } = useToast();
const authStore = useAuthStore();

const schema = toTypedSchema(
  z.object({
    email: z
      .string()
      .email("O email é inválido")
      .nonempty("O email é obrigatório"),
    password: z.string().nonempty("A senha é obrigatória"),
  })
);

const { isFieldDirty, isSubmitting, handleSubmit, handleReset } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit(async (values) => {
  handleReset();

  try {
    const {
      execute: login,
      data: loginData,
      statusCode,
    } = authStore.login(values);

    await login();

    const errorMessages = {
      400: "Dados de entrada inválidos.",
      401: "Credenciais inválidas.",
    };

    if (statusCode.value === 400 || statusCode.value === 401) {
      return toast({
        title: "Erro ao fazer login",
        description: errorMessages[statusCode.value],
        variant: "destructive",
      });
    }

    toast({
      title: "Login bem-sucedido!",
    });

    authStore.setAccessToken(loginData.value!.access_token);
    authStore.setRefreshToken(loginData.value!.refresh_token);

    router.push({ name: "home" });
  } catch (error: any) {
    toast({
      title: "Erro ao logar",
      description: error.message || "Ocorreu um erro inesperado.",
      variant: "destructive",
    });
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader class="text-center">
        <CardTitle>Bem-vindo de volta, aluno!</CardTitle>
        <CardDescription>Faça login com sua conta do Google</CardDescription>
      </CardHeader>

      <CardContent class="flex flex-col gap-4">
        <Button variant="outline" class="w-full" :disabled="isSubmitting">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Login com Google
        </Button>

        <div
          class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
        >
          <span class="relative z-10 bg-card px-2 text-muted-foreground"
            >Ou continue com</span
          >
        </div>

        <form @submit.prevent="onSubmit">
          <div class="grid gap-4">
            <FormField
              v-slot="{ componentField }"
              name="email"
              :validateOnBlur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    :disabled="isSubmitting"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Sua senha"
                    v-bind="componentField"
                    :disabled="isSubmitting"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button type="submit" class="w-full" :disabled="isSubmitting"
              >Entrar</Button
            >
          </div>
        </form>

        <div class="text-center text-sm">
          Não tem uma conta?
          <RouterLink to="register" class="underline underline-offset-4"
            >Cadastre-se</RouterLink
          >
        </div>
      </CardContent>
    </Card>

    <!-- Termos de serviço -->
    <div
      class="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary"
    >
      Ao clicar em continuar, você concorda com nossos
      <a href="#">Termos de Serviço</a> e
      <a href="#">Política de Privacidade</a>.
    </div>
  </div>
</template>
