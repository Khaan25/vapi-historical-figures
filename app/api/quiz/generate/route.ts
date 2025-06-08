import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { figure, difficulty } = await request.json()

    const prompt = `Generate 5 multiple-choice questions about ${figure.name} (${figure.category}) at a ${difficulty} difficulty level.
Use the following information about the historical figure:
- Bio: ${figure.bio}
- Notable Work: ${figure.notableWork}
- Description: ${figure.description}
- Time Period: ${figure.dateOfBirth} - ${figure.dateOfDeath}

For each question:
1. Make it ${difficulty} difficulty
2. Include 4 options (A, B, C, D)
3. Mark the correct answer
4. Ensure questions are factual and based on the provided information

Format the response as a JSON array with objects containing:
{
  "id": number,
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": number (0-3)
}`

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable history teacher creating quiz questions. Always provide response in the exact JSON format requested.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const questions = JSON.parse(response)

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error generating quiz questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    )
  }
}
