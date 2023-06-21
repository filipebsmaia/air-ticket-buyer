import React, { JSX } from 'react';
import styles from './index.module.scss';
import Button from '../Button';
import Link from 'next/link';
import { cookies } from 'next/headers';

const Header = (): JSX.Element => {
  const cookieStore = cookies();
  const isLoggedin = cookieStore.has('authorization');
  return (
    <header className={styles.header}>
      <img
        src="/logo-with-name.svg"
        alt="Logo escrito FastFly mas utilizando um simbolo de aviao como a letra 'A' na cor roxa"
        height={32}
        width={169}
      />
      <nav className={styles.nav}>
        <ul className={styles.main}>
          <li>
            <span>
              <Link href="/">Destinos</Link>
            </span>
          </li>
          <li>
            <span>
              <Link href="#flights">Meus voos</Link>
            </span>
          </li>
        </ul>
        <ul className={styles.left}>
          {!isLoggedin ? (
            <>
              <li>
                <span>
                  <Link href="/login">Login</Link>
                </span>
              </li>
              <li>
                <Button>Criar conta</Button>
              </li>
            </>
          ) : (
            <li>
              <span>
                <Link href="/login">Sair</Link>
              </span>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
