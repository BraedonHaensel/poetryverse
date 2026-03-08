interface Config {
  port: number
  nodeEnv: string
  GEMINI_API_KEY: string | undefined
}

const config: Config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV ?? 'dev',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
}

export default config
