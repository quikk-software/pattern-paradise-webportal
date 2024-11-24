import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    console.log({ params: request.nextUrl });

    const allParams = Array.from(searchParams.entries());

    console.log('All params:', allParams);

    return new Response(JSON.stringify({ allParams }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing query params:', error);

    return new Response(JSON.stringify({ error: 'Failed to process query parameters' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
