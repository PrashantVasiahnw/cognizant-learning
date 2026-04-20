import type { Preview } from '@storybook/react-vite'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../src/styles/global.css'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview