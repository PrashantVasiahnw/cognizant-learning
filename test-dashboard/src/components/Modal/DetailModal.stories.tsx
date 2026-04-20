import type { Meta, StoryObj } from '@storybook/react-vite'
import { DetailModal } from './DetailModal'
import {
  buildMockRecordDetail,
  mockDashboardRecords,
} from '../../services/mockDashboardService'

const meta = {
  title: 'Components/Modal/DetailModal',
  component: DetailModal,
  args: {
    show: true,
    summary: mockDashboardRecords[0],
    detail: buildMockRecordDetail('record-1'),
    isLoading: false,
    error: null,
    onClose: () => undefined,
  },
} satisfies Meta<typeof DetailModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    detail: undefined,
    isLoading: true,
  },
}