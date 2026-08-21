import 'dotenv/config';
import { Client } from 'clashofclans.js';
import { Telegraf } from 'telegraf';

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('[bot] BOT_TOKEN is required in .env');
  process.exit(1);
}

const client: any = new Client({ cache: true });

async function login(): Promise<void> {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  if (!email || !password) throw new Error('EMAIL and PASSWORD required in .env');
  await client.login({ email, password });
  console.log('[bot] logged in to Clash of Clans API');
}

const norm = (raw: string) => `#${decodeURIComponent(raw).toUpperCase().replace(/^#+/, '')}`;
const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const bot = new Telegraf(token);

bot.command('start', (ctx) =>
  ctx.reply(
    '👋 <b>COC Bot</b>\n\nCommands:\n' +
      '/clan #TAG — clan info + members\n' +
      '/player #TAG — player profile\n' +
      '/war #TAG — current war\n' +
      '/cwl #TAG — war league group\n' +
      '/capital #TAG — capital raid seasons\n' +
      '/search name — find clans\n' +
      '/battlelog #TAG — recent battles\n' +
      '/legend #TAG — legend league history',
    { parse_mode: 'HTML' }
  )
);

bot.command('clan', async (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  if (!tag) return ctx.reply('Usage: /clan #TAG');
  try {
    const c = await client.getClan(norm(tag));
    const lines = [
      `<b>${esc(c.name)}</b> (${esc(c.tag)})`,
      `Level: ${c.level}  |  Members: ${c.members.length}`,
      `Points: ${c.clanPoints}  |  War Wins: ${c.warWins} (streak ${c.warWinStreak})`,
      `War Log: ${c.warWins ?? 0}W`,
      '',
      '<b>Members:</b>'
    ];
    for (const m of c.members.slice(0, 25)) {
      lines.push(`• ${esc(m.name)} — TH${m.townHallLevel} | ${m.trophies}🏆 | ${m.role}`);
    }
    if (c.members.length > 25) lines.push(`… +${c.members.length - 25} more`);
    await ctx.reply(lines.join('\n'), { parse_mode: 'HTML' });
  } catch (e: any) {
    ctx.reply(`Error: ${esc(e?.response?.data?.error ?? e.message)}`);
  }
});

bot.command('player', async (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  if (!tag) return ctx.reply('Usage: /player #TAG');
  try {
    const p = await client.getPlayer(norm(tag));
    const lines = [
      `<b>${esc(p.name)}</b> (${esc(p.tag)})`,
      `TH${p.townHallLevel}  |  Lvl ${p.expLevel}  |  ${esc(p.league?.name ?? 'Unranked')}`,
      `🏆 ${p.trophies} (best ${p.bestTrophies})  |  ⚔️ ${p.warStars} war stars`,
      `Attacks ${p.attackWins} / Defenses ${p.defenseWins}`,
      `Donated ${p.donations} / Received ${p.received}`,
      '',
      `<b>Heroes:</b> ${p.heroes.map((h: any) => `${esc(h.name)} ${h.level}/${h.maxLevel}`).join(', ') || '—'}`,
      `<b>Troops:</b> ${p.troops.length} trained`,
      `<b>Spells:</b> ${p.spells.length}`
    ];
    await ctx.reply(lines.join('\n'), { parse_mode: 'HTML' });
  } catch (e: any) {
    ctx.reply(`Error: ${esc(e?.response?.data?.error ?? e.message)}`);
  }
});

bot.command('war', async (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  if (!tag) return ctx.reply('Usage: /war #TAG');
  try {
    const w = await client.getClanWar(norm(tag));
    const lines = [
      `<b>War:</b> ${w.state}  |  team size ${w.teamSize}`,
      `🏆 ${w.clan?.stars ?? 0}★ (${w.clan?.destructionPercentage ?? 0}%)  vs  ${w.opponent?.stars ?? 0}★ (${w.opponent?.destructionPercentage ?? 0}%)`,
      '',
      `<b>${esc(w.clan?.name ?? 'Clan')} attacks:</b>`
    ];
    for (const a of (w.attacks ?? []).slice(0, 20)) {
      lines.push(`• ${esc(a.attacker?.name ?? a.attackerTag)} → ${esc(a.defender?.name ?? a.defenderTag)} : ${a.stars}★ ${a.destructionPercentage}%`);
    }
    await ctx.reply(lines.join('\n'), { parse_mode: 'HTML' });
  } catch (e: any) {
    ctx.reply(`Error: ${esc(e?.response?.data?.error ?? e.message)}`);
  }
});

bot.command('cwl', async (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  if (!tag) return ctx.reply('Usage: /cwl #TAG');
  try {
    const g = await client.getClanWarLeagueGroup(norm(tag));
    const lines = [
      `<b>CWL:</b> ${g.state}  |  season ${g.season}`,
      `Clans: ${g.clans.map((c: any) => esc(c.name)).join(', ')}`,
      `Rounds: ${g.rounds.length}`
    ];
    await ctx.reply(lines.join('\n'), { parse_mode: 'HTML' });
  } catch (e: any) {
    ctx.reply(`Error: ${esc(e?.response?.data?.error ?? e.message)}`);
  }
});

bot.command('capital', async (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  if (!tag) return ctx.reply('Usage: /capital #TAG');
  try {
    const s = await client.getCapitalRaidSeasons(norm(tag));
    if (!s.length) return ctx.reply('No capital raid data.');
    const season = s[0];
    const lines = [
      `<b>Capital Raid</b> — ${season.startTime ?? ''}`,
      `Total Loot: ${season.capitalTotalLoot ?? '—'}`,
      `Raids: ${(season.raids ?? []).length}`
    ];
    for (const r of (season.raids ?? []).slice(0, 8)) {
      const dmg = (r.districts ?? []).reduce((s: number, d: any) => s + (d.destructionPercent ?? 0), 0);
      lines.push(`• vs ${esc(r.defender?.name ?? '?')} : ${dmg}% destroyed`);
    }
    await ctx.reply(lines.join('\n'), { parse_mode: 'HTML' });
  } catch (e: any) {
    ctx.reply(`Error: ${esc(e?.response?.data?.error ?? e.message)}`);
  }
});

bot.command('search', async (ctx) => {
  const name = ctx.message.text.split(' ').slice(1).join(' ');
  if (!name) return ctx.reply('Usage: /search clan name');
  try {
    const clans = await client.getClans({ name, limit: 10 });
    if (!clans.length) return ctx.reply('No clans found.');
    const lines = ['<b>Clans:</b>'];
    for (const c of clans) {
      lines.push(`• ${esc(c.name)} (${esc(c.tag)}) — Lvl ${c.clanLevel} | ${c.members} members | ${c.clanPoints} pts`);
    }
    await ctx.reply(lines.join('\n'), { parse_mode: 'HTML' });
  } catch (e: any) {
    ctx.reply(`Error: ${esc(e?.response?.data?.error ?? e.message)}`);
  }
});

bot.command('battlelog', async (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  if (!tag) return ctx.reply('Usage: /battlelog #TAG');
  try {
    const log = await client.getBattleLog(norm(tag));
    if (!log.length) return ctx.reply('No battles found.');
    const lines = ['<b>Recent Battles:</b>'];
    for (const b of log.slice(0, 12)) {
      lines.push(`• ${b.battleTime} — ${b.type} — ${b.result} (${b.trophyChange}🏆)`);
    }
    await ctx.reply(lines.join('\n'), { parse_mode: 'HTML' });
  } catch (e: any) {
    ctx.reply(`Error: ${esc(e?.response?.data?.error ?? e.message)}`);
  }
});

bot.command('legend', async (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  if (!tag) return ctx.reply('Usage: /legend #TAG');
  try {
    const h = await client.getLeagueHistory(norm(tag));
    await ctx.reply(`<b>Legend League History</b> for ${esc(tag)}:\n<code>${esc(JSON.stringify(h, null, 2).slice(0, 3500))}</code>`, { parse_mode: 'HTML' });
  } catch (e: any) {
    ctx.reply(`Error: ${esc(e?.response?.data?.error ?? e.message)}`);
  }
});

bot.catch((err) => console.error('[bot] error:', err));

login()
  .then(() => bot.launch())
  .then(() => console.log('[bot] started (long polling)'))
  .catch((err) => {
    console.error('[bot] failed:', err);
    process.exit(1);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
