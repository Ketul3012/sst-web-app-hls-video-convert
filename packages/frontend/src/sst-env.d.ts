/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_VIDEO_BUCKET_NAME: string
  readonly VITE_APP_VIDEO_DOMAIN_NAME: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}