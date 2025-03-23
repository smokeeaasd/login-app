<script setup lang="ts">
import { Shield } from 'lucide-vue-next';

</script>

<template>
  <div
    class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <!-- Logo -->
      <a href="#" class="flex items-center gap-2 self-center font-medium">
        <div
          class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
        >
          <Shield class="size-4" />
        </div>
        Exemplo Refresh Token
      </a>

      <RouterView/>
    </div>
  </div>
</template>
