import React, { JSX } from 'react';
import styles from './index.module.scss';
import { Airport } from '@prisma/client';
import { format, formatDistance } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface FlightSelectorItemProps {
  departureAirport: Airport;
  departureDate: Date;
  arrivalAirport: Airport;
  arrivalDate: Date;
  value: number;
  recomended?: boolean;
}

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const FlightSelectorItem = ({
  departureAirport,
  departureDate,
  arrivalAirport,
  arrivalDate,
  value,
  recomended,
}: FlightSelectorItemProps): JSX.Element => {
  const duration = formatDistance(arrivalDate, departureDate, {
    addSuffix: false,
    locale: ptBR,
  });

  return (
    <div className={`${styles.container} ${recomended && styles.recomended}`}>
      <ul>
        <li className={styles.airport}>
          <div>
            <strong>{format(departureDate, 'HH:mm')}</strong>
            <span>{departureAirport.slug}</span>
          </div>
        </li>
        <li className={styles.duration}>
          <div>
            <span>Duração</span>
            <span>{duration}</span>
          </div>
        </li>
        <li className={styles.airport}>
          <div>
            <strong>{format(arrivalDate, 'HH:mm')}</strong>
            <span>{arrivalAirport.slug}</span>
          </div>
        </li>
        <li className={styles.fare}>
          <div>
            <span>Tarifa a partir de</span>
            <strong>{numberFormatter.format(value)}</strong>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default FlightSelectorItem;
