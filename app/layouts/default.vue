<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()
const open = ref(false)
const userStore = useUserStore() // <-- Make sure you have this

const isAuthenticated = computed(() => userStore.isAuthenticated)

const links = computed<NavigationMenuItem[][]>(() => {
  if (!isAuthenticated.value) {
    // Only show Store if not authenticated
    return [[
      {
        label: 'Store',
        icon: 'i-lucide-store',
        to: '/',
        onSelect: () => { open.value = false }
      },
      {
        label: 'FAQ',
        icon: 'i-lucide-help-circle',
        to: '/faq',
        onSelect: () => { open.value = false }
      }
    ]]
  }
  // Show all links if authenticated
  return [[
    {
      label: 'Announcements',
      icon: 'i-lucide-megaphone',
      to: '/announcements',
      badge: '12',
      onSelect: () => { open.value = false }
    },
    {
      label: 'Store',
      icon: 'i-lucide-store',
      to: '/',
      onSelect: () => { open.value = false }
    },
    {
      label: 'FAQ',
      icon: 'i-lucide-help-circle',
      to: '/faq',
      onSelect: () => { open.value = false }
    },
    {
      label: 'Zentinel Faucet',
      icon: 'i-lucide-zap',
      to: '/faucet',
      onSelect: () => { open.value = false }
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: 'i-lucide-settings',
      defaultOpen: false,
      type: 'trigger' as const,
      children: [
        { label: 'General', to: '/settings', exact: true, onSelect: () => { open.value = false } },
        { label: 'Notifications', to: '/settings/notifications', onSelect: () => { open.value = false } },
        { label: 'Security', to: '/settings/security', onSelect: () => { open.value = false } },
      ]
    },
    {
      label: 'Dashboard',
      icon: 'i-lucide-grid',
      to: '/dashboard',
      onSelect: () => { open.value = false }
    },
    {
      label: 'Inbox',
      icon: 'i-lucide-inbox',
      to: '/inbox',
      badge: '4',
      onSelect: () => { open.value = false }
    },
    {
      label: 'Items',
      icon: 'i-lucide-shopping-cart',
      to: '/items',
      onSelect: () => { open.value = false }
    },
    {
      label: 'Developer Tools',
      to: '/dev-tools',
      icon: 'i-lucide-square-chevron-right',
      defaultOpen: false,
      type: 'trigger' as const,
      children: [
        { label: 'Hyper Timer', to: '/dev-tools/hyper-timer', onSelect: () => { open.value = false } },
        { label: 'Mock API', to: '/dev-tools/mock-api', onSelect: () => { open.value = false } },
        { label: 'ENV Digger', to: '/dev-tools/env-digger', onSelect: () => { open.value = false } },
      ]
    },
    {
      label: 'Developer Settings',
      to: '/dev-settings',
      icon: 'i-lucide-code',
      defaultOpen: false,
      type: 'trigger' as const,
      children: [
        { label: 'General', to: '/dev-settings', exact: true, onSelect: () => { open.value = false } },
        { label: 'Users', to: '/dev-settings/users', onSelect: () => { open.value = false } },
      ]
    },
  ]]
})

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.value.flat()
}, {
  id: 'code',
  label: 'Code',
  items: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-pro/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
    target: '_blank'
  }]
}])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
    duration: 0,
    close: false,
    actions: [{
      label: 'Accept',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Opt out',
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})
</script>

<template>
  <UDashboardGroup unit="rem">

    <UDashboardSidebar id="default" v-model:open="open" collapsible resizable class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }">
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />

      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />

        <UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" tooltip class="mt-auto" />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
