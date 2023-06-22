'use client';
import styles from './styles.module.scss';

import Image from 'next/image';

export default function Success() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <img
          src="./logo.svg"
          alt="Logo escrito FastFly mas utilizando um simbolo de aviao como a letra 'A' na cor roxa"
          height={82.5}
          width={89.25}
        />
        <h1>Parabéns, seu pedido foi realizado</h1>
        <span>Cheque seu email, enviamos suas passagens por lá!</span>
      </div>
      <div className={styles.background}>
        <Image src="/login-bg.jpg" alt="A" fill={true} />
      </div>
    </main>
  );
}
