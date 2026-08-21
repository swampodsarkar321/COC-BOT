import { app } from '../server/dist/index.js';
import { ready } from '../server/dist/coc.js';

export default async function handler(req: any, res: any) {
  try {
    await ready();
  } catch (e) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'COC login failed: ' + (e instanceof Error ? e.message : String(e)) }));
    return;
  }
  return app(req, res);
}
