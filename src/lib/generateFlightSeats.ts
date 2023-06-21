import { AIRPLANE_MODEL } from '@prisma/client';

export const generateFlightSeats = (model: AIRPLANE_MODEL) => {
  const codeMap: { [_: number]: string } = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G',
    7: 'H',
    8: 'I',
  };

  const seats = Array(23)
    .fill(0)
    .map((_, line) => {
      const lineNumber = line + 1;

      return Array(6)
        .fill(0)
        .map((_, column) => {
          const seat = {
            code: `${lineNumber}${codeMap[column % 6]}`,
            isExecutive: lineNumber <= 6,
            reservedById: null,
          };

          return seat;
        });
    })
    .flat();

  return seats;
};
