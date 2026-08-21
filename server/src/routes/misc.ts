import { Router } from 'express';
import { client } from '../coc.js';
import { tag } from '../helpers.js';

const router = Router();

router.get('/goldpass', async (_req, res, next) => {
  try {
    const gp = await client.getGoldPassSeason();
    res.json(gp);
  } catch (err) {
    next(err);
  }
});

router.get('/leagues/war', async (_req, res, next) => {
  try {
    const leagues = await client.getWarLeagues();
    res.json(leagues.map((l: any) => ({ id: l.id, name: l.name, icon: l.icon?.urls?.small })));
  } catch (err) {
    next(err);
  }
});

router.get('/leagues/capital', async (_req, res, next) => {
  try {
    const leagues = await client.getCapitalLeagues();
    res.json(leagues.map((l: any) => ({ id: l.id, name: l.name, icon: l.icon?.urls?.small })));
  } catch (err) {
    next(err);
  }
});

router.get('/leagues/builder', async (_req, res, next) => {
  try {
    const leagues = await client.getBuilderBaseLeagues();
    res.json(leagues.map((l: any) => ({ id: l.id, name: l.name, icon: l.icon?.urls?.small })));
  } catch (err) {
    next(err);
  }
});

router.get('/leagues/tiers', async (_req, res, next) => {
  try {
    const tiers = await client.getLeaguesTiers();
    res.json(tiers.map((t: any) => ({ id: t.id, name: t.name, icon: t.icon?.urls?.small })));
  } catch (err) {
    next(err);
  }
});

router.get('/labels/clan', async (_req, res, next) => {
  try {
    const labels = await client.getClanLabels();
    res.json(labels.map((l: any) => ({ id: l.id, name: l.name, icon: l.icon?.urls?.small })));
  } catch (err) {
    next(err);
  }
});

router.get('/labels/player', async (_req, res, next) => {
  try {
    const labels = await client.getPlayerLabels();
    res.json(labels.map((l: any) => ({ id: l.id, name: l.name, icon: l.icon?.urls?.small })));
  } catch (err) {
    next(err);
  }
});

router.get('/clans/search', async (req, res, next) => {
  try {
    const name = String(req.query.name ?? '');
    if (!name) return res.json([]);
    const clans = await client.getClans({ name, limit: 20 });
    res.json(
      clans.map((c: any) => ({
        name: c.name,
        tag: c.tag,
        level: c.clanLevel,
        members: c.members,
        points: c.clanPoints,
        badge: c.badge?.urls?.small,
        warFrequency: c.warFrequency,
        location: c.location?.name
      }))
    );
  } catch (err) {
    next(err);
  }
});

router.get('/rankings/:loc/builder', async (req, res, next) => {
  try {
    const id: number | 'global' = req.params.loc === 'global' ? 'global' : Number(req.params.loc);
    const clans: any[] = await client.getBuilderBaseClanRanks(id);
    res.json(clans.map((c) => ({ name: c.name, tag: c.tag, points: c.clanPoints, members: c.members })));
  } catch (err) {
    next(err);
  }
});

router.get('/rankings/:loc/capital', async (req, res, next) => {
  try {
    const id: number | 'global' = req.params.loc === 'global' ? 'global' : Number(req.params.loc);
    const clans: any[] = await client.getClanCapitalRanks(id);
    res.json(clans.map((c) => ({ name: c.name, tag: c.tag, points: c.clanPoints, members: c.members })));
  } catch (err) {
    next(err);
  }
});

export default router;
