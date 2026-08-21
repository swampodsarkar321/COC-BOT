import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getPlayer } from '../api';
import { unitImage } from '../unitImage';

function Icon({ name, type }: { name: string; type: 'troops' | 'spells' | 'heroes' }) {
  const [err, setErr] = useState(false);
  if (err) return <span className="uc-fallback">{name.charAt(0)}</span>;
  return (
    <img
      className="uc-icon"
      src={unitImage(name, type)}
      alt={name}
      loading="lazy"
      onError={() => setErr(true)}
    />
  );
}

function UnitCard({
  items,
  type,
  empty = 'Max'
}: {
  items: any[];
  type: 'troops' | 'spells' | 'heroes';
  empty?: string;
}) {
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

export default function Player() {
  const [params] = useSearchParams();
  const [tag, setTag] = useState(params.get('tag') ?? '#');
  const [player, setPlayer] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const search = useCallback(async (t: string) => {
    setError('');
    try {
      setPlayer(await getPlayer(t));
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Failed to load player');
    }
  }, []);

  useEffect(() => {
    const t = params.get('tag');
    if (t) search(t);
  }, [params, search]);

  return (
    <div>
      <h2>Player</h2>
      <div style={{ marginBottom: 16 }}>
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="#PLAYERTAG" />
        <button onClick={() => search(tag)}>Search</button>
        <button onClick={() => navigate(`/battlelog?tag=${encodeURIComponent(tag)}`)} style={{ marginLeft: 8 }}>Battle Log</button>
        <button onClick={() => navigate(`/legend?tag=${encodeURIComponent(tag)}`)} style={{ marginLeft: 8 }}>Legend</button>
      </div>
      {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
      {player && (
        <>
          <div className="grid">
            <div className="stat"><div className="label">Name</div><div className="value">{player.name}</div></div>
            <div className="stat"><div className="label">Tag</div><div className="value" style={{ fontSize: 14 }}>{player.tag}</div></div>
            <div className="stat"><div className="label">TH</div><div className="value">{player.townHallLevel}{player.townHallWeaponLevel ? ` (W${player.townHallWeaponLevel})` : ''}</div></div>
            <div className="stat"><div className="label">Trophies</div><div className="value">{player.trophies}</div></div>
            <div className="stat"><div className="label">Best</div><div className="value">{player.bestTrophies}</div></div>
            <div className="stat"><div className="label">League</div><div className="value" style={{ fontSize: 15 }}>{player.league ?? 'Unranked'}</div></div>
            <div className="stat"><div className="label">Exp</div><div className="value">{player.expLevel}</div></div>
            <div className="stat"><div className="label">War Stars</div><div className="value">{player.warStars}</div></div>
            <div className="stat"><div className="label">Atk/Def Wins</div><div className="value" style={{ fontSize: 16 }}>{player.attackWins}/{player.defenseWins}</div></div>
            <div className="stat"><div className="label">Donated</div><div className="value">{player.donations}</div></div>
            <div className="stat"><div className="label">Received</div><div className="value">{player.received}</div></div>
            <div className="stat"><div className="label">Capital Contrib</div><div className="value">{player.clanCapitalContributions}</div></div>
            <div className="stat"><div className="label">Builder Hall</div><div className="value">{player.builderHallLevel ?? '—'}</div></div>
          </div>

          {player.clan && (
            <div className="card">
              <h3>Clan</h3>
              <p style={{ cursor: 'pointer' }} onClick={() => navigate(`/?tag=${encodeURIComponent(player.clan.tag)}`)}>
                {player.clan.name} <span className="pill gold">{player.role}</span> — {player.clan.tag}
              </p>
            </div>
          )}

          {player.legendStatistics && (
            <div className="card">
              <h3>Legend Statistics</h3>
              <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(player.legendStatistics, null, 2)}</pre>
            </div>
          )}

          <div className="card">
            <h3>Heroes</h3>
            <UnitCard items={player.heroes} type="heroes" />
          </div>

          {player.heroEquipment?.length > 0 && (
            <div className="card">
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

          <div className="card">
            <h3>Troops</h3>
            <UnitCard items={player.troops} type="troops" />
          </div>

          <div className="card">
            <h3>Spells</h3>
            <UnitCard items={player.spells} type="spells" />
          </div>

          <div className="card">
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
                    <div className="bar">
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <div className="ach-val">
                      {a.value.toLocaleString()} / {a.target.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {player.labels?.length > 0 && (
            <div className="card">
              <h3>Labels</h3>
              <div className="grid">
                {player.labels.map((l: any) => (
                  <div className="stat" key={l.name}><div className="label">{l.name}</div></div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
