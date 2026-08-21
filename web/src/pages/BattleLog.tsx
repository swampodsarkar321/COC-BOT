import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBattleLog } from '../api';

export default function BattleLog() {
  const [params] = useSearchParams();
  const [tag, setTag] = useState(params.get('tag') ?? '#');
  const [log, setLog] = useState<any[]>([]);
  const [error, setError] = useState('');

  const search = useCallback(async (t: string) => {
    setError('');
    try {
      setLog(await getBattleLog(t));
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Failed');
    }
  }, []);

  useEffect(() => {
    const t = params.get('tag');
    if (t) search(t);
  }, [params, search]);

  return (
    <div>
      <h2>Battle Log</h2>
      <div style={{ marginBottom: 16 }}>
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="#PLAYERTAG" />
        <button onClick={() => search(tag)}>Search</button>
      </div>
      {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
      {log.length > 0 && (
        <div className="card">
          <table>
            <thead><tr><th>Time</th><th>Type</th><th>Result</th><th>Trophy</th><th>Opponent</th></tr></thead>
            <tbody>
              {log.map((b, i) => (
                <tr key={i}>
                  <td>{b.battleTime}</td><td>{b.type}</td>
                  <td><span className={`pill ${b.result === 'win' ? 'win' : 'loss'}`}>{b.result}</span></td>
                  <td>{b.trophies}</td>
                  <td>{b.opponent?.map((o: any) => o.name).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {log.length === 0 && !error && <p className="muted">No battles found.</p>}
    </div>
  );
}
