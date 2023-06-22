import { verifyAuthorization } from '@/lib/verifyAuthorization';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cookieStore = cookies();

  const { error } = verifyAuthorization(cookieStore);

  if (error) {
    return error;
  }

  return NextResponse.json({}, { status: 200 });
}
