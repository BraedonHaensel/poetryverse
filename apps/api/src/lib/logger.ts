export const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string, err?: unknown) => console.error(`[ERROR] ${msg}`, err),
}
