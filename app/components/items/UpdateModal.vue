<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { v4 as uuidv4 } from 'uuid'
import { ref, watch, reactive } from 'vue'

const props = defineProps<{
  item: any | null
  open: boolean
}>()
const emit = defineEmits(['close', 'update:open'])

const modalOpen = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val)
})

const supabase = useSupabaseClient()
const { categories, updateItem, getCategories, subscribeCategories } = useItem()

onMounted(() => {
  getCategories();

  const subscriptionCategories = subscribeCategories()

  onUnmounted(() => {
    supabase.removeChannel(subscriptionCategories)
  })
})

const categoriesList = computed(() => {
  return categories.value.map(category => ({
    label: category.name,
    value: category.id
  }))
})

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  quantity: z.number().min(0, 'Quantity must be a positive number'),
  image: z.string().optional(),
  category: z.number().min(1, 'Category is required'),
  is_preorder: z.boolean().default(false),
  is_draft: z.boolean().default(false)
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  price: undefined,
  quantity: undefined,
  image: undefined,
  category: undefined,
  is_preorder: false,
  is_draft: false
})

watch(
  () => props.item,
  (item) => {
    if (item) {
      Object.assign(state, {
        title: item.title,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category_id,
        is_preorder: item.is_preorder,
        is_draft: item.is_draft
      })
    }
  },
  { immediate: true }
)

const toast = useToast()
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!props.item) return

  const result = await updateItem({
    id: props.item.id,
    sku: props.item.sku,
    title: event.data.title,
    description: event.data.description,
    price: event.data.price,
    quantity: event.data.quantity,
    image: event.data.image,
    category_id: event.data.category,
    is_preorder: event.data.is_preorder,
    is_draft: event.data.is_draft
  })

  if (result) {
    toast.add({ title: 'Success', description: `Item ${event.data.title} updated`, color: 'success' })
    modalOpen.value = false
  }
}
</script>

<template>
  <UModal v-model:open="modalOpen" title="New item" description="Add a new item to the database">
    <UButton label="New item" class="cursor-pointer" icon="i-lucide-plus" />

    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Title" placeholder="Item Name" name="title">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>
        <UFormField label="Description" placeholder="Item description" name="description">
          <UInput v-model="state.description" class="w-full" />
        </UFormField>
        <UFormField label="Price (in Philippine Peso)" placeholder="Item price" name="price">
          <UInput v-model="state.price" class="w-full" type="number" />
        </UFormField>
        <UFormField label="Quantity" placeholder="Item quantity" name="quantity">
          <UInput v-model="state.quantity" class="w-full" type="number" />
        </UFormField>
        <UFormField label="Category" placeholder="Item category" name="category">
          <USelect label="Category" v-model="state.category" placeholder="Item category" class="w-full"
            :items="categoriesList" />
        </UFormField>
        
        <UFormField name="is_preorder">
          <UCheckbox v-model="state.is_preorder" label="Pre-order" />
        </UFormField>
        <UFormField name="is_draft">
          <UCheckbox v-model="state.is_draft" label="Draft" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton label="Cancel" color="neutral" class="cursor-pointer" variant="subtle" @click="modalOpen = false" />
          <UButton label="Create" color="primary" class="cursor-pointer" variant="solid" type="submit" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
