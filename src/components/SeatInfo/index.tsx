import React, { JSX } from 'react';
import styles from './styles.module.scss';
import { IconType } from 'react-icons';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { calculePrice } from '@/utils/calculePrice';
import { formatPrice } from '@/utils/formatPrice';

interface SeatInfoProps {
  title: string;
  value: number;
  isExecutive?: boolean;
  perks: Array<{
    icon: IconType;
    text: string;
  }>;
}

const SeatInfo = ({
  title,
  value,
  isExecutive,
  perks,
}: SeatInfoProps): JSX.Element => {
  const { common, executive } = calculePrice(value);

  return (
    <section
      className={`${styles.container} ${isExecutive ? styles.executive : ''}`}
    >
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.icon}>
            <MdAirlineSeatReclineExtra size={24} />
          </div>
          <strong>{title}</strong>
        </div>

        <div className={styles.price}>
          <span>A partir de</span>
          <strong>
            {isExecutive ? formatPrice(executive) : formatPrice(common)}
          </strong>
        </div>
      </div>
      <div className={styles.body}>
        <ul>
          {perks.map(({ text, icon: Icon }) => {
            return (
              <li key={text}>
                <div>
                  <Icon size={20} />
                </div>
                <span>{text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default SeatInfo;
