import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

export function useUser() {
    const supabase = useSupabaseClient()
    const users = ref<any[]>([])

    const getUsers = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*, roles(*)')
        users.value = data ?? []
    }

    const updateRole = async (userId: number, roleId: number) => {
        const { error } = await supabase
            .from('users')
            .update({ role_id: roleId } as never)
            .eq('id', userId)
        if (error) {
            console.error('Error updating role:', error)
        } else {
            await getUsers()
        }
    }

    const subscribeUsers = () => {
        return supabase
            .channel('users-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'users' },
                () => getUsers()
            )
            .subscribe()
    }

    return {
        users,
        getUsers,
        updateRole,
        subscribeUsers,
    }
}