<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
const userStore = useUserStore()

const supabase = useSupabaseClient()
const toast = useToast()

const fields = [{
  name: 'email',
  type: 'text' as const,
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password'
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox' as const
}]

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const errorMessage = ref('')

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  errorMessage.value = ''
  const result = await supabase.auth.signInWithPassword({
    email: payload.data.email,
    password: payload.data.password
  })
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', payload.data.email)
    .single();

  console.log(data);
  if (result.error) {
    errorMessage.value = result.error.message || 'Login failed.'
    return
  }
  userStore.setUser({
    ...result.data.session,
    user: data
  })
  return navigateTo('/')
}
</script>

<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm :schema="schema" title="Login" description="Enter your credentials to access your account."
      icon="i-lucide-user" :fields="fields" @submit="onSubmit" />
    <Transition name="fade-ease-up">
      <div v-if="errorMessage" class="text-red-500 mt-2 text-sm text-center">
        {{ errorMessage }}
      </div>
    </Transition>
  </UPageCard>
</template>

<style scoped>
.fade-ease-up-enter-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-ease-up-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-ease-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-ease-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-ease-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-ease-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
