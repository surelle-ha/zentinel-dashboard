import { ref } from 'vue'

export function useItem() {
  const supabase = useSupabaseClient()
  const items = ref<any[]>([])
  const categories = ref<any[]>([])
  const error = ref<string | null>(null)
  const status = ref<'loading' | 'success' | 'error'>('loading')

  const getItems = async () => {
    status.value = 'loading'
    const { data, error: fetchError } = await supabase
      .from('shop_items')
      .select('*, shop_categories(*), app_images(*)')
    if (fetchError) {
      error.value = fetchError.message
      status.value = 'error'
    } else {
      items.value = data ?? []
      error.value = null
      status.value = 'success'
    }
  }


  const addItem = async (item: any) => {
    const { data, error: insertError } = await supabase
      .from('shop_items')
      .insert(item)
    if (insertError) {
      error.value = insertError.message
      return false
    } else {
      if (data && data[0]) {
        items.value.push(data[0])
      }
      error.value = null
      return true
    }
  }

  const updateItem = async (item: any) => {
    const { data, error: updateError } = await supabase
      .from('shop_items')
      .update(item as never)
      .eq('id', item.id)
    if (updateError) {
      error.value = updateError.message
      return false
    } else {
      if (data && data[0]) {
        const index = items.value.findIndex(i => i.id === item.id)
        if (index !== -1) {
          const currentItem = typeof items.value[index] === 'object' && items.value[index] !== null ? items.value[index] : {};
          const updatedData = typeof data[0] === 'object' && data[0] !== null ? data[0] : {};
          items.value[index] = { ...currentItem, ...updatedData }
        }
      }
      error.value = null
      return true
    }
  }

  const deleteItems = async (ids: (string | number)[]) => {
    if (!ids.length) return false
    const { error: deleteError } = await supabase
      .from('shop_items')
      .delete()
      .in('id', ids)
    if (deleteError) {
      error.value = deleteError.message
      return false
    } else {
      items.value = items.value.filter(item => !ids.includes(item.id))
      error.value = null
      return true
    }
  }

  const getCategories = () => {
    return supabase
      .from('shop_categories')
      .select('*')
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          error.value = fetchError.message
        } else {
          categories.value = data ?? []
        }
      })
  }

  const subscribeItems = () => {
    return supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shop_items' },
        () => getItems()
      )
      .subscribe()
  }

  const subscribeCategories = () => {
    return supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shop_categories' },
        () => getCategories()
      )
      .subscribe()
  }

  return {
    items,
    getItems,
    addItem,
    updateItem,
    deleteItems,
    subscribeItems,
    categories,
    getCategories,
    subscribeCategories,
    status,
    error,
  }
}