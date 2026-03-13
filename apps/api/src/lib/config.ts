interface Config {
  port: number
  nodeEnv: string
  GEMINI_API_KEY: string | undefined
  NEXT_AUTH_SECRET: string | undefined
  NEXT_PUBLIC_FRONTEND_URL: string
}

const config: Config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
  NEXT_PUBLIC_FRONTEND_URL:
    process.env.NEXT_PUBLIC_FRONTEND_URL ?? 'http://localhost:3000',
}

export default config
