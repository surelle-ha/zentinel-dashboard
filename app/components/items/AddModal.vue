<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { v4 as uuidv4 } from 'uuid'

const toast = useToast()
const supabase = useSupabaseClient()
const { categories, addItem, getCategories, subscribeCategories } = useItem()

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
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  price: undefined,
  quantity: undefined,
  image: undefined, // holds Cloudinary URL
  category: undefined,
  is_preorder: false,
  is_draft: false
})

const imageFile = ref<File | null>(null)

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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  let image_id = null

  if (imageFile.value) {
    try {
      const { url, name } = await uploadImage(imageFile.value)

      // Save image record to Supabase
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

  const result = await addItem({
    sku: uuidv4(),
    title: event.data.title,
    description: event.data.description,
    price: event.data.price,
    quantity: event.data.quantity,
    image_id, // link to uploaded image
    category_id: event.data.category,
    is_preorder: event.data.is_preorder,
    is_draft: event.data.is_draft
  })

  if (result) {
    toast.add({ title: 'Success', description: `New item ${event.data.title} added`, color: 'success' })
    open.value = false
    Object.assign(state, {
      title: undefined,
      description: undefined,
      price: undefined,
      quantity: undefined,
      image: undefined,
      category: undefined,
      is_preorder: false,
      is_draft: false
    })
    imageFile.value = null
  }
}

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target?.files && target.files.length > 0) {
    imageFile.value = target.files?.[0] ?? null
  } else {
    imageFile.value = null
  }
}
</script>

<template>
  <UModal v-model:open="open" title="New item" description="Add a new item to the database">
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
        <UFormField label="Image" name="image">
          <UInput type="file" @change="handleImageChange" class="w-full"/>
        </UFormField>
        <UFormField name="is_preorder">
          <UCheckbox v-model="state.is_preorder" label="Pre-order" />
        </UFormField>
        <UFormField name="is_draft">
          <UCheckbox v-model="state.is_draft" label="Draft" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton label="Cancel" color="neutral" class="cursor-pointer" variant="subtle" @click="open = false" />
          <UButton label="Create" color="primary" class="cursor-pointer" variant="solid" type="submit" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
