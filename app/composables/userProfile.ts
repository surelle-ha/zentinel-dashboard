import { useSupabaseClient } from '#imports'

export function useProfile() {
    const supabase = useSupabaseClient()
    const userStore = useUserStore()
    const { getUsers } = useUser()

    const updateProfile = async (newUser: any) => {
        const { error } = await supabase
            .from('users')
            .update({
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone: newUser.phone,
                gender: newUser.gender,
                birth_date: newUser.birth_date,
                country: newUser.country
            } as never)
            .eq('id', userStore.user?.id)
        userStore.setUser({
            user: {
                ...userStore.user,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone: newUser.phone,
                gender: newUser.gender,
                birth_date: newUser.birth_date,
                country: newUser.country
            }
        })
        if (error) {
            console.error('Error updating role:', error)
        } else {
            await getUsers()
        }
    }

    return {
        updateProfile
    }
}