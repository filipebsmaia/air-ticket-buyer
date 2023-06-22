'use client';

import React, { JSX, useEffect, useState } from 'react';
import styles from './index.module.scss';
import Button from '../Button';
import Link from 'next/link';

import { api } from '@/lib/api';

const Header = (): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await api.get('/api/users/auth/check');
        setIsLogged(true);
      } catch {
        setIsLogged(false);
        //
      }
      setLoading(false);
    };

    load();
  }, []);

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
        </ul>
        <ul className={styles.left}>
          {!isLoading && (
            <>
              {!isLogged ? (
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
                    <Link href="/logout">Sair</Link>
                  </span>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
