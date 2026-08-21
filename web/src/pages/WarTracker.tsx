import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWar } from '../api';

export default function WarTracker() {
  const [tag, setTag] = useState('');
  const [war, setWar] = useState<any>(null);
  const [log, setLog] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const search = async (t: string) => {
    setError('');
    try {
      setWar(await getWar(t));
      setTag(t);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Failed to load war');
    }
  };

  return (
    <div>
      <h2>War Tracker</h2>
      <div style={{ marginBottom: 16 }}>
        <input defaultValue="#" onChange={(e) => setTag(e.target.value)} placeholder="#CLANTAG" />
        <button onClick={() => search(tag)}>Search</button>
      </div>
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      {war && (
        <>
          <div className="grid">
            <div className="stat"><div className="label">State</div><div className="value">{war.state}</div></div>
            <div className="stat"><div className="label">Team Size</div><div className="value">{war.teamSize}</div></div>
            <div className="stat"><div className="label">Clan Stars</div><div className="value">{war.clan?.stars}</div></div>
            <div className="stat"><div className="label">Opp Stars</div><div className="value">{war.opponent?.stars}</div></div>
          </div>
          <div className="card">
            <h3>Members</h3>
            <table>
              <thead><tr><th>Pos</th><th>Name</th><th>TH</th><th>Attacks</th><th>Stars</th><th>Defenses</th></tr></thead>
              <tbody>
                {war.members.map((m: any) => (
                  <tr key={m.tag} style={{ cursor: 'pointer' }} onClick={() => navigate(`/player?tag=${encodeURIComponent(m.tag)}`)}><td>{m.mapPosition}</td><td>{m.name}</td><td>{m.townHallLevel}</td><td>{m.attacks}</td><td>{m.stars}</td><td>{m.defenseCount}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {war.attacks?.length > 0 && (
            <div className="card">
              <h3>Attack-by-Attack</h3>
              <table>
                <thead><tr><th>#</th><th>Attacker</th><th>vs</th><th>Stars</th><th>Destruction</th></tr></thead>
                <tbody>
                  {war.attacks.map((a: any, i: number) => (
                    <tr key={i}>
                      <td>{a.order}</td><td>{a.attacker}</td><td>{a.defender}</td>
                      <td><span className="pill gold">{'★'.repeat(a.stars)}</span></td>
                      <td>
                        <div className="bar"><span style={{ width: `${a.destruction}%` }} /></div>
                        {a.destruction}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
