'use client';

import React, { JSX, useCallback, useState } from 'react';
import styles from './styles.module.scss';
import {
  MdAirlineSeatReclineExtra,
  MdOutlineDirectionsWalk,
} from 'react-icons/md';
import { calculePrice } from '@/utils/calculePrice';
import { formatPrice } from '@/utils/formatPrice';
import SeatMap from '@/components/SeatMap';
import {
  Airline,
  Airplane,
  Airport,
  Flight,
  Pilot,
  Seat,
} from '@prisma/client';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { api } from '@/lib/api';
import SeatInfo from '@/components/SeatInfo';
import Button from '@/components/Button';

interface SeatReservationProps {
  flight: Flight & {
    airline: Airline;
    airplane: Airplane;
    arrivalAirport: Airport;
    departureAirport: Airport;
    pilot: Pilot;
    seats: Seat[];
  };
}

interface GetSeatPricesProps {
  seats: Seat[];
  baseValue: number;
}

const getSeatPrices = ({ seats, baseValue }: GetSeatPricesProps) => {
  return seats.map((seat) => {
    const { common, executive } = calculePrice(baseValue);
    if (seat.isExecutive) {
      return executive;
    }
    return common;
  });
};

const sumAllReducer = (acc: number, val: number) => acc + val;

const SeatReservation = ({ flight }: SeatReservationProps): JSX.Element => {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const executiveSeats = selectedSeats.filter((seat) => seat.isExecutive);
  const commonSeats = selectedSeats.filter((seat) => !seat.isExecutive);

  const totalPrice = formatPrice(
    getSeatPrices({ seats: selectedSeats, baseValue: flight.value }).reduce(
      sumAllReducer,
      0,
    ),
  );
  const executivePrice = formatPrice(
    getSeatPrices({ seats: executiveSeats, baseValue: flight.value }).reduce(
      sumAllReducer,
      0,
    ),
  );
  const commonPrice = formatPrice(
    getSeatPrices({ seats: commonSeats, baseValue: flight.value }).reduce(
      sumAllReducer,
      0,
    ),
  );

  const handleSelectSeat = useCallback(
    (seats: Seat[]) => {
      setSelectedSeats(seats);
    },
    [setSelectedSeats],
  );

  const handleReserve = async () => {
    try {
      await api.post(`/api/flights/${flight.id}/reserve`, {
        seats: selectedSeats.map((seat) => seat.id),
      });

      router.push('/success');
    } catch (err) {
      const error = err as unknown as AxiosError;

      if (!error.isAxiosError) {
        console.log(err);
        return;
      }
      console.log(err);
    }
  };

  return (
    <section className={styles.content}>
      <SeatMap
        seats={flight.seats}
        value={flight.value}
        onSelectSeat={handleSelectSeat}
      />

      <aside className={styles.summary}>
        <SeatInfo
          title="Assento Executivo"
          value={flight.value}
          isExecutive
          perks={[
            {
              icon: MdAirlineSeatReclineExtra,
              text: 'Mais espaço para suas pernas',
            },
            {
              icon: MdOutlineDirectionsWalk,
              text: 'Embarque e desembarque com prioridade',
            },
          ]}
        />

        <SeatInfo
          title="Assento Comum"
          value={flight.value}
          perks={[
            {
              icon: MdAirlineSeatReclineExtra,
              text: 'Escolha um assento de sua preferência',
            },
          ]}
        />

        <div className={styles.pricing_detail}>
          <ul>
            <li className={styles.executive}>
              <span>Assentos executivo ({executiveSeats.length})</span>
              <strong>{executivePrice}</strong>
            </li>
            <li>
              <span>Assentos comuns ({commonSeats.length})</span>
              <strong>{commonPrice}</strong>
            </li>
          </ul>
        </div>

        <div className={styles.pricing_sumary}>
          <span>Preço final</span>
          <strong>{totalPrice}</strong>
        </div>
        <div className={styles.action}>
          <Button type="button" onClick={handleReserve}>
            Reservar
          </Button>
        </div>
      </aside>
    </section>
  );
};

export default SeatReservation;
