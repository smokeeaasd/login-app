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
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { z } from "zod";

const { toast } = useToast();
const authStore = useAuthStore();

const schema = toTypedSchema(
  z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    email: z
      .string()
      .email("O email é inválido")
      .nonempty("O email é obrigatório"),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .nonempty("A senha é obrigatória"),
  })
);

const { isFieldDirty, isSubmitting, handleSubmit } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const {
      execute: register,
      data: registerData,
      statusCode,
    } = authStore.register(values);

    await register();

    const errorMessages = {
      400: "Dados de entrada inválidos.",
      409: "O email informado pertence a uma conta já registrada.",
    };

    if (statusCode.value === 400 || statusCode.value === 409) {
      return toast({
        title: "Erro ao registrar",
        description: errorMessages[statusCode.value],
        variant: "destructive",
      });
    }

    toast({
      title: "Registro bem-sucedido!",
      description: registerData.value?.message,
    });
  } catch (error: any) {
    toast({
      title: "Erro ao registrar",
      description: error.message || "Ocorreu um erro inesperado.",
      variant: "destructive",
    });
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta de aluno</CardTitle>
        <CardDescription>
          Insira suas informações para criar uma conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit">
          <div class="grid gap-4">
            <FormField
              v-slot="{ componentField }"
              name="name"
              :validateOnBlur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome completo"
                    v-bind="componentField"
                    :disabled="isSubmitting"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="email"
              :validateOnBlur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    v-bind="componentField"
                    :disabled="isSubmitting"
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

            <Button type="submit" class="w-full" :disabled="isSubmitting">
              <Loader2 class="size-4 animate-spin" v-if="isSubmitting" />
              Criar conta
            </Button>
            <Button variant="outline" class="w-full" :disabled="isSubmitting">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Inscreva-se com o Google
            </Button>
          </div>
        </form>
        <div class="mt-4 text-center text-sm">
          Já tem uma conta?
          <RouterLink to="login" class="underline underline-offset-4"
            >Faça login</RouterLink
          >
        </div>
      </CardContent>
    </Card>

    <div
      class="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary"
    >
      Ao clicar em continuar, você concorda com nossos
      <a href="#">Termos de Serviço</a> e
      <a href="#">Política de Privacidade</a>.
    </div>
  </div>
</template>
