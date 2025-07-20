<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
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

const toast = useToast()
const supabase = useSupabaseClient()
const { categories, updateItem, getCategories, subscribeCategories } = useItem()

onMounted(() => {
  getCategories()

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

const imageFile = ref<File | null>(null)

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  imageFile.value = target?.files?.[0] ?? null
}

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

const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'codexer')
  formData.append('cloud_name', 'dvlmnfw8r')

  const res = await fetch('https://api.cloudinary.com/v1_1/dvlmnfw8r/image/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  if (!data.secure_url) throw new Error('Cloudinary upload failed')
  return { url: data.secure_url, name: file.name }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!props.item) return

  let image_id = props.item.image_id ?? null

  if (imageFile.value) {
    try {
      const { url, name } = await uploadImage(imageFile.value)

      const { data: imageData, error: imageError } = await supabase
        .from('app_images')
        .insert([{ name, url }] as any)
        .select()
        .single<{ id: number }>()

      if (imageError) throw imageError
      image_id = imageData.id
    } catch (e) {
      console.error('Image upload failed:', e)
      toast.add({ title: 'Upload Failed', description: 'Image upload failed.' })
      return
    }
  }

  const result = await updateItem({
    id: props.item.id,
    sku: props.item.sku,
    title: event.data.title,
    description: event.data.description,
    price: event.data.price,
    quantity: event.data.quantity,
    image_id,
    category_id: event.data.category,
    is_preorder: event.data.is_preorder,
    is_draft: event.data.is_draft
  })

  if (result) {
    toast.add({ title: 'Success', description: `Item ${event.data.title} updated`, color: 'success' })
    modalOpen.value = false
    imageFile.value = null
  }
}
</script>

<template>
  <UModal v-model:open="modalOpen" title="Update item" description="Edit item information">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Title" placeholder="Item Name" name="title">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>
        <UFormField label="Description" placeholder="Item description" name="description">
          <UInput v-model="state.description" class="w-full" />
        </UFormField>
        <UFormField label="Price (in PHP)" placeholder="Item price" name="price">
          <UInput v-model="state.price" class="w-full" type="number" />
        </UFormField>
        <UFormField label="Quantity" placeholder="Item quantity" name="quantity">
          <UInput v-model="state.quantity" class="w-full" type="number" />
        </UFormField>
        <UFormField label="Category" name="category">
          <USelect v-model="state.category" placeholder="Item category" class="w-full" :items="categoriesList" />
        </UFormField>
        <UFormField label="Image" name="image">
          <UInput type="file" @change="handleImageChange" class="w-full" />
        </UFormField>
        <UFormField name="is_preorder">
          <UCheckbox v-model="state.is_preorder" label="Pre-order" />
        </UFormField>
        <UFormField name="is_draft">
          <UCheckbox v-model="state.is_draft" label="Draft" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton label="Cancel" color="neutral" variant="subtle" @click="modalOpen = false" />
          <UButton label="Update" color="primary" type="submit" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
