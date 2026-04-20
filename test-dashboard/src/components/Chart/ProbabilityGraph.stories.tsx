import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProbabilityGraph } from './ProbabilityGraph'

const meta = {
  title: 'Components/Chart/ProbabilityGraph',
  component: ProbabilityGraph,
  args: {
    title: 'Recommendation Graph',
    baseline: 0.526,
    prediction: 3.027,
    features: [
      { feature: 'AGEGR_Adult_Percent', featureValue: 100, shapValue: 0.75 },
      { feature: 'SERIOUSNESS_Y_Percent', featureValue: 100, shapValue: 0.26 },
      { feature: 'SEX_Female_Percent', featureValue: 100, shapValue: 0.23 },
      { feature: 'AGEGR_Pediatric_Total', featureValue: 0, shapValue: 0.23 },
      { feature: 'TESTSR_Y_Percent', featureValue: 100, shapValue: 0.2 },
      { feature: 'concomitant_Y_Percent', featureValue: 100, shapValue: -0.19 },
      { feature: 'SEX_Male_Percent', featureValue: 0, shapValue: 0.15 },
      { feature: 'Verb_Y_Percent', featureValue: 0, shapValue: -0.14 },
      { feature: 'AGEGR_Pediatric_Percent', featureValue: 0, shapValue: 0.14 },
      { feature: '142 other features', shapValue: 0.87 },
    ],
  },
} satisfies Meta<typeof ProbabilityGraph>

export default meta

type Story = StoryObj<typeof meta>

/** Full feature set matching the backend SHAP output shape */
export const Default: Story = {}

/** Fewer features — useful for testing with a minimal backend response */
export const FewFeatures: Story = {
  args: {
    title: 'Simplified Probability Graph',
    baseline: 0.5,
    prediction: 1.8,
    features: [
      { feature: 'AGEGR_Adult_Percent', featureValue: 100, shapValue: 0.6 },
      { feature: 'SEX_Female_Percent', featureValue: 100, shapValue: 0.4 },
      { feature: 'concomitant_Y_Percent', featureValue: 100, shapValue: -0.3 },
      { feature: 'Verb_Y_Percent', featureValue: 0, shapValue: 0.6 },
    ],
  },
}

/** All negative contributions — verifies bar positioning for decreasing waterfall */
export const AllNegative: Story = {
  args: {
    title: 'Risk Reduction Graph',
    baseline: 3.0,
    prediction: 1.2,
    features: [
      { feature: 'AGEGR_Pediatric_Total', featureValue: 0, shapValue: -0.45 },
      { feature: 'concomitant_Y_Percent', featureValue: 0, shapValue: -0.38 },
      { feature: 'Verb_Y_Percent', featureValue: 0, shapValue: -0.52 },
      { feature: 'SEX_Male_Percent', featureValue: 1, shapValue: -0.25 },
      { feature: 'TESTSR_Y_Percent', featureValue: 0, shapValue: -0.2 },
    ],
  },
}
