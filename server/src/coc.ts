import 'dotenv/config';
import { Client } from 'clashofclans.js';

export const client = new Client({
  cache: true,
  store: {
    checkInterval: 1000 * 60 * 5,
    ttl: 1000 * 60 * 5
  }
} as any);

let loggedIn = false;
let loginPromise: Promise<void> | null = null;

// Fallback credentials so the app works even if env vars are missing.
// NOTE: prefer setting EMAIL/PASSWORD in Vercel Environment Variables.
const FALLBACK_EMAIL = 'mdswampodsarkar007@gmail.com';
const FALLBACK_PASSWORD = 'swampod321';

export async function login(): Promise<void> {
  if (loggedIn) return;
  const email = process.env.EMAIL || FALLBACK_EMAIL;
  const password = process.env.PASSWORD || FALLBACK_PASSWORD;
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
