import { useState } from 'react';
import { getCwl } from '../api';

export default function CWL() {
  const [tag, setTag] = useState('');
  const [group, setGroup] = useState<any>(null);
  const [error, setError] = useState('');

  const search = async (t: string) => {
    setError('');
    try {
      setGroup(await getCwl(t));
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Failed to load CWL');
    }
  };

  return (
    <div>
      <h2>Clan War League</h2>
      <div style={{ marginBottom: 16 }}>
        <input defaultValue="#" onChange={(e) => setTag(e.target.value)} placeholder="#CLANTAG" />
        <button onClick={() => search(tag)}>Search</button>
      </div>
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      {group && (
        <div className="card">
          <div className="stat"><div className="label">State</div><div className="value">{group.state}</div></div>
          <h3>Rounds</h3>
          <table>
            <thead><tr><th>Round</th><th>Wars</th></tr></thead>
            <tbody>
              {group.rounds.map((r: any) => (
                <tr key={r.round}><td>{r.round}</td><td>{r.warTags.join(', ')}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
