interface Config {
  port: number
  nodeEnv: string
  GEMINI_API_KEY: string | undefined
  NEXT_AUTH_SECRET: string | undefined
  NEXT_PUBLIC_FRONTEND_URL: string
  ENABLE_GEMINI_POEM_VALIDATION: boolean
}

const parseBooleanEnv = (value: string | undefined): boolean => {
  if (value == null) {
    // Default to true.
    return true
  }

  return value === 'true'
}

const config: Config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
  NEXT_PUBLIC_FRONTEND_URL:
    process.env.NEXT_PUBLIC_FRONTEND_URL ?? 'http://localhost:3000',
  ENABLE_GEMINI_POEM_VALIDATION: parseBooleanEnv(
    process.env.ENABLE_GEMINI_POEM_VALIDATION
  ),
}

export default config
