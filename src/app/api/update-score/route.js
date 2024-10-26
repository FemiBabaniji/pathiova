import { NextResponse } from 'next/server';
import postgres from 'postgres';

// Initialize the PostgreSQL connection
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

// POST request to update or insert the score
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, testId, score } = body;

    // Validate that required fields are provided
    if (!email || !testId || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Insert or update score for the given email and testId
    const result = await sql`
      INSERT INTO test_mappings (email, test_id, score)
      VALUES (${email}, ${testId}, ${score})
      ON CONFLICT (email, test_id)
      DO UPDATE SET score = ${score}, created_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    // Return the updated/inserted score data
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
  }
}

// GET request to fetch scores by email
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Validate that email is provided
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Fetch scores for the given email from the database
    const scores = await sql`
      SELECT * FROM test_mappings WHERE email = ${email}
    `;

    // If no scores are found, return a 404 message
    if (scores.length === 0) {
      return NextResponse.json({ message: 'No scores found for this email' }, { status: 404 });
    }

    // Return the fetched scores
    return NextResponse.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}
