import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = NextResponse.json({});

  response.cookies.set({
    name: 'authorization',
    value: '',
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
