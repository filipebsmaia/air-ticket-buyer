import { generateFlightSeats } from '@/lib/generateFlightSeats';
import { prisma } from '@/lib/prisma';
import { addMinutes, roundToNearestMinutes } from 'date-fns';
import { NextResponse } from 'next/server';

const data = [
  {
    slug: 'SSA',
    name: 'Aeroporto Internacional de Salvador',
  },
  {
    slug: 'FEC',
    name: 'Aeroporto de Feira de Santana',
  },
  {
    slug: 'AJU',
    name: 'Aeroporto Santa Maria, Aracaju',
  },
  {
    slug: 'BEL',
    name: 'Aeroporto Val de Caes, Belém',
  },
  {
    slug: 'BGX',
    name: 'Aeroporto de Bagé',
  },
  {
    slug: 'BNU',
    name: 'Aeroporto de Blumenau',
  },
  {
    slug: 'BPS',
    name: 'Aeroporto de Porto Seguro',
  },
  {
    slug: 'BSB',
    name: 'Aeroporto Juscelino Kubitschek, Brasília ',
  },
  {
    slug: 'BVB',
    name: 'Aeroporto de Boa Vista',
  },
  {
    slug: 'CAC',
    name: 'Aeroporto de Cascavel',
  },
  {
    slug: 'CFB',
    name: 'Aeroporto de Cabo Frio',
  },
  {
    slug: 'CGB',
    name: 'Aeroporto de Cuiabá',
  },
  {
    slug: 'JOI',
    name: 'Aeroporto de Joinville',
  },
  {
    slug: 'CGH',
    name: 'Aeroporto de Congonhas, São Paulo',
  },
  {
    slug: 'SDU',
    name: 'Santos Dumont, no Rio de Janeiro',
  },
  {
    slug: 'GRU',
    name: 'Aeroporto Franco Montoro, em Guarulhos',
  },
  {
    slug: 'GIG',
    name: 'Aeroporto do Galeão, Rio de Janeiro',
  },
  {
    slug: 'MCZ',
    name: 'Aeroporto Zumbi dos Palmares, Maceió',
  },
  {
    slug: 'PMW',
    name: 'Aeroporto de Palmas',
  },
  {
    slug: 'REC',
    name: 'Aeroporto dos Guararapes, Recife',
  },
  {
    slug: 'UDI',
    name: 'Aeroporto de Uberlândia',
  },
  {
    slug: 'GYN',
    name: 'Aeroporto de Goiânia',
  },
];

export async function GET(request: Request) {
  await Promise.all(
    data.map(async (airport) => {
      const exist = await prisma.airport.findFirst({
        where: {
          slug: airport.slug,
        },
      });

      if (!exist) {
        await prisma.airport.create({
          data: airport,
        });
      }
    }),
  );

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
