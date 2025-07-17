<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Member } from '~/types'

const props = defineProps<{
  members: Member[],
  roles: any[]
}>()

const { updateRole } = useUser()

const getDefaultAvatar = (name: string) => {
  const encodedName = encodeURIComponent(name)
  return `https://ui-avatars.com/api/?name=${encodedName}`
}

const roleNames = computed(() =>
  Array.isArray(props.roles)
    ? props.roles.map((role: { name: string }) => role.name)
    : []
)

const items = [{
  label: 'Edit member',
  onSelect: () => console.log('Edit member')
}, {
  label: 'Remove member',
  color: 'error' as const,
  onSelect: () => console.log('Remove member')
}] satisfies DropdownMenuItem[]
</script>

<template>
  <ul role="list" class="divide-y divide-default">
    <li v-for="(member, index) in members" :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar :src="getDefaultAvatar(member.first_name + ' ' + member.last_name)" size="md" />

        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate">
            {{ member.first_name }} {{ member.last_name }}
          </p>
          <p class="text-muted truncate">
            {{ member.email }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect :model-value="member.roles.name" :items="roleNames" color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }" @update:model-value="(selectedRoleName) => {
            const selectedRole = props.roles.find(role => role.name === selectedRoleName)
            if (selectedRole) {
              console.log('Change role to:', selectedRole.id, member)
              updateRole(member.id, selectedRole.id)
            }
          }" />

        <UDropdownMenu :items="items" :content="{ align: 'end' }">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>
