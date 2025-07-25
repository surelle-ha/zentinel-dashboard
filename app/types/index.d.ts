import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface Item {
  id: number
  sku: string
  title: string
  description: string
  price: number
  quantity: number
  image: any
  app_images: Record<string, unknown>
  category: any
  shop_categories: Record<string, unknown>
  is_preorder: boolean
  is_draft: boolean
  updated_at: string
  created_at: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  id: number
  first_name: string
  last_name: string
  email: string
  location: string
  roles: {
    name: string
  }
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}
