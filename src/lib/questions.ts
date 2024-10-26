import fs from 'fs/promises'
import path from 'path'

export interface Question {
  id: number
  text: string
  part: number
}

export async function getQuestionsByTestId(testId: string): Promise<Question[]> {
  const filePath = path.join(process.cwd(), 'data', 'SPEAKING-PRACTICE', 'PI', `${testId}.json`)
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const questions: Question[] = JSON.parse(fileContents)
    return questions
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    throw new Error(`Failed to load questions for test ID ${testId}`)
  }
}