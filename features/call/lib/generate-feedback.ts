import { feedbackSchema } from '@/schema'

import { Message, MessageTypeEnum, TranscriptMessage } from '@/types/conversation.type'
import { openai } from '@/lib/ai'

export const generateFeedback = async (messages: Message[]) => {
  // Format messages for OpenAI
  const formattedTranscript = messages
    .filter((msg): msg is TranscriptMessage => msg.type === MessageTypeEnum.TRANSCRIPT)
    .map((msg) => `${msg.role}: ${msg.transcript}`)
    .join('\n')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories.

You MUST return your response as a JSON object with the following structure:
{
  "totalScore": number,
  "categoryScores": [
    {
      "name": "Communication Skills",
      "score": number,
      "comment": string
    },
    {
      "name": "Technical Knowledge",
      "score": number,
      "comment": string
    },
    {
      "name": "Problem Solving",
      "score": number,
      "comment": string
    },
    {
      "name": "Cultural Fit",
      "score": number,
      "comment": string
    },
    {
      "name": "Confidence and Clarity",
      "score": number,
      "comment": string
    }
  ],
  "strengths": string[],
  "areasForImprovement": string[],
  "finalAssessment": string
}`,
      },
      {
        role: 'user',
        content: `
          Analyze this mock interview and provide detailed feedback in JSON format. Be thorough and don't be lenient with the candidate. Point out any mistakes or areas for improvement.

          Transcript:
          ${formattedTranscript}

          Score the candidate from 0 to 100 in these categories:
          - Communication Skills: Clarity, articulation, structured responses
          - Technical Knowledge: Understanding of key concepts for the role
          - Problem Solving: Ability to analyze problems and propose solutions
          - Cultural Fit: Alignment with company values and job role
          - Confidence and Clarity: Confidence in responses, engagement, and clarity
        `,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const result = completion.choices[0].message.content
  if (!result) throw new Error('No feedback generated')

  const parsedResult = feedbackSchema.parse(JSON.parse(result))
  return parsedResult
}
