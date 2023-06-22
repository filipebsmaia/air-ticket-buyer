import { generateFlightSeats } from '@/lib/generateFlightSeats';
import { prisma } from '@/lib/prisma';
import { addMinutes, roundToNearestMinutes } from 'date-fns';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const airports = await prisma.airport.findMany({});
  const airplanes = await prisma.airplane.findMany({});
  const airlines = await prisma.airline.findMany({});
  const pilots = await prisma.pilot.findMany({});

  const flights = await Promise.all(
    Array(10)
      .fill('')
      .map(async () => {
        const airplane =
          airplanes[Math.floor(Math.random() * airplanes.length)];
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const pilot = pilots[Math.floor(Math.random() * pilots.length)];
        const arrivalAirport =
          airports[Math.floor(Math.random() * airports.length)];
        const departureAirport =
          airports[Math.floor(Math.random() * airports.length)];

        const departureDate = addMinutes(
          roundToNearestMinutes(new Date(), { nearestTo: 10 }),
          Math.floor(Math.random() * (6 * 20 + 1)) * 10 + 240,
        );
        const expectedArrivalDate = addMinutes(
          departureDate,
          Math.floor(Math.random() * (6 * 3 + 1)) * 10 + 60,
        );

        const flight = await prisma.flight.create({
          data: {
            value: Math.floor(Math.random() * 101) * 10 + 200,
            airplaneId: airplane.id,
            airlineId: airline.id,
            pilotId: pilot.id,
            arrivalAirportId: arrivalAirport.id,
            departureAirportId: departureAirport.id,
            departureDate,
            expectedArrivalDate,
            seats: {
              createMany: {
                data: generateFlightSeats(airplane.model),
              },
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
        });

        console.log(flight);

        return flight;
      }),
  );

  return NextResponse.json({ flights });
}
