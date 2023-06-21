import jwt from 'jsonwebtoken';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { NextResponse } from 'next/server';
import { JWTPayload } from './JWTPayload';

type VerifyAuthorizationResponse =
  | {
      error?: null;
      userId: string;
    }
  | {
      error: NextResponse;
      userId?: null;
    };

export const verifyAuthorization = (
  cookies: ReadonlyRequestCookies,
): VerifyAuthorizationResponse => {
  const authorization = cookies.get('authorization') || '';
  console.log({ authorization });

  const errorResponse = NextResponse.json(
    { error: 'Unauthenticated' },
    { status: 400 },
  );

  if (!authorization) {
    return { error: errorResponse };
  }

  try {
    const data = jwt.verify(
      authorization.value,
      process.env.JWT_SECRET_KEY!,
    ) as JWTPayload;
    console.log(data);
    return { userId: data.userId };
  } catch (err) {
    return { error: errorResponse };
  }
};
