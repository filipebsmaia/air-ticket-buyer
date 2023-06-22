'use client';
import styles from './styles.module.scss';

import Image from 'next/image';
import { useEffect } from 'react';
import { api } from '@/lib/api';

export default function Logout() {
  useEffect(() => {
    api.get('/api/users/auth/logout').then(() => {
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    });
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <img
          src="./logo.svg"
          alt="Logo escrito FastFly mas utilizando um simbolo de aviao como a letra 'A' na cor roxa"
          height={82.5}
          width={89.25}
        />
        <h1>Estamos realizando seu logout</h1>
        <span>Aguarde um momento...</span>
      </div>
      <div className={styles.background}>
        <Image src="/login-bg.jpg" alt="A" fill={true} />
      </div>
    </main>
  );
}
