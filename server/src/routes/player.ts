import { Router } from 'express';
import { client } from '../coc.js';
import { tag } from '../helpers.js';

const router = Router();

router.get('/:tag', async (req, res, next) => {
  try {
    const player = await client.getPlayer(tag(req.params.tag));
    res.json({
      name: player.name,
      tag: player.tag,
      townHallLevel: player.townHallLevel,
      townHallWeaponLevel: player.townHallWeaponLevel,
      expLevel: player.expLevel,
      trophies: player.trophies,
      bestTrophies: player.bestTrophies,
      warStars: player.warStars,
      attackWins: player.attackWins,
      defenseWins: player.defenseWins,
      builderHallLevel: player.builderHallLevel,
      builderBaseTrophies: player.builderBaseTrophies,
      bestBuilderBaseTrophies: player.bestBuilderBaseTrophies,
      donations: player.donations,
      received: player.received,
      clanCapitalContributions: player.clanCapitalContributions,
      role: player.role,
      warOptedIn: player.warOptedIn,
      clan: player.clan && { name: player.clan.name, tag: player.clan.tag },
      league: player.league?.name,
      leagueTier: player.leagueTier?.name,
      heroes: player.heroes.map((h) => ({ name: h.name, level: h.level, maxLevel: h.maxLevel })),
      heroEquipment: player.heroEquipment.map((e) => ({ name: e.name, level: e.level, maxLevel: e.maxLevel })),
      troops: player.troops.map((t) => ({ name: t.name, level: t.level, maxLevel: t.maxLevel, village: t.village })),
      spells: player.spells.map((s) => ({ name: s.name, level: s.level, maxLevel: s.maxLevel, village: s.village })),
      labels: player.labels.map((l) => ({ name: l.name, icon: l.icon?.urls?.small })),
      achievements: player.achievements.map((a) => ({ name: a.name, stars: a.stars, value: a.value, target: a.target })),
      legendStatistics: player.legendStatistics
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:tag/battlelog', async (req, res, next) => {
  try {
    const log = await client.getBattleLog(tag(req.params.tag));
    res.json(
      log.map((b: any) => ({
        battleTime: b.battleTime,
        type: b.type,
        result: b.result,
        trophies: b.trophyChange,
        opponent: b.opponent?.map((o: any) => ({ name: o.name, tag: o.tag }))
      }))
    );
  } catch (err) {
    next(err);
  }
});

router.get('/:tag/leaguehistory', async (req, res, next) => {
  try {
    const history = await client.getLeagueHistory(tag(req.params.tag));
    res.json(history);
  } catch (err) {
    next(err);
  }
});

export default router;
