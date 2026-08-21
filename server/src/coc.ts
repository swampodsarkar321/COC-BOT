import 'dotenv/config';
import { Client } from 'clashofclans.js';

export const client = new Client({
  cache: true,
  store: {
    checkInterval: 1000 * 60 * 5,
    ttl: 1000 * 60 * 5
  }
});

let loggedIn = false;
let loginPromise: Promise<void> | null = null;

export async function login(): Promise<void> {
  if (loggedIn) return;
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  if (!email || !password) {
    throw new Error('EMAIL and PASSWORD must be set in .env');
  }
  await client.login({ email, password });
  loggedIn = true;
  console.log('[coc] logged in to Clash of Clans API');
}

// Memoized login promise — safe to call from serverless handlers.
export function ready(): Promise<void> {
  if (!loginPromise) {
    loginPromise = login().catch((e) => {
      loginPromise = null;
      throw e;
    });
  }
  return loginPromise;
}

export function isReady(): boolean {
  return loggedIn;
}

export async function reload(): Promise<void> {
  loggedIn = false;
  loginPromise = null;
  await login();
}
