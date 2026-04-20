import type { Meta, StoryObj } from '@storybook/react-vite'
import { DynamicChart } from './DynamicChart'
import { buildMockRecordDetail } from '../../services/mockDashboardService'

const meta = {
  title: 'Components/Chart/DynamicChart',
  component: DynamicChart,
  args: {
    chart: buildMockRecordDetail('record-4').chart,
  },
} satisfies Meta<typeof DynamicChart>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PieVariant: Story = {
  args: {
    chart: buildMockRecordDetail('record-8').chart,
  },
}