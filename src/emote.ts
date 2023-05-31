// TODO: How to modules typically export their types?
export type EmoteTheme = 'light' | 'dark'
export type EmoteScale = '1.0' | '2.0' | '3.0'
export interface MessagePart {
  type: 'text' | 'emote'
  raw?: string
  value: string
}

interface EmotePosition {
  id: string
  start: number
  end: number
}

// @see https://dev.twitch.tv/docs/irc/emotes/#using-the-cdn-url-template-to-create-an-image-url
export function getEmoteAsUrl (id: string, theme: EmoteTheme = 'light', scale: EmoteScale = '2.0') {
  return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/${theme}/${scale}`
}

export function parseEmotesInMessage (emotes: Record<string, string[]>, msg: string): MessagePart[] {
  if (!emotes) return [{ type: 'text', value: msg }]

  // Split the message in a unicode-safe way
  const msgArray = Array.from(msg)
  // Build a list of all emote positions sorted by start index
  const emotePositions = Object.entries(emotes)
    .reduce((ranges: EmotePosition[], [id, stringRanges]) => {
      stringRanges.forEach(stringRange => {
        const [start, end] = stringRange.split('-').map(Number)
        ranges.push({ id, start, end })
      })

      return ranges
    }, [])
    .sort((a, b) => a.start - b.start)

  const result: MessagePart[] = []
  let cursor = 0

  for (const { id, start, end } of emotePositions) {
    // Add any text before the first emote.
    if (start > cursor) {
      result.push({
        type: 'text',
        value: msgArray.slice(cursor, start).join('')
      })
    }

    result.push({
      type: 'emote',
      raw: msgArray.slice(start, end + 1).join(''),
      value: `${id}`
    })
    cursor = end + 1
  }

  // Add any remaining text after the last emote.
  if (cursor < msgArray.length) {
    result.push({
      type: 'text',
      value: msgArray.slice(cursor).join('')
    })
  }

  return result
}
