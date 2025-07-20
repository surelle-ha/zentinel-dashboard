<script setup lang="ts">

defineProps<{
  collapsed?: boolean
}>()

</script>

<template>
  <UButton v-bind="{
    label: collapsed ? undefined : 'Codexer Space',
    avatar: {
      src: 'https://cdn-icons-gif.flaticon.com/6454/6454035.gif',
      alt: 'Codexer Space'
    },
  }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-elevated"
    :class="[!collapsed && 'py-2']" />
</template>
