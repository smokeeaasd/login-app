<script setup lang="ts">
import { Avatar } from "@/components/ui/avatar";
import AvatarFallback from "@/components/ui/avatar/AvatarFallback.vue";
import AvatarImage from "@/components/ui/avatar/AvatarImage.vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth";
import { LogOutIcon } from "lucide-vue-next";
import { computed } from "vue";

const authStore = useAuthStore();

const { execute: me, data: user, isFinished } = authStore.me();

const userInitials = computed(() => {
  return user.value?.name
    ? user.value.name
        .split(" ")
        .splice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : null;
});

const userRole = computed(() => {
  return user.value?.role
    ? user.value.role === 2
      ? "Professor"
      : "Estudante"
    : "Estudante";
});

me();

const { execute: logout } = authStore.logout(authStore.refreshToken!);

async function handleLogout() {
  await logout();
}
</script>

<template>
  <div
    class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <div v-if="isFinished && user">
        <Card>
          <CardHeader class="flex flex-row justify-between">
            <div class="space-y-2">
              <CardTitle>Você está logado</CardTitle>
              <CardDescription
                >Confira suas informações abaixo.</CardDescription
              >
            </div>
            <Avatar class="bg-primary">
              <AvatarImage src="#" alt="you" />
              <AvatarFallback class="font-bold">{{
                userInitials
              }}</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <div class="mb-4 flex flex-col gap-y-4 last:mb-0">
              <div class="space-y-1">
                <p class="text-sm font-medium leading-none">Nome completo</p>
                <p class="text-sm text-muted-foreground">
                  {{ user.name }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium leading-none">Email</p>
                <p class="text-sm text-muted-foreground">
                  {{ user.email }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium leading-none">
                  Data de nascimento
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ user.birth_date ?? "Não definida" }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium leading-none">Tipo de usuário</p>
                <p class="text-sm text-muted-foreground">
                  {{ userRole }}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button class="w-full" variant="destructive" @click="handleLogout">
              <LogOutIcon/> Sair
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div class="flex items-center space-x-4" v-else>
        <Skeleton class="size-12 rounded-full" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-72" />
          <Skeleton class="h-4 w-32" />
        </div>
      </div>
    </div>
  </div>
</template>
