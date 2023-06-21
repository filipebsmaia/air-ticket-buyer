import { prisma } from '@/lib/prisma';
import { verifyAuthorization } from '@/lib/verifyAuthorization';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface Body {
  seats?: string[];
}

interface Props {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: Props) {
  const cookieStore = cookies();

  const { error, userId } = verifyAuthorization(cookieStore);

  if (error) {
    return error;
  }

  const { id } = params;
  const { seats }: Body = await request.json();

  if (!seats || seats.length === 0) {
    return NextResponse.json(
      { error: 'Must have at least one seat' },
      { status: 400 },
    );
  }

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

  if (!flight) {
    return NextResponse.json({ error: 'Flight not found' }, { status: 400 });
  }

  const selectedSeats = await Promise.all(
    seats.map(async (seat) => {
      return await prisma.seat.findUnique({
        where: {
          id: seat,
        },
      });
    }),
  );

  const canReserveSeats =
    selectedSeats.filter((seat) => !!seat && !seat.reservedById).length ===
    seats.length;

  if (!canReserveSeats) {
    return NextResponse.json(
      { error: "Seats can't be reserved" },
      { status: 400 },
    );
  }
  await Promise.all(
    seats.map(async (id) => {
      return await prisma.seat.update({
        where: {
          id,
        },
        data: {
          reservedById: userId,
        },
      });
    }),
  );

  return NextResponse.json({}, { status: 201 });
}
