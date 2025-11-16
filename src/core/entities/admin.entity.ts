import type { Admin } from '@/shared/types/entity.types'

export type { Admin }

export class AdminEntity implements Admin {
  _id: string
  name: string
  email: string
  role: 'admin' | 'superadmin'
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string

  constructor(data: Admin) {
    this._id = data._id
    this.name = data.name
    this.email = data.email
    this.role = data.role
    this.avatar = data.avatar
    this.isActive = data.isActive
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  isSuperAdmin(): boolean {
    return this.role === 'superadmin'
  }
}

