import { useState, useEffect, useRef } from 'react';
import { getPlayer } from '../api';
import { unitImage } from '../unitImage';
import { saveCard } from '../png';

function Icon({ name, type }: { name: string; type: 'troops' | 'spells' | 'heroes' }) {
  const [err, setErr] = useState(false);
  if (err) return <span className="uc-fallback">{name.charAt(0)}</span>;
  return (
    <img className="uc-icon" src={unitImage(name, type)} alt={name} loading="lazy" onError={() => setErr(true)} />
  );
}

function UnitCard({ items, type }: { items: any[]; type: 'troops' | 'spells' | 'heroes' }) {
  return (
    <div className="unit-grid">
      {items.map((u) => (
        <div className="unit-card" key={u.name}>
          <Icon name={u.name} type={type} />
          <div className="uc-name">{u.name}</div>
          <div className="uc-lvl">
            {u.level}
            <small> / {u.maxLevel}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PlayerCardInline({ player }: { player: any }) {
  const ref = useRef<HTMLDivElement>(null);

  const save = async () => {
    try {
      await saveCard(ref.current, `coc-player-${player.tag.replace(/^#/, '')}.png`);
    } catch (e) {
      alert('PNG export failed: ' + ((e as Error)?.message ?? e));
    }
  };

  return (
    <>
      <div className="pc-inline" ref={ref}>
        <div className="pc-inline-head">
          <div className="pc-av">{player.name.charAt(0)}</div>
          <div className="pc-inline-id">
            <div className="pc-inline-name">{player.name}</div>
            <div className="pc-inline-sub">{player.tag} · TH{player.townHallLevel} · {player.league ?? 'Unranked'} · Lvl {player.expLevel}</div>
          </div>
          <div className="pc-inline-trophies">🏆<br />{player.trophies.toLocaleString()}</div>
        </div>
        {player.clan && (
          <div className="pc-inline-clan">🛡️ {player.clan.name} <span className="pc-inline-role">{player.role}</span> <span className="pc-inline-ctag">{player.clan.tag}</span></div>
        )}
        <div className="pc-inline-stats">
          Best {player.bestTrophies} · ⚔️ {player.warStars} war stars · Atk {player.attackWins}/Def {player.defenseWins} · Don {player.donations}/{player.received}
        </div>
        <div className="pc-inline-heroes">
          {player.heroes.map((h: any) => (
            <span className="pc-chip" key={h.name}>{h.name} {h.level}/{h.maxLevel}</span>
          ))}
        </div>
        <div className="pc-inline-counts">
          Troops {player.troops.length} · Spells {player.spells.length} · Equip {player.heroEquipment?.length ?? 0}
        </div>
      </div>
      <button className="more-btn" onClick={save}>⬇ Save PNG</button>
    </>
  );
}

export default function PlayerDetail({ tag, player: initial }: { tag: string; player?: any }) {
  const [player, setPlayer] = useState<any>(initial ?? null);
  const [error, setError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initial) {
      setPlayer(initial);
      setError('');
      return;
    }
    setError('');
    setPlayer(null);
    getPlayer(tag)
      .then(setPlayer)
      .catch((e: any) => setError(e?.response?.data?.error ?? 'Failed to load player'));
  }, [tag, initial]);

  const savePng = async () => {
    try {
      await saveCard(cardRef.current, `coc-player-${player.tag.replace(/^#/, '')}.png`);
    } catch (e) {
      alert('PNG export failed: ' + ((e as Error)?.message ?? e));
    }
  };

  if (error) return <p style={{ color: 'var(--red)' }}>{error}</p>;
  if (!player) return <p className="muted">Loading…</p>;

  return (
    <div>
      <div className="pcard-bar">
        <button className="more-btn" onClick={savePng}>⬇ Save as PNG</button>
      </div>

      <div className="pcard" ref={cardRef}>
        <div className="pcard-head">
          <div className="pc-row">
            <div className="pc-name">{player.name}</div>
            <div className="pc-trophies">🏆 {player.trophies.toLocaleString()}</div>
          </div>
          <div className="pc-sub">
            {player.tag} · TH{player.townHallLevel} · {player.league ?? 'Unranked'} · Exp {player.expLevel}
          </div>
        </div>

        <div className="pcard-body">
          <div className="grid">
            <div className="stat"><div className="label">Best</div><div className="value">{player.bestTrophies}</div></div>
            <div className="stat"><div className="label">War Stars</div><div className="value">{player.warStars}</div></div>
            <div className="stat"><div className="label">Atk/Def</div><div className="value" style={{ fontSize: 16 }}>{player.attackWins}/{player.defenseWins}</div></div>
            <div className="stat"><div className="label">Donated</div><div className="value">{player.donations}</div></div>
            <div className="stat"><div className="label">Received</div><div className="value">{player.received}</div></div>
            <div className="stat"><div className="label">Capital</div><div className="value">{player.clanCapitalContributions}</div></div>
          </div>

          {player.clan && (
            <div className="pc-section">
              <h3>Clan</h3>
              <p className="pc-clan">{player.clan.name} <span className="pill gold">{player.role}</span> <span className="pc-clantag">{player.clan.tag}</span></p>
            </div>
          )}

          <div className="pc-section">
            <h3>Heroes</h3>
            <UnitCard items={player.heroes} type="heroes" />
          </div>

          {player.heroEquipment?.length > 0 && (
            <div className="pc-section">
              <h3>Hero Equipment</h3>
              <div className="unit-grid">
                {player.heroEquipment.map((e: any) => (
                  <div className="unit-card" key={e.name}>
                    <div className="uc-fallback">{e.name.charAt(0)}</div>
                    <div className="uc-name">{e.name}</div>
                    <div className="uc-lvl">{e.level}<small> / {e.maxLevel}</small></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pc-section">
            <h3>Troops</h3>
            <UnitCard items={player.troops} type="troops" />
          </div>

          <div className="pc-section">
            <h3>Spells</h3>
            <UnitCard items={player.spells} type="spells" />
          </div>

          <div className="pc-section">
            <h3>Achievements</h3>
            <div className="ach-grid">
              {player.achievements.map((a: any) => {
                const pct = a.target ? Math.min(100, Math.round((a.value / a.target) * 100)) : 0;
                return (
                  <div className="ach-card" key={a.name}>
                    <div className="ach-name">{a.name}</div>
                    <div className="ach-stars">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className={i < a.stars ? '' : 'off'}>★</span>
                      ))}
                    </div>
                    <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                    <div className="ach-val">{a.value.toLocaleString()} / {a.target.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
