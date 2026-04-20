import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTable, type ColumnDefinition } from './DataTable'
import { mockDashboardRecords } from '../../services/mockDashboardService'
import type { DashboardRecordSummary } from '../../types/dashboard'
import { formatDate, formatPercent } from '../../utils/formatters'

const columns: ColumnDefinition<DashboardRecordSummary>[] = [
  {
    id: 'name',
    header: 'Segment',
    render: (row) => <span className="fw-semibold">{row.name}</span>,
  },
  {
    id: 'owner',
    header: 'Owner',
    render: (row) => row.owner,
  },
  {
    id: 'region',
    header: 'Region',
    render: (row) => row.region,
  },
  {
    id: 'createdAt',
    header: 'Created',
    render: (row) => formatDate(row.createdAt),
  },
  {
    id: 'trend',
    header: 'Trend',
    render: (row) => formatPercent(row.trend),
  },
]

const meta = {
  title: 'Components/Table/DataTable',
  component: DataTable<DashboardRecordSummary>,
  args: {
    caption: 'Mock dashboard records',
    columns,
    rows: mockDashboardRecords.slice(0, 8),
    isLoading: false,
    isFetchingMore: false,
    hasNextPage: true,
    emptyMessage: 'No rows available.',
  },
} satisfies Meta<typeof DataTable<DashboardRecordSummary>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    rows: [],
  },
}