import { useState } from 'react';
import { getCapital } from '../api';

export default function Capital() {
  const [tag, setTag] = useState('#');
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState('');

  const search = async (t: string) => {
    setError('');
    try {
      setData(await getCapital(t));
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Failed to load capital');
    }
  };

  return (
    <div>
      <h2>Capital Raid</h2>
      <div style={{ marginBottom: 16 }}>
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="#CLANTAG" />
        <button onClick={() => search(tag)}>Search</button>
      </div>
      {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
      {data?.map((season: any, si: number) => (
        <div className="card" key={si}>
          <h3>Season {season.startTime ?? si + 1}</h3>
          <div className="grid">
            <div className="stat"><div className="label">Total Loot</div><div className="value">{season.capitalTotalLoot ?? '—'}</div></div>
            <div className="stat"><div className="label">Raids</div><div className="value">{(season.raids ?? []).length}</div></div>
          </div>
          {(season.raids ?? []).map((raid: any, ri: number) => (
            <div key={ri} style={{ marginTop: 12 }}>
              <p className="muted">vs {raid.defender?.name ?? raid.defender?.tag ?? 'Unknown'}</p>
              <table>
                <thead><tr><th>District</th><th>Destruction</th><th>Attacks</th></tr></thead>
                <tbody>
                  {(raid.districts ?? []).map((d: any, di: number) => (
                    <tr key={di}>
                      <td>{d.name}</td>
                      <td>
                        <div className="bar"><span style={{ width: `${d.destructionPercent ?? 0}%` }} /></div>
                        {d.destructionPercent ?? 0}%
                      </td>
                      <td>{d.attackCount ?? d.totalAttacks ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
      {data && data.length === 0 && !error && <p className="muted">No capital raid data.</p>}
    </div>
  );
}
