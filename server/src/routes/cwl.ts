import { Router } from 'express';
import { client } from '../coc.js';
import { tag } from '../helpers.js';

const router = Router();

router.get('/:tag', async (req, res, next) => {
  try {
    const group: any = await client.getClanWarLeagueGroup(tag(req.params.tag));
    res.json({
      state: group.state,
      season: group.season,
      clans: group.clans.map((c: any) => ({ name: c.name, tag: c.tag, badge: c.badge?.urls?.small })),
      rounds: group.rounds.map((r: any, i: number) => ({
        round: i + 1,
        warTags: r.warTags.filter((t: any) => t !== '#0')
      }))
    });
  } catch (err) {
    next(err);
  }
});

router.get('/war/:warTag', async (req, res, next) => {
  try {
    const round: any = await client.getClanWarLeagueRound(tag(req.params.warTag));
    res.json(
      ([].concat(round)).map((w: any) => ({
        clan: { name: w.clan?.name, stars: w.clan?.stars, destructionPercentage: w.clan?.destructionPercentage },
        opponent: { name: w.opponent?.name, stars: w.opponent?.stars, destructionPercentage: w.opponent?.destructionPercentage }
      }))
    );
  } catch (err) {
    next(err);
  }
});

router.get('/:tag/currentwar', async (req, res, next) => {
  try {
    const war: any = await client.getCurrentWar(tag(req.params.tag));
    res.json({
      state: war.state,
      teamSize: war.teamSize,
      clan: war.clan && { name: war.clan.name, stars: war.clan.stars, destructionPercentage: war.clan.destructionPercentage },
      opponent: war.opponent && { name: war.opponent.name, stars: war.opponent.stars, destructionPercentage: war.opponent.destructionPercentage },
      attacks: ((war.attacks ?? []) as any[]).map((a: any) => ({
        attacker: a.attacker?.name,
        defender: a.defender?.name,
        stars: a.stars,
        destruction: a.destruction
      }))
    });
  } catch (err) {
    next(err);
  }
});

export default router;
