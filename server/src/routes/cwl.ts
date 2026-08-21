import { Router } from 'express';
import { client } from '../coc.js';
import { tag } from '../helpers.js';

const router = Router();

router.get('/:tag', async (req, res, next) => {
  try {
    const group = await client.getClanWarLeagueGroup(tag(req.params.tag));
    res.json({
      state: group.state,
      season: group.season,
      clans: group.clans.map((c) => ({ name: c.name, tag: c.tag, badge: c.badge?.urls?.small })),
      rounds: group.rounds.map((r, i) => ({
        round: i + 1,
        warTags: r.warTags.filter((t) => t !== '#0')
      }))
    });
  } catch (err) {
    next(err);
  }
});

router.get('/war/:warTag', async (req, res, next) => {
  try {
    const war = await client.getClanWarLeagueRound(tag(req.params.warTag));
    res.json(
      war.map((w) => ({
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
    const war = await client.getCurrentWar(tag(req.params.tag));
    res.json({
      state: war.state,
      teamSize: war.teamSize,
      clan: war.clan && { name: war.clan.name, stars: war.clan.stars, destructionPercentage: war.clan.destructionPercentage },
      opponent: war.opponent && { name: war.opponent.name, stars: war.opponent.stars, destructionPercentage: war.opponent.destructionPercentage },
      attacks: (war.attacks ?? []).map((a) => ({
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
