import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getClan } from '../api';

function TagInput({ onSearch }: { onSearch: (tag: string) => void }) {
  const [value, setValue] = useState('#');
  return (
    <div style={{ marginBottom: 16 }}>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="#CLANTAG" />
      <button onClick={() => onSearch(value)}>Search</button>
    </div>
  );
}

export default function ClanOverview() {
  const [params] = useSearchParams();
  const initial = params.get('tag') ?? '';
  const [tag, setTag] = useState(initial);
  const [clan, setClan] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const search = useCallback(async (t: string) => {
    setError('');
    try {
      setClan(await getClan(t));
      setTag(t);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Failed to load clan');
    }
  }, []);

  useEffect(() => {
    if (initial) search(initial);
  }, [initial, search]);

  return (
    <div>
      <h2>Clan Overview</h2>
      <TagInput onSearch={search} />
      {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
      {clan && (
        <>
          <div className="grid">
            <div className="stat"><div className="label">Name</div><div className="value">{clan.name}</div></div>
            <div className="stat"><div className="label">Level</div><div className="value">{clan.level}</div></div>
            <div className="stat"><div className="label">Members</div><div className="value">{clan.members}</div></div>
            <div className="stat"><div className="label">Points</div><div className="value">{clan.clanPoints}</div></div>
            <div className="stat"><div className="label">War Wins</div><div className="value">{clan.warWins}</div></div>
            <div className="stat"><div className="label">Streak</div><div className="value">{clan.warWinStreak}</div></div>
          </div>
          <div className="card">
            <h3>Members ({clan.memberList.length})</h3>
            <table>
              <thead>
                <tr><th>Name</th><th>Role</th><th>TH</th><th>Trophies</th><th>Donated</th><th>War Stars</th><th>Last Seen</th></tr>
              </thead>
              <tbody>
                {clan.memberList.map((m: any) => (
                  <tr key={m.tag} style={{ cursor: 'pointer' }} onClick={() => navigate(`/player?tag=${encodeURIComponent(m.tag)}`)}>
                    <td>{m.name}</td><td>{m.role}</td><td>{m.townHallLevel}</td>
                    <td>{m.trophies}</td><td>{m.donations}</td><td>{m.warStars}</td><td>{m.lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
