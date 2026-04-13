export type Category = 'essential' | 'optional' | 'detail'

export type Contributor = {
  name: string
  lastname: string
  email: string
}

export type Gift = {
  id: string
  name: string
  description?: string
  image?: string
  type: 'single' | 'group'
  maxContributors?: number
  category: Category
  contributors: Contributor[]
}

export type GiftRow = {
  id: string
  name: string
  description: string | null
  image: string | null
  type: 'single' | 'group'
  max_contributors: number | null
  category: Category
  created_at: string
}

export type ContributorRow = {
  id: string
  gift_id: string
  name: string
  lastname: string
  email: string
  created_at: string
}

export function getInitials(name: string, lastname: string): string {
  return `${name.charAt(0).toUpperCase()}.${lastname.charAt(0).toUpperCase()}.`
}

export function rowToGift(giftRow: GiftRow, contributorRows: ContributorRow[]): Gift {
  return {
    id: giftRow.id,
    name: giftRow.name,
    description: giftRow.description || undefined,
    image: giftRow.image || undefined,
    type: giftRow.type,
    maxContributors: giftRow.max_contributors ?? 1,
    category: giftRow.category,
    contributors: contributorRows.map(c => ({
      name: c.name,
      lastname: c.lastname,
      email: c.email
    }))
  }
}

export const categoryConfig = {
  essential: {
    label: 'Esenciales',
    icon: '⭐',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Los más importantes para Alisha'
  },
  optional: {
    label: 'Opcionales',
    icon: '🎁',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Complementos útiles'
  },
  detail: {
    label: 'Detallitos',
    icon: '💝',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Detalles pequeños y emotivos'
  }
}
