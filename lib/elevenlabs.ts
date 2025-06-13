import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

export const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
})
