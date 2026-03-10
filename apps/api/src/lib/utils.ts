export const getErrorStatus = (err: unknown): number | undefined => {
  if (typeof err !== 'object' || err === null) {
    return undefined
  }

  const status = (err as { status?: unknown }).status
  return typeof status === 'number' ? status : undefined
}
