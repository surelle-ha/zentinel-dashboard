<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel, type Row } from '@tanstack/table-core'
import type { Item } from '~/types'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const supabase = useSupabaseClient()
const { items: data, status, error: itemsError, getItems, deleteItems, subscribeItems } = useItem();

onMounted(() => {
  getItems()

  const subscriptionItems = subscribeItems()

  onUnmounted(() => {
    supabase.removeChannel(subscriptionItems)
  })
})

const toast = useToast()
const table = useTemplateRef('table')

const columnFilters = ref([{
  id: 'title',
  value: ''
}])
const columnVisibility = ref()

function getRowItems(row: Row<Item>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy item ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({
          title: 'Copied to clipboard',
          description: 'Item ID copied to clipboard'
        })
      }
    },
    {
      label: 'Copy sku ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.sku.toString())
        toast.add({
          title: 'Copied to clipboard',
          description: 'Item ID copied to clipboard'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'View item details',
      icon: 'i-lucide-list',
      onSelect() {
        selectedItem.value = row.original
        showUpdateModal.value = true
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete item',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        deleteItems([row.original.id])
        toast.add({
          title: 'Item deleted',
          description: 'The item has been deleted.'
        })
      }
    }
  ]
}

const columns: TableColumn<Item>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Title',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original?.app_images?.url,
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.title),
          h('p', { class: '' }, `${row.original.shop_categories.name}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => row.original.sku ? h('span', { class: 'text-muted' }, `${row.original.sku.slice(0, 8)}`) : h('span', { class: 'text-muted' }, 'N/A')
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Price',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Quantity',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    accessorFn: row => row.shop_categories?.name,
    filterFn: 'equals',
    cell: ({ row }) => {
      const statusColorMap: Record<string, any> = {
        'Website Project': 'success',
        'Hardware Project': 'warning',
        'Tutorial': 'error',
      }
      const color = statusColorMap[(row.original.shop_categories?.name as string)]
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.original.shop_categories?.name
      )
    }
  },
  {
    accessorKey: 'is_preorder',
    header: 'Pre-Order',
    cell: ({ row }) => row.original.is_preorder ? h(UBadge, { variant: 'subtle', color: 'warning' }, 'Yes') : h(UBadge, { variant: 'subtle', color: 'success' }, 'No')
  },
  {
    accessorKey: 'is_draft',
    header: 'Draft',
    cell: ({ row }) => row.original.is_draft ? h(UBadge, { variant: 'subtle', color: 'warning' }, 'Yes') : h(UBadge, { variant: 'subtle', color: 'success' }, 'No')
  },
  {
    accessorKey: 'created_at',
    header: 'Added on',
    cell: ({ row }) => row.original.created_at ? h('span', { class: 'text-muted' }, new Date(row.original.created_at).toLocaleDateString()) : h('span', { class: 'text-muted' }, 'N/A')
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]

const statusFilter = ref('all')

watch(() => statusFilter.value, (newVal) => {
  if (!table?.value?.tableApi) return

  const statusColumn = table.value.tableApi.getColumn('category')
  if (!statusColumn) return
  console.log(statusColumn)

  if (newVal === 'all') {
    statusColumn.setFilterValue(undefined)
  } else {
    statusColumn.setFilterValue(newVal)
  }
})

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const showDeleteModal = ref(false)
const rowSelection = ref({})
watch(showDeleteModal, (val) => {
  if (!val) {
    rowSelection.value = {}
  }
})

const showUpdateModal = ref(false)
const selectedItem = ref<Item | null>(null)
</script>

<template>
  <UDashboardPanel id="items">
    <template #header>
      <UDashboardNavbar title="Items">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <ItemsAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput :model-value="(table?.tableApi?.getColumn('title')?.getFilterValue() as string)" class="max-w-sm"
          icon="i-lucide-search" placeholder="Filter title..."
          @update:model-value="table?.tableApi?.getColumn('title')?.setFilterValue($event)" />

        <div class="flex flex-wrap items-center gap-1.5">
          <ItemsUpdateModal v-if="showUpdateModal" :item="selectedItem" :open="showUpdateModal" @update:open="showUpdateModal = $event" />
          <ItemsDeleteModal :ids="table?.tableApi?.getFilteredSelectedRowModel()?.rows?.map(r => r.original.id) ?? []"
            :count="table?.tableApi?.getFilteredSelectedRowModel()?.rows?.length ?? 0" v-model:open="showDeleteModal" />
          <UButton v-if="table?.tableApi?.getFilteredSelectedRowModel()?.rows?.length" label="Delete" color="error"
            variant="subtle" icon="i-lucide-trash" class="cursor-pointer" @click="showDeleteModal = true">
            <template #trailing>
              <UKbd>
                {{ table?.tableApi?.getFilteredSelectedRowModel()?.rows?.length ?? 0 }}
              </UKbd>
            </template>
          </UButton>

          <USelect v-model="statusFilter" :items="[
            { label: 'All', value: 'all' },
            { label: 'Website Project', value: 'Website Project' },
            { label: 'Hardware Project', value: 'Hardware Project' },
            { label: 'Tutorial', value: 'Tutorial' }
          ]" :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Filter status" class="min-w-28" />
          <UDropdownMenu :items="table?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: upperFirst(column.id),
              type: 'checkbox' as const,
              checked: column.getIsVisible(),
              onUpdateChecked(checked: boolean) {
                table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              }
            }))
            " :content="{ align: 'end' }">
            <UButton label="Display" color="neutral" variant="outline" trailing-icon="i-lucide-settings-2" />
          </UDropdownMenu>
        </div>
      </div>

      <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection" v-model:pagination="pagination" :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }" class="shrink-0" :data="data" :columns="columns" :loading="status === 'loading'" :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default'
        }" />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
