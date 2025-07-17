<script setup lang="ts">
const supabase = useSupabaseClient()
const toast = useToast()
const { settings, getSettings, updateSettings, subscribeSettings } = useAppSettings()

onMounted(() => {
  getSettings()
  const subscriptionSettings = subscribeSettings()
  onUnmounted(() => {
    supabase.removeChannel(subscriptionSettings)
  })
})

watch(settings, (newSettings) => {
  state.maintenance = newSettings.find(setting => setting.name === 'maintenance')?.value === 'true'
  state.allow_login = newSettings.find(setting => setting.name === 'allow_login')?.value === 'true'
  state.allow_register = newSettings.find(setting => setting.name === 'allow_register')?.value === 'true'
})

const state = reactive<{ [key: string]: boolean }>({
  maintenance: false,
  allow_login: false,
  allow_register: false,
})

const sections = [{
  title: 'Zentinel General Settings',
  description: 'Developer page to setup general settings for Zentinel.',
  fields: [{
    name: 'maintenance',
    label: 'Maintenance Mode',
    description: 'Enable or disable maintenance mode for the application.'
  }]
}, {
  title: 'Users Options',
  description: 'User level options for Zentinel.',
  fields: [{
    name: 'allow_login',
    label: 'Allow Login',
    description: 'Allow users to log in to the application.'
  }, {
    name: 'allow_register',
    label: 'Allow Registration',
    description: 'Allow users to register to the application.'
  }]
}]

async function onChange(value: boolean, name: string) {
  console.log(`Updating setting: ${name} to ${value}`)
  await updateSettings(name, value ? 'true' : 'false')
  toast.add({
    title: 'App Settings Changed',
    description: `Setting "${name}" updated successfully.`,
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
}
</script>

<template>
  <div v-for="(section, index) in sections" :key="index">
    <UPageCard :title="section.title" :description="section.description" variant="naked" class="mb-4" />

    <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
      <UFormField v-for="field in section.fields" :key="field.name" :name="field.name" :label="field.label"
        :description="field.description" class="flex items-center justify-between not-last:pb-4 gap-2">
        <USwitch v-model="state[field.name]" @update:model-value="(val) => onChange(val, field.name)" />
      </UFormField>
    </UPageCard>
  </div>
</template>
