import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { API_CONFIG } from '@/infrastructure/config/api.config'
import { AUTH_TOKEN_KEY } from '@/infrastructure/config/constants'
import { handleApiError } from './error-handler'

class HttpClient {
  private readonly client: AxiosInstance

  constructor() {
    this.client = axios.create(API_CONFIG)
    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get(AUTH_TOKEN_KEY)

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response.data,
      handleApiError
    )
  }

  async get<T>(url: string, config?: object): Promise<T> {
    return this.client.get<never, T>(url, config)
  }

  async post<T>(url: string, data?: object, config?: object): Promise<T> {
    return this.client.post<never, T>(url, data, config)
  }

  async put<T>(url: string, data?: object, config?: object): Promise<T> {
    return this.client.put<never, T>(url, data, config)
  }

  async delete<T>(url: string, config?: object): Promise<T> {
    return this.client.delete<never, T>(url, config)
  }

  async patch<T>(url: string, data?: object, config?: object): Promise<T> {
    return this.client.patch<never, T>(url, data, config)
  }
}

export const httpClient = new HttpClient()

