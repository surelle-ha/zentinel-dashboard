<script setup lang="ts">
import type { Database } from '#build/types/supabase-database'
import type { DropdownMenuItem } from '@nuxt/ui'

const supabase = useSupabaseClient<Database>()
const { isNotificationsSlideoverOpen } = useDashboard()
const { items, getItems, subscribeItems } = useItem()

const sections = ref<{ title: string, description: string, items: any[] }[]>([])

onMounted(async () => {
  await getItems()

  groupItemsByCategory()

  const subscriptionItems = subscribeItems()

  onUnmounted(() => {
    supabase.removeChannel(subscriptionItems)
  })
})

watch(items, () => {
  groupItemsByCategory()
})

function groupItemsByCategory() {
  const categoryMap = new Map<number, { title: string, description: string, items: any[] }>()

  for (const item of items.value) {
    if (item.is_draft) continue

    const catId = item.shop_categories?.id
    if (!catId) continue

    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, {
        title: item.shop_categories.name,
        description: `Browse all items under ${item.shop_categories.name}.`,
        items: []
      })
    }

    categoryMap.get(catId)!.items.push({
      title: item.title,
      description: item.description,
      image: item.app_images?.url ?? 'https://placehold.co/300x160',
      date: new Date(item.updated_at).toISOString().split('T')[0]
    })
  }

  sections.value = Array.from(categoryMap.values())
}

const buttonItems = [[
  {
    label: 'New mail',
    icon: 'i-lucide-send',
    to: '/inbox'
  },
  {
    label: 'New customer',
    icon: 'i-lucide-user-plus',
    to: '/customers'
  }
]] satisfies DropdownMenuItem[][]
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Store" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton color="neutral" variant="ghost" square @click="isNotificationsSlideoverOpen = true">
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="buttonItems">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 sm:gap-8 lg:gap-14 w-full lg:max-w-6xl mx-auto">
        <UPageCard
          title="Codexer Store"
          description="Explore our collection of tools and resources designed to enhance your development experience."
          icon="i-simple-icons-homeassistantcommunitystore"
          orientation="horizontal"
          spotlight
          spotlight-color="primary"
        />

        <div v-for="(section, index) in sections" :key="index">
          <UPageCard :title="section.title" :description="section.description" variant="naked" class="mb-4" />
          <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }" 
          spotlight
          spotlight-color="primary">
            <UBlogPosts :posts="section.items" />
          </UPageCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
