import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'


export interface ProbabilityGraphFeature {
  /** Feature name, e.g. "AGEGR_Adult_Percent" */
  feature: string
  /** The actual value of the feature for this record, e.g. 100 or 0 */
  featureValue?: string | number
  /** SHAP contribution (signed), e.g. +0.75 or -0.19 */
  shapValue: number
}

export interface ProbabilityGraphProps {
  title?: string
  features: ProbabilityGraphFeature[]
  /** E[f(x)] — model baseline / expected value */
  baseline: number
  /** f(x) — final model prediction for this record */
  prediction: number
  height?: number
}

interface WaterfallEntry {
  label: string
  spacer: number
  barValue: number
  isPositive: boolean
  shapValue: number
}

const POSITIVE_COLOR = '#e91e63'
const NEGATIVE_COLOR = '#2196f3'

const formatShapValue = (v: number): string =>
  v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)

function buildWaterfallData(
  features: ProbabilityGraphFeature[],
  baseline: number,
): WaterfallEntry[] {
  let cumulative = baseline
  return features.map((f) => {
    const isPositive = f.shapValue >= 0
    const barValue = Math.abs(f.shapValue)
    const spacer = isPositive ? cumulative : cumulative + f.shapValue
    cumulative += f.shapValue
    return {
      label:
        f.featureValue !== undefined && f.featureValue !== ''
          ? `${f.featureValue} = ${f.feature}`
          : f.feature,
      spacer: Math.max(0, spacer),
      barValue,
      isPositive,
      shapValue: f.shapValue,
    }
  })
}

const WaterfallTooltip = (props: Record<string, unknown>) => {
  const { active, payload } = props as {
    active?: boolean
    payload?: Array<{ payload: WaterfallEntry }>
  }
  if (!active || !payload?.length) return null
  const entry = payload[0]?.payload
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.96)',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{entry.label}</div>
      <div style={{ color: entry.isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR }}>
        SHAP contribution: {formatShapValue(entry.shapValue)}
      </div>
    </div>
  )
}

export const ProbabilityGraph = ({
  title = 'Recommendation Graph',
  features,
  baseline,
  prediction,
  height = 400,
}: ProbabilityGraphProps) => {
  const waterfallData = useMemo(
    () => buildWaterfallData(features, baseline),
    [features, baseline],
  )

  return (
    <section className="chart-panel rounded-4 p-3 p-lg-4">
      <h3 className="fs-5 fw-semibold mb-2">{title}</h3>

      {/* f(x) annotation line */}
      <div
        style={{
          borderTop: '2.5px solid #f5c518',
          display: 'flex',
          justifyContent: 'flex-end',
          paddingBottom: 6,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: '#9a7d0a' }}>
          f(x) = {prediction.toFixed(3)}
        </span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={waterfallData}
            margin={{ top: 4, right: 64, bottom: 4, left: 8 }}
          >
            <XAxis
              type="number"
              domain={[0, 'auto']}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={220}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<WaterfallTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />

            {/* Invisible spacer creates the waterfall offset */}
            <Bar
              dataKey="spacer"
              stackId="waterfall"
              fill="transparent"
              isAnimationActive={false}
            />

            {/* Actual SHAP contribution bar */}
            <Bar
              dataKey="barValue"
              stackId="waterfall"
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            >
              {waterfallData.map((entry, i) => (
                <Cell key={i} fill={entry.isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR} />
              ))}
              <LabelList
                dataKey="shapValue"
                position="right"
                formatter={(v: unknown) => formatShapValue(v as number)}
                style={{ fontSize: 11, fontWeight: 700, fill: '#142033' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* E[f(x)] annotation line */}
      <div
        style={{
          borderBottom: '2.5px solid #f5c518',
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: 6,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: '#9a7d0a' }}>
          E[f(x)] = {baseline.toFixed(3)}
        </span>
      </div>
    </section>
  )
}
