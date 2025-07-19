<script setup lang="ts">
const { deleteItems } = useItem()
const props = withDefaults(defineProps<{ ids: (string | number)[], count?: number, open: boolean }>(), { count: 0 })
const emit = defineEmits(['update:open'])

const open = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val)
})

async function onSubmit() {
  await deleteItems(props.ids)
  emit('update:open', false)
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${props.count || props.ids.length} item${(props.count || props.ids.length) > 1 ? 's' : ''}`"
    :description="`Are you sure? This action cannot be undone.`"
  >
    <slot />
    <template #body>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" class="cursor-pointer" color="neutral" variant="subtle" @click="open = false" />
        <UButton label="Delete" class="cursor-pointer" color="error" variant="solid" loading-auto @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>