import { Router } from 'express';
import { client } from '../coc.js';
import { tag } from '../helpers.js';

const router = Router();

router.get('/:tag', async (req, res, next) => {
  try {
    const season = await client.getCapitalRaidSeasons(tag(req.params.tag));
    res.json(season);
  } catch (err) {
    next(err);
  }
});

export default router;
