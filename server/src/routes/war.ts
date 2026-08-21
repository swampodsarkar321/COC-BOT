import { Router } from 'express';
import { client } from '../coc.js';
import { tag } from '../helpers.js';

const router = Router();

router.get('/:tag/current', async (req, res, next) => {
  try {
    const war: any = await client.getClanWar(tag(req.params.tag));
    res.json({
      state: war.state,
      teamSize: war.teamSize,
      preparationStartTime: war.preparationStartTime,
      startTime: war.startTime,
      endTime: war.endTime,
      clan: war.clan && {
        name: war.clan.name,
        tag: war.clan.tag,
        stars: war.clan.stars,
        destructionPercentage: war.clan.destructionPercentage,
        attacks: war.clan.attacks?.length ?? 0
      },
      opponent: war.opponent && {
        name: war.opponent.name,
        tag: war.opponent.tag,
        stars: war.opponent.stars,
        destructionPercentage: war.opponent.destructionPercentage,
        attacks: war.opponent.attacks?.length ?? 0
      },
      attacks: ((war.attacks ?? []) as any[]).map((a: any) => ({
        order: a.order,
        attacker: a.attacker?.name,
        attackerTag: a.attackerTag,
        defender: a.defender?.name,
        defenderTag: a.defenderTag,
        stars: a.stars,
        destruction: a.destruction,
        duration: a.duration
      })),
      members: ((war.clan?.members ?? []) as any[]).map((m: any) => ({
        name: m.name,
        tag: m.tag,
        mapPosition: m.mapPosition,
        townHallLevel: m.townHallLevel,
        attacks: (m.attacks ?? []).length,
        stars: (m.attacks ?? []).reduce((s: number, a: any) => s + a.stars, 0),
        defenseCount: m.defenseCount
      }))
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:tag/log', async (req, res, next) => {
  try {
    const log = await client.getClanWarLog(tag(req.params.tag));
    res.json(
      log.map((w) => ({
        result: w.result,
        endTime: w.endTime,
        teamSize: w.teamSize,
        clanStars: w.clan?.stars,
        opponentStars: w.opponent?.stars,
        opponentName: w.opponent?.name
      }))
    );
  } catch (err) {
    next(err);
  }
});

export default router;
