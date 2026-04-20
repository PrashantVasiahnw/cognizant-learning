import { axiosInstance } from '../api/axiosInstance'
import type {
  DashboardPageParams,
  DashboardRecordDetail,
  DashboardRecordsPage,
} from '../types/dashboard'
import { env } from '../utils/env'
import {
  fetchMockDashboardRecordDetail,
  fetchMockDashboardRecords,
} from './mockDashboardService'

export const fetchDashboardRecords = async (
  params: DashboardPageParams,
): Promise<DashboardRecordsPage> => {
  if (env.useMockApi) {
    return fetchMockDashboardRecords(params)
  }

  const response = await axiosInstance.get<DashboardRecordsPage>('/records', {
    params,
  })

  return response.data
}

export const fetchDashboardRecordDetail = async (
  recordId: string,
): Promise<DashboardRecordDetail> => {
  if (env.useMockApi) {
    return fetchMockDashboardRecordDetail(recordId)
  }

  const response = await axiosInstance.get<DashboardRecordDetail>(`/records/${recordId}`)

  return response.data
}