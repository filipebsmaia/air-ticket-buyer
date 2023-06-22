'use client';

import styles from './styles.module.scss';

import {
  Airline,
  Airplane,
  Airport,
  Flight,
  Pilot,
  Seat,
} from '@prisma/client';
import SeatReservation from '@/components/SeatReservation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

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
  const [isLoading, setLoading] = useState(true);
  const [flight, setFlight] = useState<GetFlight | undefined>();

  useEffect(() => {
    const load = async () => {
      try {
        await api.get('/api/users/auth/check');
        const { data } = await api.get(
          `http://localhost:3000/api/flights/${params.flightId}`,
        );
        setFlight(data);
        setLoading(false);
      } catch {
        window.location.href = '/login';
      }
    };

    load();
  }, []);

  if (isLoading || !flight) {
    return;
  }

  // if (isLoading) {
  //   return (
  //     <main className={styles.main}>
  //       <div className={styles.header}>
  //         <h1>Escolha seus assentos</h1>
  //         <span>Estamos carregando os dados se deu voo...</span>
  //       </div>
  //       <section className={styles.content}>
  //         <h2>Aguarde um momento, estamos carregando os dados de seu voo</h2>
  //       </section>
  //     </main>
  //   );
  // }
  // if (error) {
  //   return <h1>Falha</h1>;
  // }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Escolha seus assentos</h1>
        <span>
          {flight.departureAirport.name} para {flight.arrivalAirport.name}
        </span>
      </div>
      <SeatReservation flight={flight} />
    </main>
  );
}
