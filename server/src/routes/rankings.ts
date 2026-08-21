import { Router } from 'express';
import { client } from '../coc.js';

const router = Router();

router.get('/locations', async (_req, res, next) => {
  try {
    const locations = await client.getLocations();
    res.json(locations.map((l) => ({ id: l.id, name: l.name, isCountry: l.isCountry })));
  } catch (err) {
    next(err);
  }
});

router.get('/:locationId/clans', async (req, res, next) => {
  try {
    const clans: any[] = await client.getClanRanks(Number(req.params.locationId));
    res.json(clans.map((c) => ({ name: c.name, tag: c.tag, points: c.clanPoints, members: c.members })));
  } catch (err) {
    next(err);
  }
});

router.get('/:locationId/players', async (req, res, next) => {
  try {
    const players = await client.getPlayerRanks(Number(req.params.locationId));
    res.json(players.map((p) => ({ name: p.name, tag: p.tag, trophies: p.trophies, clan: p.clan?.name })));
  } catch (err) {
    next(err);
  }
});

export default router;
