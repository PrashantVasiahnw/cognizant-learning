import type { ReactElement } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartDefinition } from '../../types/dashboard'
import type { DynamicChartProps } from './types'

export type { DynamicChartProps } from './types'

const renderCartesianChart = (chart: ChartDefinition): ReactElement => {
  switch (chart.type) {
    case 'line':
      return (
        <LineChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(32, 42, 68, 0.12)" />
          <XAxis dataKey={chart.xKey} tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip />
          <Legend />
          {chart.series.map((series) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              strokeWidth={3}
              dot={false}
            />
          ))}
        </LineChart>
      )
    case 'area':
      return (
        <AreaChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(32, 42, 68, 0.12)" />
          <XAxis dataKey={chart.xKey} tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip />
          <Legend />
          {chart.series.map((series) => (
            <Area
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              fill={series.color}
              fillOpacity={0.24}
            />
          ))}
        </AreaChart>
      )
    default:
      return (
        <BarChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(32, 42, 68, 0.12)" />
          <XAxis dataKey={chart.xKey} tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip />
          <Legend />
          {chart.series.map((series) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.label}
              fill={series.color}
              radius={[10, 10, 0, 0]}
            />
          ))}
        </BarChart>
      )
  }
}

export const DynamicChart = ({ chart, height = 280 }: DynamicChartProps) => {
  return (
    <section className="chart-panel rounded-4 p-3 p-lg-4">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-2 mb-3">
        <div>
          <h3 className="fs-5 fw-semibold mb-1">{chart.title}</h3>
          {chart.subtitle ? <p className="text-secondary mb-0">{chart.subtitle}</p> : null}
        </div>
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {chart.type === 'pie' ? (
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={chart.data}
                dataKey={chart.series[0]?.key ?? 'value'}
                nameKey={chart.xKey}
                outerRadius={96}
                innerRadius={52}
              >
                {chart.data.map((entry) => (
                  <Cell
                    key={`${entry.label}-${entry.fill ?? 'default'}`}
                    fill={(entry.fill as string | undefined) ?? chart.series[0]?.color ?? '#0d6efd'}
                  />
                ))}
              </Pie>
            </PieChart>
          ) : (
            renderCartesianChart(chart)
          )}
        </ResponsiveContainer>
      </div>
    </section>
  )
}