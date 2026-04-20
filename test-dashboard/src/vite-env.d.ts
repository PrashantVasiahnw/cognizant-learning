/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK_API: 'true' | 'false'
  readonly VITE_PAGE_SIZE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}