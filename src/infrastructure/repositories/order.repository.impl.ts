import type { IOrderRepository } from '@/core/ports/repositories/order.repository'
import type { Order } from '@/core/entities/order.entity'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/types'
import type { OrderStatus } from '@/shared/types/api.types'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'

export class OrderRepositoryImpl implements IOrderRepository {
  async findAll(params?: QueryParams): Promise<PaginatedResponse<Order>> {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
    const url = `${API_ENDPOINTS.orders.list}${queryString ? `?${queryString}` : ''}`
    return httpClient.get<PaginatedResponse<Order>>(url)
  }

  async findById(id: string): Promise<ApiResponse<Order>> {
    return httpClient.get<ApiResponse<Order>>(API_ENDPOINTS.orders.get(id))
  }

  async updateStatus(id: string, status: OrderStatus, trackingNumber?: string): Promise<ApiResponse<Order>> {
    const payload: any = { status }
    if (trackingNumber) payload.trackingNumber = trackingNumber
    return httpClient.put<ApiResponse<Order>>(API_ENDPOINTS.orders.updateStatus(id), payload)
  }

  async confirmPayment(id: string, paymentProof?: string): Promise<ApiResponse<Order>> {
    const payload = paymentProof ? { paymentProof } : {}
    return httpClient.put<ApiResponse<Order>>(API_ENDPOINTS.orders.confirmPayment(id), payload)
  }

  async cancel(id: string, reason: string): Promise<ApiResponse<Order>> {
    return httpClient.put<ApiResponse<Order>>(API_ENDPOINTS.orders.cancel(id), { reason })
  }

  async addNote(id: string, note: string): Promise<ApiResponse<Order>> {
    return httpClient.post<ApiResponse<Order>>(API_ENDPOINTS.orders.addNote(id), { note })
  }
}

