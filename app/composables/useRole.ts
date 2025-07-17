export function useRole() {
  const supabase = useSupabaseClient()
  const roles = ref<any[]>([])

  const getRoles = async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
    roles.value = data ?? []
  }

  const subscribeRoles = () => {
    return supabase
      .channel('roles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'roles' },
        () => getRoles()
      )
      .subscribe()
  }

  return {
    roles,
    getRoles,
    subscribeRoles
  }
}