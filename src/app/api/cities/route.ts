import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const airports = await prisma.airport.findMany({});

  const cities = airports.map((airport) => {
    const { city, state } = airport;
    return {
      city,
      state,
    };
  });

  return NextResponse.json(cities);
}
