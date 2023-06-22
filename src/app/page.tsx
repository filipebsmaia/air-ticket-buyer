'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { addDays, format } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import Link from 'next/link';
import { ptBR } from 'date-fns/locale';

import {
  Airline,
  Airplane,
  Airport,
  Flight,
  Pilot,
  Seat,
} from '@prisma/client';
import FlightSelectorItem from '@/components/FlightSelectorItem';

import styles from './styles.module.scss';
import 'react-day-picker/dist/style.css';

interface GetFlightsProps {
  departureAirport?: string;
  arrivalAirport?: string;
  arrivalDate?: Date;
  departureDate?: Date;
}

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

type GetCities = Array<{
  city: string;
  state: string;
}>;

interface Options {
  value: string;
  label: string;
}

const getFlights = async ({
  arrivalAirport,
  arrivalDate,
  departureAirport,
  departureDate,
}: GetFlightsProps): Promise<GetFlights> => {
  const flights = await fetch(
    `http://localhost:3000/api/flights? ${new URLSearchParams({
      arrivalDate: arrivalDate?.toISOString() || '',
      departureAirport: departureAirport || '',
      departureDate: departureDate?.toISOString() || '',
      arrivalAirport: arrivalAirport || '',
    })}`,
  );

  const jsonFlights = (await flights.json()) as GetFlights;

  const parsedFlights = jsonFlights.map((flight) => ({
    ...flight,
    expectedArrivalDate: new Date(flight.expectedArrivalDate),
    departureDate: new Date(flight.departureDate),
  }));

  return parsedFlights;
};

const getCities = async (): Promise<GetCities> => {
  const flights = await fetch('http://localhost:3000/api/cities');
  const cities = (await flights.json()) as GetCities;
  return cities;
};

export default function Home() {
  const [pickerIsHidden, setPickerIsHidden] = useState(true);

  const [flights, setFlights] = useState<GetFlights>([]);
  const [cities, setCities] = useState<GetCities>([]);

  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  useEffect(() => {
    const load = async () => {
      const data: GetCities = await getCities();
      setCities(data);
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      const data: GetFlights = await getFlights({
        departureAirport,
        arrivalAirport,
        departureDate: dateRange!.from,
        arrivalDate: dateRange!.to,
      });
      setFlights(data);
    };

    if (dateRange?.from && dateRange.to) {
      load();
    }
  }, [arrivalAirport, departureAirport, dateRange]);

  const loadCities = (
    inputValue: string,
    callback: (options: Array<Options>) => void,
  ) => {
    let filtered = cities;

    if (inputValue) {
      filtered = cities.filter(
        ({ city, state }) =>
          city.toLowerCase().includes(inputValue.toLowerCase()) ||
          state.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }
    const filteredCities = filtered.map(({ city }) => {
      return { value: city, label: city };
    });

    callback(filteredCities);
  };

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

        <div className={styles.filter}>
          <AsyncSelect
            isLoading={false}
            placeholder="Escolha a origem"
            className={styles.selector}
            cacheOptions
            loadOptions={loadCities}
            onChange={(v) => {
              setDepartureAirport(v?.value || '');
            }}
            noOptionsMessage={() => 'Escreva a origem'}
          />

          <AsyncSelect
            isLoading={false}
            placeholder="Escolha o destino"
            className={styles.selector}
            cacheOptions
            loadOptions={loadCities}
            onChange={(v) => {
              setArrivalAirport(v?.value || '');
            }}
            noOptionsMessage={() => 'Escreva o destino'}
          />
          <div
            className={`${styles.calendar} ${
              pickerIsHidden ? styles.hidden : ''
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setPickerIsHidden((state) => !state);
              }}
            >
              {dateRange?.from &&
                dateRange?.to &&
                `de ${format(dateRange.from!, 'dd/MM')} até ${format(
                  dateRange.to!,
                  'dd/MM',
                )}`}
            </button>
            <DayPicker
              mode="range"
              defaultMonth={new Date()}
              locale={ptBR}
              selected={dateRange}
              onSelect={(range) => {
                console.log(range);
                setDateRange(range);
              }}
            />
          </div>
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
