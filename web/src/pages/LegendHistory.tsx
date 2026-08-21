import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLeagueHistory } from '../api';

export default function LegendHistory() {
  const [params] = useSearchParams();
  const [tag, setTag] = useState(params.get('tag') ?? '#');
  const [history, setHistory] = useState<any>(null);
  const [error, setError] = useState('');

  const search = useCallback(async (t: string) => {
    setError('');
    try {
      setHistory(await getLeagueHistory(t));
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
      <h2>Legend League History</h2>
      <div style={{ marginBottom: 16 }}>
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="#PLAYERTAG" />
        <button onClick={() => search(tag)}>Search</button>
      </div>
      {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
      {history && (
        <div className="card">
          <pre style={{ maxHeight: 500, overflow: 'auto' }}>{JSON.stringify(history, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
