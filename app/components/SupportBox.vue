<template>
  <UModal v-model:open="internalOpen" title="Help & Support" description="Get help and support for your concerns."
    :dismissible="true" class="max-w-3xl">
    <template #body>
      <UForm id="settings" :schema="ticketSchema" :state="profile" @submit="onSubmit">

        <UPageCard variant="subtle">
          <UFormField name="first_name" label="First Name" description="Will appear as your first name on the platform."
            required class="flex max-sm:flex-col justify-between items-start gap-4">
            <UInput v-model="profile.first_name" autocomplete="off" />
          </UFormField>
          <USeparator />
          <UFormField name="last_name" label="Last Name" description="Will appear as your last name on the platform."
            required class="flex max-sm:flex-col justify-between items-start gap-4">
            <UInput v-model="profile.last_name" autocomplete="off" />
          </UFormField>
          <USeparator />
          <UFormField name="email" label="Email" description="Used to sign in to Zentinel." required
            class="flex max-sm:flex-col justify-between items-start gap-4">
            <UInput v-model="profile.email" type="email" autocomplete="off" />
          </UFormField>
          <USeparator />
          <UFormField name="phone" label="Phone" description="Used to sign in to Zentinel." required
            class="flex max-sm:flex-col justify-between items-start gap-4">
            <UInput v-model="profile.phone" v-maska="'### ### ####'" type="tel" autocomplete="tel"
              placeholder="123 456 7890" />
          </UFormField>
          <USeparator />
          <UFormField name="gender" label="Gender" description="Used to sign in to Zentinel." required
            class="flex max-sm:flex-col justify-between items-start gap-4">
            <USelectMenu v-model="profile.gender" :items="['male', 'female']" class="w-48" />
          </UFormField>
          <USeparator />
          <UFormField name="birthday" label="Birthday" description="Used to sign in to Zentinel." required
            class="flex max-sm:flex-col justify-between items-start gap-4">
            <UInput v-model="profile.birth_date" type="date" class="w-48" />
          </UFormField>
          <USeparator />
          <UFormField name="country" label="Country" description="Your country of residence." required
            class="flex max-sm:flex-col justify-between items-start gap-4">
            <USelectMenu v-model="profile.country" :items="countries" class="w-48" />
          </UFormField>
        </UPageCard>
        <UPageCard title="Client Support" description="Kindly note that a response may take up to 48 hours." variant="naked"
          orientation="horizontal" class="mb-4 mt-6">
          <UButton form="settings" label="Create Ticket" color="neutral" type="submit"
            class="w-fit lg:ms-auto cursor-pointer" />
        </UPageCard>
      </UForm>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])
const toast = useToast()
const { countries, getCountriesByName } = useExternal()
const userStore = useUserStore()

const internalOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})




//***************************** */

onMounted(() => {
  getCountriesByName()
})

const ticketSchema = z.object({
  first_name: z.string().min(2, 'Too short'),
  last_name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Too short').optional(),
  gender: z.string().min(2, 'Too short'),
  birth_date: z.string().refine(date => new Date(date) <= new Date(), {
    message: 'Birth date cannot be in the future'
  }),
  country: z.string().min(2, 'Too short')
})

type TicketSchema = z.output<typeof ticketSchema>

const profile = reactive<Partial<TicketSchema>>({
  first_name: userStore.user?.first_name || '',
  last_name: userStore.user?.last_name || '',
  email: userStore.user?.email || '',
  phone: userStore.user?.phone || '',
  gender: userStore.user?.gender || '',
  birth_date: userStore.user?.birth_date
    ? new Date(userStore.user.birth_date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10),
  country: userStore.user?.country || ''
})

async function onSubmit(event: FormSubmitEvent<TicketSchema>) {
  toast.add({
    title: 'Success',
    description: 'Your support ticket has been sent.',
    icon: 'i-lucide-check',
    color: 'success'
  })
}
</script>
