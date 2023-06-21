import { prisma } from '@/lib/prisma';
import { AIRPLANE_MODEL } from '@prisma/client';
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

  // if (!flight) {
  //   const codeMap: { [_: number]: string } = {
  //     0: 'A',
  //     1: 'B',
  //     2: 'C',
  //     3: 'D',
  //     4: 'E',
  //     5: 'F',
  //   };

  //   const seats = Array(23)
  //     .fill(0)
  //     .map((_, line) => {
  //       const lineNumber = line + 1;

  //       return Array(6)
  //         .fill(0)
  //         .map((_, column) => {
  //           const seat = {
  //             code: `${lineNumber}${codeMap[column % 6]}`,
  //             isExecutive: lineNumber <= 6,
  //             reservedById: null,
  //           };

  //           return seat;
  //         });
  //     })
  //     .flat();

  //   flight = await prisma.flight.create({
  //     data: {
  //       id,
  //       value: 264.7,
  //       departureDate: new Date(),
  //       expectedArrivalDate: new Date(),
  //       pilot: {
  //         connectOrCreate: {
  //           where: {
  //             id: '08ec36d2-dc71-400c-8771-410169a3f6bd',
  //           },
  //           create: {
  //             id: '08ec36d2-dc71-400c-8771-410169a3f6bd',
  //             name: 'Jose Alfredo',
  //           },
  //         },
  //       },
  //       departureAirport: {
  //         connectOrCreate: {
  //           where: {
  //             id: 'd21e1521-8d01-4651-8fb3-8efd87a6f77e',
  //           },
  //           create: {
  //             id: 'd21e1521-8d01-4651-8fb3-8efd87a6f77e',
  //             slug: 'SSA',
  //             name: 'Aeroporto Internacional de Salvador',
  //           },
  //         },
  //       },
  //       arrivalAirport: {
  //         connectOrCreate: {
  //           where: {
  //             id: '2382e0c3-0511-415a-9b64-32fa13fc934a',
  //           },
  //           create: {
  //             id: '2382e0c3-0511-415a-9b64-32fa13fc934a',
  //             slug: 'FEC',
  //             name: 'Aeroporto de Feira de Santana',
  //           },
  //         },
  //       },
  //       airline: {
  //         connectOrCreate: {
  //           where: {
  //             id: 'd21e1521-8d01-4651-8fb3-8efd87a6f77e',
  //           },
  //           create: {
  //             id: 'd21e1521-8d01-4651-8fb3-8efd87a6f77e',
  //             name: 'Jose Alfredo',
  //           },
  //         },
  //       },
  //       airplane: {
  //         connectOrCreate: {
  //           where: {
  //             id: 'd21e1521-8d01-4651-8fb3-8efd87a6f77e',
  //           },
  //           create: {
  //             id: 'd21e1521-8d01-4651-8fb3-8efd87a6f77e',
  //             model: AIRPLANE_MODEL.BOEING_737,
  //             serialNumber: 19019,
  //           },
  //         },
  //       },
  //       seats: {
  //         createMany: {
  //           data: seats,
  //         },
  //       },
  //     },
  //     include: {
  //       airline: true,
  //       airplane: true,
  //       arrivalAirport: true,
  //       departureAirport: true,
  //       pilot: true,
  //       seats: true,
  //     },
  //   });
  // }

  return NextResponse.json(flight);
}
