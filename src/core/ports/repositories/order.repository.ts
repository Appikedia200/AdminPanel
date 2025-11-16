import type { Order } from '@/core/entities/order.entity'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/types'
import type { OrderStatus } from '@/shared/types/api.types'

export interface IOrderRepository {
  findAll(params?: QueryParams): Promise<PaginatedResponse<Order>>
  findById(id: string): Promise<ApiResponse<Order>>
  updateStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>>
  confirmPayment(id: string): Promise<ApiResponse<Order>>
  cancel(id: string, reason: string): Promise<ApiResponse<Order>>
}

