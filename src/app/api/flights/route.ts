import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const departureAirport = searchParams.get('departureAirport') || '';
  const arrivalAirport = searchParams.get('arrivalAirport') || '';
  const arrivalDate = new Date(
    searchParams.get('arrivalDate') || addDays(new Date(), 21),
  );
  const departureDate = new Date(
    searchParams.get('departureDate') || new Date(),
  );

  console.log(request.url);
  // await request.json();

  console.log(departureAirport, arrivalAirport, arrivalDate, departureDate);
  const flights = await prisma.flight.findMany({
    where: {
      departureAirport: {
        OR: [
          {
            name: {
              contains: departureAirport,
            },
          },
          {
            slug: {
              contains: departureAirport,
            },
          },
        ],
      },
      arrivalAirport: {
        OR: [
          {
            name: {
              contains: arrivalAirport,
            },
          },
          {
            slug: {
              contains: arrivalAirport,
            },
          },
        ],
      },
      departureDate: {
        gte: departureDate,
      },
      expectedArrivalDate: {
        lte: arrivalDate,
      },
    },
    include: {
      airline: true,
      airplane: true,
      arrivalAirport: true,
      departureAirport: true,
      pilot: true,
      seats: true,
    },
    take: 15,
  });

  return NextResponse.json(flights);
}
