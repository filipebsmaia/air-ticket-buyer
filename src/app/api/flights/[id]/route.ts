import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Props) {
  const { id } = params;
  const flight = await prisma.flight.findUnique({
    where: {
      id,
    },
    include: {
      airline: true,
      airplane: true,
      arrivalAirport: true,
      departureAirport: true,
      pilot: true,
      seats: true,
    },
  });

  return NextResponse.json(flight);
}
