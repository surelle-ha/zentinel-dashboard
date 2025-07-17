<template>
  <div class="flex items-center justify-center min-h-screen w-full">
    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <slot />
      <!-- <div class="text-center text-gray-500">
        <NuxtLink to="/auth/register" class="underline hover:text-primary transition-colors">Create your account here</NuxtLink>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
</script>

<style></style>