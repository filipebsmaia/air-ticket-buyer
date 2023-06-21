'use client';
import Input from '@/components/Input';
import { DateRange } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import styles from './styles.module.scss';

import Image from 'next/image';
import { useState } from 'react';
import Button from '@/components/Button';
import FlightSelectorItem from '@/components/FlightSelectorItem';

import {
  Airline,
  Airplane,
  Airport,
  Flight,
  Pilot,
  Seat,
} from '@prisma/client';
import Link from 'next/link';

type GetFlights = Array<
  Flight & {
    airline: Airline;
    airplane: Airplane;
    arrivalAirport: Airport;
    departureAirport: Airport;
    pilot: Pilot;
    seats: Seat[];
  }
>;

const getFlights = async (): Promise<GetFlights> => {
  const flights = await fetch('http://localhost:3000/api/flights');

  const jsonFlights = (await flights.json()) as GetFlights;

  const parsedFlights = jsonFlights.map((flight) => ({
    ...flight,
    expectedArrivalDate: new Date(flight.expectedArrivalDate),
    departureDate: new Date(flight.departureDate),
  }));

  return parsedFlights;
};

export default async function Home() {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const flights = await getFlights();

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.banner}>
          <div className={styles.banner_text}>
            <h2>Destinos nacionais e internacionais</h2>
          </div>
          <div className={styles.background}>
            <Image src="/beach-banner.jpg" alt="A" fill={true} />
          </div>
        </div>

        <div className={styles.selector}>
          <Input placeholder="Digite a origem" />
          <Input placeholder="Digite o destino" />
          <DateRange
            editableDateInputs={true}
            minDate={new Date()}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
          />
          <Button>Procurar</Button>
        </div>

        <section className={styles.flights}>
          <ul>
            {flights.map((flight, index) => {
              return (
                <li key={flight.id}>
                  <Link href={`/seat-selector/${flight.id}`}>
                    <FlightSelectorItem
                      recomended={index <= 3}
                      departureAirport={flight.departureAirport}
                      departureDate={flight.departureDate}
                      arrivalAirport={flight.arrivalAirport}
                      arrivalDate={flight.expectedArrivalDate}
                      value={flight.value}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
