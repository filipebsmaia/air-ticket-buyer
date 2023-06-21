'use client';
import Input from '@/components/Input';
import styles from './styles.module.scss';

import Button from '@/components/Button';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    api.get('/api/users/auth/logout');
  }, []);

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/api/users/auth', {
        email,
        password,
      });

      router.push('/');
    } catch (err) {
      const error = err as unknown as AxiosError;
      setEmail('');
      setPassword('');

      if (!error.isAxiosError) {
        setError('Erro desconhecido');
        return;
      }
      setError('Credenciais inválidas');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <img
          src="./logo.svg"
          alt="Logo escrito FastFly mas utilizando um simbolo de aviao como a letra 'A' na cor roxa"
          height={82.5}
          width={89.25}
        />
        <h1>Entre em sua conta</h1>
        <span>Bem vindo de volta! Por favor, insira seus dados.</span>

        <form className={styles.form} onSubmit={handleCreateUser}>
          <Input
            text="E-mail"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <br />
          <Input
            text="Senha"
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {error && (
            <>
              <span>{error}</span>
            </>
          )}
          <br />
          <Button type="submit">Entrar</Button>
        </form>

        <span className={styles.createAccount}>
          Não possui uma conta? <Link href="/">Cadastre-se</Link>
        </span>
      </div>
      <div className={styles.background}>
        <Image src="/login-bg.jpg" alt="A" fill={true} />
      </div>
    </main>
  );
}
