import { useState, useRef, useEffect } from 'react';
import PlayerDetail, { PlayerCardInline } from './PlayerDetail';
import ClanCardInline from './ClanCard';
import {
  getClan,
  getPlayer,
  getWar,
  getCwl,
  getCapital,
  searchClans,
  getBattleLog,
  getLeagueHistory,
  getGoldPass,
  getWarLeagues,
  getClanLabels,
  getPlayerLabels
} from '../api';

const norm = (raw: string) => `#${raw.toUpperCase().replace(/^#+/, '')}`;

function errMsg(e: any): string {
  const d = e?.response?.data;
  if (typeof d === 'string') return d.slice(0, 300);
  const known = d?.error ?? d?.message ?? d?.reason ?? e?.message;
  if (known) return String(known);
  try {
    return JSON.stringify(d ?? e)?.slice(0, 300) ?? 'Unknown error';
  } catch {
    return 'Unknown error';
  }
}

type Msg = { from: 'me' | 'bot'; text?: string; full?: string; expanded?: boolean; player?: any; clan?: any };

const TAG_CMDS = ['/clan', '/player', '/war', '/cwl', '/capital', '/battlelog', '/legend'];
const PROMPT_CMDS = [...TAG_CMDS, '/search'];
const MENU = [
  { label: 'Clan', cmd: '/clan', icon: '🛡️' },
  { label: 'Player', cmd: '/player', icon: '🧝' },
  { label: 'War', cmd: '/war', icon: '⚔️' },
  { label: 'CWL', cmd: '/cwl', icon: '🏆' },
  { label: 'Capital', cmd: '/capital', icon: '🏛️' },
  { label: 'Search', cmd: '/search', icon: '🔎' },
  { label: 'Battle Log', cmd: '/battlelog', icon: '📜' },
  { label: 'Legend', cmd: '/legend', icon: '🏅' },
  { label: 'Leagues', cmd: '/leagues', icon: '🥇' },
  { label: 'Labels', cmd: '/labels', icon: '🏷️' },
  { label: 'Gold Pass', cmd: '/goldpass', icon: '💰' },
  { label: 'Developer', cmd: '/dev', icon: '👤' }
];

const DRAWER_MENU = [{ label: 'View Developer Profile', cmd: '/dev' }];

const LIMIT = 1800;

function BotAvatar({ small = false }: { small?: boolean }) {
  const [stage, setStage] = useState(0); // 0 png, 1 svg, 2 letter
  const src = stage === 0 ? '/bot-avatar.png' : stage === 1 ? '/bot-avatar.svg' : '';
  return (
    <div className={`bot-ava${small ? ' sm' : ''}`}>
      {stage === 2 ? 'C' : <img src={src} alt="COC Bot" onError={() => setStage(stage + 1)} />}
    </div>
  );
}

function now(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function runCommand(input: string): Promise<string> {
  const parts = input.trim().split(/\s+/);
  const cmd = (parts[0] || '').toLowerCase();
  const arg = parts.slice(1).join(' ');

  try {
    switch (cmd) {
      case '/start':
      case '/help':
        return [
          '👋 <b>COC Bot</b> — Telegram-style dashboard',
          '',
          '/clan #TAG — clan info + members',
          '/player #TAG — player profile',
          '/war #TAG — current war',
          '/cwl #TAG — war league group',
          '/capital #TAG — capital raid seasons',
          '/search name — find clans',
          '/battlelog #TAG — recent battles',
          '/legend #TAG — legend league history',
          '/leagues — war leagues',
          '/labels — clan/player labels',
          '/goldpass — current gold pass',
          '',
          'Tip: just send a #TAG to get both Player + Clan.'
        ].join('\n');

      case '/clan': {
        if (!arg) return 'Usage: /clan #TAG';
        const c = await getClan(norm(arg));
        let s = `👑 ${c.name} (${c.tag})\nLevel: ${c.level} | Members: ${c.members.length}\nPoints: ${c.clanPoints} | War Wins: ${c.warWins} (streak ${c.warWinStreak})`;
        s += '\n\nMembers:';
        c.memberList.forEach((m: any) => {
          s += `\n• ${m.name} — TH${m.townHallLevel} | ${m.trophies}🏆 | ${m.role}`;
        });
        return s;
      }

      case '/player': {
        if (!arg) return 'Usage: /player #TAG';
        const p = await getPlayer(norm(arg));
        return [
          `🛡️ ${p.name} (${p.tag})`,
          `TH${p.townHallLevel} | Lvl ${p.expLevel} | ${p.league ?? 'Unranked'}`,
          `🏆 ${p.trophies} (best ${p.bestTrophies}) | ⚔️ ${p.warStars} war stars`,
          `Atk ${p.attackWins} / Def ${p.defenseWins}`,
          `Donated ${p.donations} / Recv ${p.received}`,
          '',
          `Heroes: ${p.heroes.map((h: any) => `${h.name} ${h.level}/${h.maxLevel}`).join(', ') || '—'}`,
          `Troops: ${p.troops.length} | Spells: ${p.spells.length}`
        ].join('\n');
      }

      case '/war': {
        if (!arg) return 'Usage: /war #TAG';
        const w = await getWar(norm(arg));
        let s = `⚔️ War: ${w.state} | team ${w.teamSize}\n${w.clan?.stars ?? 0}★ (${w.clan?.destructionPercentage ?? 0}%) vs ${w.opponent?.stars ?? 0}★ (${w.opponent?.destructionPercentage ?? 0}%)`;
        s += `\n\n${w.clan?.name ?? 'Clan'} attacks:`;
        (w.attacks ?? []).forEach((a: any) => {
          s += `\n• ${a.attacker} → ${a.defender} : ${a.stars}★ ${a.destruction}%`;
        });
        return s;
      }

      case '/cwl': {
        if (!arg) return 'Usage: /cwl #TAG';
        const g = await getCwl(norm(arg));
        return `🏆 CWL: ${g.state} | season ${g.season}\nClans: ${g.clans.map((c: any) => c.name).join(', ')}\nRounds: ${g.rounds.length}`;
      }

      case '/capital': {
        if (!arg) return 'Usage: /capital #TAG';
        const seasons = await getCapital(norm(arg));
        if (!seasons.length) return 'No capital raid data.';
        const season: any = seasons[0];
        let s = `🏛️ Capital Raid — ${season.startTime}\nTotal Loot: ${season.capitalTotalLoot ?? '—'}\nRaids: ${(season.raids ?? []).length}`;
        (season.raids ?? []).forEach((r: any) => {
          const dmg = (r.districts ?? []).reduce((a: number, d: any) => a + (d.destructionPercent ?? 0), 0);
          s += `\n• vs ${r.defender?.name ?? '?'} : ${dmg}% destroyed`;
        });
        return s;
      }

      case '/search': {
        if (!arg) return 'Usage: /search clan name';
        const clans = await searchClans(arg);
        if (!clans.length) return 'No clans found.';
        let s = '🔎 Clans:';
        clans.forEach((c: any) => {
          s += `\n• ${c.name} (${c.tag}) — Lvl ${c.level} | ${c.members} members | ${c.points} pts`;
        });
        return s;
      }

      case '/battlelog': {
        if (!arg) return 'Usage: /battlelog #TAG';
        const log = await getBattleLog(norm(arg));
        if (!log.length) return 'No battles found.';
        let s = '⚔️ Recent Battles:';
        log.forEach((b: any) => {
          s += `\n• ${b.battleTime} — ${b.type} — ${b.result} (${b.trophies}🏆)`;
        });
        return s;
      }

      case '/legend': {
        if (!arg) return 'Usage: /legend #TAG';
        const h = await getLeagueHistory(norm(arg));
        return `🏅 Legend League History ${norm(arg)}:\n${JSON.stringify(h, null, 2)}`;
      }

      case '/leagues': {
        const l = await getWarLeagues();
        return `🏆 War Leagues:\n${l.map((x: any) => `• ${x.name}`).join('\n')}`;
      }

      case '/labels': {
        const [cl, pl] = await Promise.all([getClanLabels(), getPlayerLabels()]);
        return `🏷️ Clan Labels:\n${cl.map((x: any) => `• ${x.name}`).join('\n')}\n\nPlayer Labels:\n${pl.map((x: any) => `• ${x.name}`).join('\n')}`;
      }

      case '/goldpass': {
        const g = await getGoldPass();
        return `💰 Gold Pass\nSeason: ${g.id ?? g.name ?? '—'}\n${g.startTime ?? ''} → ${g.endTime ?? ''}`;
      }

      default:
        return `Unknown command: ${cmd}\nType /help to see commands.`;
    }
  } catch (e: any) {
    return `Error: ${errMsg(e)}`;
  }
}

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: 'bot',
      text:
        '👋 Welcome to COC Bot!\n\n' +
        "I'm your Clash of Clans assistant. Here's how to get started:\n" +
        '• Send a player/clan #TAG → get Player + Clan together\n' +
        '• Tap the buttons below for quick actions\n' +
        '• Tap ☰ → View Developer Profile\n\n' +
        'Try it now:  #GRL2PJ892'
    }
  ]);
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastTag, setLastTag] = useState('#GRL2PJ892');
  const [pending, setPending] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState('Message COC Bot…  e.g. #GRL2PJ892 or /clan #TAG');
  const [detail, setDetail] = useState<{ tag: string; player: any } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  const pushBot = (full: string) => {
    setMessages((m) =>
      full.length > LIMIT
        ? [...m, { from: 'bot', text: full.slice(0, LIMIT) + '\n\n— tap More for full data —', full }]
        : [...m, { from: 'bot', text: full }]
    );
  };

  const handlePlayer = async (raw: string) => {
    const nt = norm(raw);
    setLastTag(nt);
    try {
      const data = await getPlayer(nt);
      setMessages((m) => [...m, { from: 'bot', player: data }]);
    } catch (e: any) {
      pushBot('❌ ' + errMsg(e));
    }
  };

  const handleClan = async (raw: string) => {
    const nt = norm(raw);
    setLastTag(nt);
    try {
      const data = await getClan(nt);
      setMessages((m) => [...m, { from: 'bot', clan: data }]);
    } catch (e: any) {
      pushBot('❌ ' + errMsg(e));
    }
  };

  const send = async (text: string) => {
    const t = text.trim();
    if (!t) return;

    // Guided prompt mode: a menu item asked for a tag
    if (pending) {
      const cmd = pending;
      setPending(null);
      setPlaceholder('Message COC Bot…  e.g. #GRL2PJ892 or /clan #TAG');
      setInput('');
      if (t.startsWith('/')) {
        setMessages((m) => [...m, { from: 'me', text: t }]);
        const tag = t.match(/#\w+/);
        if (tag) setLastTag(tag[0].toUpperCase());
        pushBot(await runCommand(t));
        return;
      }
      const arg = cmd === '/search' ? t : t.startsWith('#') ? norm(t) : `#${t.toUpperCase().replace(/^#+/, '')}`;
      setMessages((m) => [...m, { from: 'me', text: t }]);
      if (cmd !== '/search') setLastTag(arg);
      if (cmd === '/player') await handlePlayer(arg);
      else if (cmd === '/clan') await handleClan(arg);
      else pushBot(await runCommand(`${cmd} ${arg}`));
      return;
    }

    if (t.toLowerCase().startsWith('player ')) {
      setMessages((m) => [...m, { from: 'me', text: t }]);
      setInput('');
      await handlePlayer(t.slice(7));
      return;
    }
    if (t.toLowerCase().startsWith('clan ')) {
      setMessages((m) => [...m, { from: 'me', text: t }]);
      setInput('');
      await handleClan(t.slice(5));
      return;
    }
    if (t.toLowerCase() === '/dev') {
      setMessages((m) => [...m, { from: 'me', text: t }]);
      setInput('');
      pushBot('👤 Developer Profile');
      await handlePlayer('LUJ2U22RQ');
      return;
    }

    const tagOnly = t.match(/^#\w+$/i);
    if (tagOnly) {
      const nt = norm(t);
      setMessages((m) => [...m, { from: 'me', text: t }]);
      setInput('');
      setLastTag(nt);
      await handlePlayer(nt);
      await handleClan(nt);
      return;
    }
    setMessages((m) => [...m, { from: 'me', text: t }]);
    setInput('');
    const tag = t.match(/#\w+/);
    if (tag) setLastTag(tag[0].toUpperCase());
    pushBot(await runCommand(t));
  };

  const sendMenu = (cmd: string) => {
    setMenuOpen(false);
    if (PROMPT_CMDS.includes(cmd)) {
      const label = MENU.find((m) => m.cmd === cmd)?.label ?? 'clan';
      const isSearch = cmd === '/search';
      const promptText = isSearch
        ? 'Type clan name (e.g. Order):'
        : `Type ${label} tag (e.g. #GRL2PJ892):`;
      const ph = isSearch ? 'Type clan name…  e.g. Order' : `Type ${label} tag…  e.g. #GRL2PJ892`;
      setPending(cmd);
      setPlaceholder(ph);
      setMessages((m) => [...m, { from: 'bot', text: `👉 ${promptText}` }]);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      send(cmd);
    }
  };

  const expand = (i: number) => {
    setMessages((m) => m.map((msg, idx) => (idx === i && msg.full ? { ...msg, expanded: true } : msg)));
  };

  return (
    <div className="chat-app">
      <div className="chat-head">
        <BotAvatar />
        <div>
          <div className="title">COC Bot</div>
          <div className="status">online</div>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="menu">
          ☰
        </button>

        {menuOpen && (
          <div className="menu-drawer">
            {DRAWER_MENU.map((m) => (
              <button key={m.cmd} className="menu-item" onClick={() => sendMenu(m.cmd)}>
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="chat-body" ref={bodyRef}>
        {messages.map((m, i) => {
          let inner;
          if (m.from === 'bot' && m.player) {
            inner = (
              <>
                <PlayerCardInline player={m.player} />
                <button className="more-btn" onClick={() => setDetail({ tag: m.player.tag, player: m.player })}>
                  View full details
                </button>
                <div className="meta">{now()}</div>
              </>
            );
          } else if (m.from === 'bot' && m.clan) {
            inner = (
              <>
                <ClanCardInline clan={m.clan} onMember={(tag) => setDetail({ tag, player: undefined })} />
                <div className="meta">{now()}</div>
              </>
            );
          } else {
            inner = (
              <>
                {m.expanded && m.full ? m.full : m.text}
                {m.full && !m.expanded && (
                  <button className="more-btn" onClick={() => expand(i)}>
                    More
                  </button>
                )}
                <div className="meta">{now()}</div>
              </>
            );
          }
          if (m.from === 'bot') {
            return (
              <div key={i} className="row bot-row">
                <BotAvatar small />
                <div className="bubble bot">{inner}</div>
              </div>
            );
          }
          return (
            <div key={i} className="row me-row">
              <div className={`bubble ${m.from}`}>{inner}</div>
            </div>
          );
        })}
      </div>

      <div className="quick-row">
        {MENU.map((m) => (
          <button key={m.cmd} className="quick-btn" onClick={() => sendMenu(m.cmd)}>
            <span className="q-icon">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      <div className="chat-input">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send(input);
          }}
        />
        <button onClick={() => send(input)}>Send</button>
      </div>

      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span>Player Details</span>
              <button className="menu-btn" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="modal-body">
              <PlayerDetail tag={detail.tag} player={detail.player} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
