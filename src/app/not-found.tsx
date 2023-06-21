import styles from './not-found.module.scss';

import Link from 'next/link';
export default async function NotFound() {
  return (
    <main className={styles.main}>
      <h1>Página não encontrada</h1>
      <Link href="/">
        <h2>Clique aqui para retornar para a página principal</h2>
      </Link>
    </main>
  );
}
