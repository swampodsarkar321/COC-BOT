import { Router } from 'express';
import { client } from '../coc.js';
import { tag } from '../helpers.js';

const router = Router();

router.get('/:tag', async (req, res, next) => {
  try {
    const clan: any = await client.getClan(tag(req.params.tag));
    res.json({
      name: clan.name,
      tag: clan.tag,
      level: clan.level,
      members: clan.members.length,
      clanPoints: clan.points,
      clanVersusPoints: clan.versusPoints,
      warWins: clan.warWins,
      warWinStreak: clan.warWinStreak,
      warLosses: clan.warLosses,
      badge: clan.badge?.urls?.large,
      description: clan.description,
      type: clan.type,
      location: clan.location?.name,
      memberList: clan.members.map((m: any) => ({
        name: m.name,
        tag: m.tag,
        role: m.role,
        trophies: m.trophies,
        versusTrophies: m.versusTrophies,
        townHallLevel: m.townHallLevel,
        league: m.league?.name,
        donations: m.donations,
        donationsReceived: m.donationsReceived,
        lastSeen: m.lastSeen,
        warStars: m.warStars
      }))
    });
  } catch (err) {
    next(err);
  }
});

export default router;
