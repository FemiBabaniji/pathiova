import postgres from 'postgres';
import fs from 'fs/promises';
import path from 'path';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function insertJsonFile(filePath, testName, subcategoryId, questionType) {
  console.log(`Attempting to read file: ${filePath}`);
  const jsonData = await fs.readFile(filePath, 'utf8');
  console.log(`File read successfully: ${filePath}`);
  
  await sql`
    INSERT INTO tests (test_name, test_content, subcategory_id, question_type)
    VALUES (${testName}, ${jsonData}, ${subcategoryId}, ${questionType})
  `;
  console.log(`Inserted ${testName} successfully!`);
}

export async function POST(request) {
  console.log('POST function called');
  try {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    console.log('Data directory:', dataDir);

    const tasks = [
      { file: 'questionswritingtask1.json', name: 'Writing Task 1 - Formal', subcategory: 2, type: 'Formal' },
      { file: 'questionswritingtask2.json', name: 'Writing Task 2 - Semi-Formal', subcategory: 3, type: 'Semi-Formal' },
      { file: 'questionswritingtask3.json', name: 'Writing Task 3 - Informal', subcategory: 4, type: 'Informal' },
      { file: 'questionswritingtask4.json', name: 'Writing Task 1 Mix Test', subcategory: 1, type: 'Mix Test' },
      { file: 'questionswritingtask5.json', name: 'Writing Task 2 Opinion Essay', subcategory: 5, type: 'Opinion Essay' },
      { file: 'questionswritingtask6.json', name: 'Writing Task 2 Argumentative Essay', subcategory: 6, type: 'Argumentative Essay' },
      { file: 'questionswritingtask7.json', name: 'Writing Task 2 Combined Test', subcategory: 7, type: 'Combined Test' }
    ];
    

    for (const task of tasks) {
      const filePath = path.join(dataDir, task.file);
      console.log(`Processing file: ${filePath}`);
      await insertJsonFile(filePath, task.name, task.subcategory, task.type);
    }

    return new Response(JSON.stringify({ message: 'JSON data inserted successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error details:', err);
    return new Response(JSON.stringify({ error: 'Failed to insert JSON data', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
