<script setup lang="ts">
const supabase = useSupabaseClient()
const q = ref('')

const { users, getUsers, subscribeUsers } = useUser()
const { roles, getRoles, subscribeRoles } = useRole()

onMounted(() => {
  getUsers()
  getRoles()

  const subscriptionUsers = subscribeUsers()
  const subscriptionRoles = subscribeRoles()

  onUnmounted(() => {
    supabase.removeChannel(subscriptionUsers)
    supabase.removeChannel(subscriptionRoles)
  })
})

const filteredUsers = computed(() => {
  return users.value.filter((user: any) => {
    const nameMatch = typeof user.name === 'string' && user.name.search(new RegExp(q.value, 'i')) !== -1
    const emailMatch = typeof user.email === 'string' && user.email.search(new RegExp(q.value, 'i')) !== -1
    return nameMatch || emailMatch
  })
})
</script>

<template>
  <div>
    <UPageCard
      title="Members"
      description="Invite new members by email address."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Invite people"
        color="neutral"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle" :ui="{ container: 'p-0 sm:p-0 gap-y-0', wrapper: 'items-stretch', header: 'p-4 mb-0 border-b border-default' }">
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Search members"
          autofocus
          class="w-full"
        />
      </template>

      <DeveloperUsersList :members="filteredUsers" :roles="roles"/>
    </UPageCard>
  </div>
</template>
