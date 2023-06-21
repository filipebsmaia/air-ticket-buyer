import { RequestInit } from 'next/dist/server/web/spec-extension/request';

export const fetcher = (
  input: Request | string | URL,
  init?: RequestInit | undefined,
) => fetch(input, init).then((res) => res.json());
