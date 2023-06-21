'use client';

import { Seat } from '@prisma/client';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

interface SeatMapProps {
  seats: Seat[];
  value: number;
  onSelectSeat: (seats: Seat[]) => void;
}

const IMAGE_SIZE = {
  WIDTH: 38,
  HEIGHT: 45,
};
const TILE_SIZE = 60;

const LETTER_MAP: { [_: string]: number } = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
};

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const SeatMap = ({ seats, value, onSelectSeat }: SeatMapProps): JSX.Element => {
  const [hoveredSeat, setHoveredSeat] = useState<Seat | undefined>();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const commonSeatRef = useRef<HTMLImageElement>(null);
  const reservedSeatRef = useRef<HTMLImageElement>(null);
  const commonSelectedSeatRef = useRef<HTMLImageElement>(null);
  const executiveSeatRef = useRef<HTMLImageElement>(null);
  const executiveSelectedSeatRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const letters = Array.from(
    new Set(
      seats.map((seat) => {
        const seatLetter = seat.code.substring(
          seat.code.length - 1,
          seat.code.length,
        );

        return seatLetter;
      }),
    ),
  );

  const layers = Array.from(
    new Set(
      seats.map((seat) => {
        return Number(seat.code.substring(0, seat.code.length - 1));
      }),
    ),
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const renderItem = (
        x: number,
        y: number,
        cb: (x: number, y: number) => void,
      ) => {
        ctx.resetTransform();

        const newX = x * TILE_SIZE;
        const newY = y * TILE_SIZE;

        cb(newX, newY);
      };

      const renderSeat = (x: number, y: number, element: HTMLImageElement) => {
        renderItem(x, y, (x, y) => {
          ctx.drawImage(
            element,
            x + (TILE_SIZE - IMAGE_SIZE.WIDTH) / 2,
            y + (TILE_SIZE - IMAGE_SIZE.HEIGHT) / 2,
          );
        });
      };

      const renderText = (x: number, y: number, text: string) => {
        renderItem(x, y, (x, y) => {
          ctx.fillText(text, x + TILE_SIZE / 2, y + TILE_SIZE / 2);
        });
      };
      seats.forEach((seat) => {
        const seatLetter = seat.code.substring(
          seat.code.length - 1,
          seat.code.length,
        );
        const letterAsNumber = LETTER_MAP[seatLetter];
        const seatLine = Number(seat.code.substring(0, seat.code.length - 1));
        const layer = seatLine;

        const tileX =
          letterAsNumber + ~~((letterAsNumber - 1) / (letters.length / 2));
        const tileY = layer;

        if (seat.reservedById) {
          renderSeat(tileX, tileY, reservedSeatRef.current!);
          return;
        }
        if (
          selectedSeats.length > 0 &&
          selectedSeats.find((selected) => selected.id === seat.id)
        ) {
          if (seat.isExecutive) {
            renderSeat(tileX, tileY, commonSelectedSeatRef.current!);
            return;
          }
          renderSeat(tileX, tileY, executiveSelectedSeatRef.current!);
          return;
        }

        if (seat.isExecutive) {
          renderSeat(tileX, tileY, commonSeatRef.current!);
          return;
        }
        renderSeat(tileX, tileY, executiveSeatRef.current!);
      });

      ctx.fillStyle = '#000';
      ctx.font = `${TILE_SIZE / 3}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      layers.forEach((layer, index) => {
        renderText(4, layer, `${layer}`);
      });

      letters.forEach((letter, index) => {
        const x = index + 1 + ~~(index / (letters.length / 2));
        const y = 0;
        renderText(x, y, letter);
      });
    },
    [layers, letters, seats, selectedSeats],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    let animationFrameId = 0;
    const render = () => {
      draw(context);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  useEffect(() => {
    onSelectSeat(selectedSeats);
  }, [onSelectSeat, selectedSeats]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const isSeatTile = (x: number, y: number) => {
      if (x < 1 || y < 1) {
        return;
      }
      if (x % 4 === 0) {
        return;
      }
      if (y > layers.length) {
        return;
      }

      return true;
    };

    const onMouseMove = (ev: MouseEvent) => {
      const modal = modalRef.current;

      if (!modal) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const { clientX, clientY } = ev;

      const tileX = ~~((clientX - rect.left) / TILE_SIZE);
      const tileY = ~~((clientY - rect.top) / TILE_SIZE);

      if (isSeatTile(tileX, tileY)) {
        const seat = seats.find((seat) => {
          const seatLetter = seat.code.substring(
            seat.code.length - 1,
            seat.code.length,
          );
          const letterAsNumber = LETTER_MAP[seatLetter];
          const layer = Number(seat.code.substring(0, seat.code.length - 1));

          const x =
            letterAsNumber + ~~((letterAsNumber - 1) / (letters.length / 2));
          const y = layer;

          return x === tileX && y === tileY;
        });

        if (!seat) {
          return;
        }
        modal.style.top = `${tileY * TILE_SIZE - rect.top}px`;
        modal.style.left = `${tileX * TILE_SIZE + rect.left}px`;
        modal.style.transform = `translate(calc(-50% + ${
          TILE_SIZE / 2
        }px), calc(50% + ${TILE_SIZE}px))`;

        if (seat.reservedById) {
          canvas.style.cursor = 'not-allowed';
        } else {
          canvas.style.cursor = 'pointer';
        }

        if (hoveredSeat !== seat) {
          setHoveredSeat(seat);
        }
      } else {
        canvas.style.cursor = 'not-allowed';
        setHoveredSeat(undefined);
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [hoveredSeat, layers.length, letters.length, seats]);

  const handleClick = () => {
    if (hoveredSeat) {
      if (hoveredSeat.reservedById) {
        return;
      }

      setSelectedSeats((state) => {
        if (state.find((seat) => hoveredSeat.id === seat.id)) {
          return state.filter((seat) => hoveredSeat.id !== seat.id);
        }
        return [...state, hoveredSeat];
      });
    }
  };

  return (
    <div>
      <img
        ref={commonSeatRef}
        src="/seat/default.svg"
        alt=""
        className={styles.hidden}
      />

      <img
        ref={commonSelectedSeatRef}
        src="/seat/default-checked.svg"
        alt=""
        className={styles.hidden}
      />
      <img
        ref={executiveSeatRef}
        src="/seat/executive.svg"
        alt=""
        className={styles.hidden}
      />
      <img
        ref={executiveSelectedSeatRef}
        src="/seat/executive-checked.svg"
        alt=""
        style={{ display: 'none' }}
      />
      <img
        ref={reservedSeatRef}
        src="/seat/reserved.svg"
        alt=""
        style={{ display: 'none' }}
      />
      <div
        ref={modalRef}
        className={`
          ${styles.modal}
          ${hoveredSeat ? styles.hover : styles.hidden}
          ${
            hoveredSeat?.reservedById
              ? styles.reserved
              : hoveredSeat?.isExecutive
              ? styles.executive
              : ''
          }
        `}
      >
        {hoveredSeat && (
          <>
            <div>
              <strong>{hoveredSeat.code}</strong>
              <span>
                {hoveredSeat.isExecutive
                  ? 'Assento Executivo'
                  : 'Assento Comum'}
              </span>
            </div>
            <span>
              {hoveredSeat.reservedById
                ? 'Indisponível'
                : numberFormatter.format(
                    hoveredSeat.isExecutive ? value * 1.3 : value,
                  )}
            </span>
          </>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={TILE_SIZE * 9}
        height={TILE_SIZE * (layers.length + 1)}
        onClick={() => handleClick()}
      ></canvas>
    </div>
  );
};

export default SeatMap;
