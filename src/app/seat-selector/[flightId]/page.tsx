'use client';
import useSWR from 'swr';
import SeatMap from '@/components/SeatMap';
import styles from './styles.module.scss';

import {
  Airline,
  Airplane,
  Airport,
  Flight,
  Pilot,
  Seat,
} from '@prisma/client';
import SeatInfo from '@/components/SeatInfo';
import {
  MdAirlineSeatReclineExtra,
  MdOutlineDirectionsWalk,
} from 'react-icons/md';
import { useCallback, useState } from 'react';
import { formatPrice } from '@/utils/formatPrice';
import { calculePrice } from '@/utils/calculePrice';
import { fetcher } from '@/utils/fetcher';
import Button from '@/components/Button';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

type GetFlight = Flight & {
  airline: Airline;
  airplane: Airplane;
  arrivalAirport: Airport;
  departureAirport: Airport;
  pilot: Pilot;
  seats: Seat[];
};

interface SeatSelectorProps {
  params: {
    flightId: string;
  };
}

export default function SeatSelector({ params }: SeatSelectorProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const { data, error, isLoading } = useSWR<GetFlight>(
    `/api/flights/${params.flightId}`,
    fetcher,
  );

  const flight = data!;

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

      // router.push('/');
      router.refresh();
    } catch (err) {
      const error = err as unknown as AxiosError;

      if (!error.isAxiosError) {
        console.log(err);
        return;
      }
      console.log(err);
    }
  };

  const getSeatPrices = (seats: Seat[]) => {
    return seats.map((seat) => {
      const { common, executive } = calculePrice(flight.value);
      if (seat.isExecutive) {
        return executive;
      }
      return common;
    });
  };

  const sumAllReducer = (acc: number, val: number) => acc + val;

  const executiveSeats = selectedSeats.filter((seat) => seat.isExecutive);
  const commonSeats = selectedSeats.filter((seat) => !seat.isExecutive);

  const totalPrice = formatPrice(
    getSeatPrices(selectedSeats).reduce(sumAllReducer, 0),
  );
  const executivePrice = formatPrice(
    getSeatPrices(executiveSeats).reduce(sumAllReducer, 0),
  );
  const commonPrice = formatPrice(
    getSeatPrices(commonSeats).reduce(sumAllReducer, 0),
  );

  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Escolha seus assentos</h1>
          <span>Estamos carregando os dados se deu voo...</span>
        </div>
        <section className={styles.content}>
          <h2>Aguarde um momento, estamos carregando os dados de seu voo</h2>
        </section>
      </main>
    );
  }
  if (error) {
    return <h1>Falha</h1>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Escolha seus assentos</h1>
        <span>
          {flight.departureAirport.name} para {flight.arrivalAirport.name}
        </span>
      </div>
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
    </main>
  );
}
