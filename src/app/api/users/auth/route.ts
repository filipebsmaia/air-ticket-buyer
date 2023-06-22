import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/lib/JWTPayload';
import { addDays } from 'date-fns';

interface Body {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const { email, password }: Body = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing Parameters' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const { password: userPassword, ...userWithoutPassword } = user;
  if (userPassword !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const payload: JWTPayload = {
    userId: user.id,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: '7d', // Seven Days
  });

  const response = NextResponse.json({
    user: userWithoutPassword,
    accessToken,
  });

  response.cookies.set({
    name: 'authorization',
    value: accessToken,
    expires: addDays(new Date(), 7),
  });

  return response;
}
