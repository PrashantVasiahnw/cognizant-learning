import axios, { AxiosError } from 'axios'
import { env } from '../utils/env'

export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  config.headers.set('X-Requested-With', 'XMLHttpRequest')
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'The request could not be completed.'

    return Promise.reject(new Error(message))
  },
)