export function useAppSettings() {
    const supabase = useSupabaseClient()
    const settings = ref<any[]>([])

    const getSettings = async () => {
        const { data } = await supabase
            .from('app_settings')
            .select('*')
        settings.value = data ?? []
    }

    const updateSettings = async (name: string, value: string) => {
        const { error } = await supabase
            .from('app_settings')
            .update({ value } as never)
            .eq('name', name)
        if (error) {
            console.error('Error updating setting:', error)
        } else {
            await getSettings()
        }
    }

    const subscribeSettings = () => {
        return supabase
            .channel('app_settings_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'app_settings' },
                () => getSettings()
            )
            .subscribe()
    }

    return {
        settings,
        getSettings,
        updateSettings,
        subscribeSettings,
    }
}