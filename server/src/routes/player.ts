import { Router } from 'express';
import { client } from '../coc.js';
import { tag } from '../helpers.js';

const router = Router();

router.get('/:tag', async (req, res, next) => {
  try {
    const p: any = await client.getPlayer(tag(req.params.tag));
    res.json({
      name: p.name,
      tag: p.tag,
      townHallLevel: p.townHallLevel,
      townHallWeaponLevel: p.townHallWeaponLevel,
      expLevel: p.expLevel,
      trophies: p.trophies,
      bestTrophies: p.bestTrophies,
      warStars: p.warStars,
      attackWins: p.attackWins,
      defenseWins: p.defenseWins,
      builderHallLevel: p.builderHallLevel,
      builderBaseTrophies: p.builderBaseTrophies,
      bestBuilderBaseTrophies: p.bestBuilderBaseTrophies,
      donations: p.donations,
      received: p.received,
      clanCapitalContributions: p.clanCapitalContributions,
      role: p.role,
      warOptedIn: p.warOptedIn,
      clan: p.clan && { name: p.clan.name, tag: p.clan.tag },
      league: p.league?.name,
      leagueTier: p.leagueTier?.name,
      heroes: p.heroes.map((h: any) => ({ name: h.name, level: h.level, maxLevel: h.maxLevel })),
      heroEquipment: p.heroEquipment.map((e: any) => ({ name: e.name, level: e.level, maxLevel: e.maxLevel })),
      troops: p.troops.map((t: any) => ({ name: t.name, level: t.level, maxLevel: t.maxLevel, village: t.village })),
      spells: p.spells.map((s: any) => ({ name: s.name, level: s.level, maxLevel: s.maxLevel, village: s.village })),
      labels: p.labels.map((l: any) => ({ name: l.name, icon: l.icon?.urls?.small ?? l.icon?.url })),
      achievements: p.achievements.map((a: any) => ({ name: a.name, stars: a.stars, value: a.value, target: a.target })),
      legendStatistics: p.legendStatistics
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
