import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export async function GET(request, { params }) {
  const { testId } = params;  // Extract testId from the URL parameters

  if (!testId) {
    return new Response(JSON.stringify({ error: 'testId is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const test = await sql`
      SELECT test_content FROM tests WHERE id = ${testId}
    `;

    if (test.length === 0) {
      return new Response(JSON.stringify({ error: 'Test not found' }), { status: 404 });
    }

    return new Response(test[0].test_content, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch test data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
