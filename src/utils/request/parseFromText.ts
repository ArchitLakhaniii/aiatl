export type ParsedFlashRequest = {
  when?: string
  where?: string
}

const timePattern =
  /\b(?:(?:today|tomorrow)(?:\s+at)?\s+\d{1,2}(?::\d{2})?\s?(?:am|pm)?)|\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b|\b\d{1,2}:\d{2}\b/iu

const locationPattern = /\b(?:at|in|@)\s+([A-Za-z0-9][A-Za-z0-9\s'&.-]*)(?=[.,;!?\n]|$)/iu

export function parseFromText(input: string): ParsedFlashRequest {
  const text = input ?? ''

  const whenMatch = text.match(timePattern)
  const when = whenMatch ? whenMatch[0].trim() : ''

  const locationMatch = text.match(locationPattern)
  const where = locationMatch ? locationMatch[1].trim() : ''

  return { when, where }
}

