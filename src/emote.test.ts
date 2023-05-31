import { describe, expect, it } from '@jest/globals'
import { parseEmotesInMessage, getEmoteAsUrl } from './emote'

describe('emote.ts', () => {
  describe('getEmoteAsUrl', () => {
    it('should return emote url', () => {
      expect(getEmoteAsUrl('1234')).toBe('https://static-cdn.jtvnw.net/emoticons/v2/1234/default/light/2.0')
    })

    it('should return emote url when given options', () => {
      expect(getEmoteAsUrl('1234', 'dark', '1.0')).toBe('https://static-cdn.jtvnw.net/emoticons/v2/1234/default/dark/1.0')
    })
  })

  describe('parseEmotesInMessage', () => {
    it('should return single part for message with no emote', () => {
      const result = parseEmotesInMessage(null, 'hey there')

      expect(result).toEqual([{
        type: 'text',
        value: 'hey there'
      }])
    })

    it('should return parts for message', () => {
      const result = parseEmotesInMessage({
        1111: ['5-7', '24-26'],
        9999: ['15-18']
      }, 'cant LULbelieveHYPE you LUL hit that shot')

      expect(result).toEqual([
        {
          type: 'text',
          value: 'cant '
        },
        {
          raw: 'LUL',
          type: 'emote',
          value: 'https://static-cdn.jtvnw.net/emoticons/v2/1111/default/light/2.0'
        },
        {
          type: 'text',
          value: 'believe'
        },
        {
          raw: 'HYPE',
          type: 'emote',
          value: 'https://static-cdn.jtvnw.net/emoticons/v2/9999/default/light/2.0'
        },
        {
          type: 'text',
          value: ' you '
        },
        {
          raw: 'LUL',
          type: 'emote',
          value: 'https://static-cdn.jtvnw.net/emoticons/v2/1111/default/light/2.0'
        },
        {
          type: 'text',
          value: ' hit that shot'
        }
      ])
    })
  })
})
