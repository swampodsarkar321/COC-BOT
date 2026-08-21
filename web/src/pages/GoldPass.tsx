import { useState, useEffect } from 'react';
import { getGoldPass } from '../api';

export default function GoldPass() {
  const [gp, setGp] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getGoldPass()
      .then(setGp)
      .catch((e) => setError(e?.response?.data?.error ?? 'Failed'));
  }, []);

  if (error) return <p style={{ color: 'var(--red)' }}>{error}</p>;
  if (!gp) return <p className="muted">Loading gold pass…</p>;

  return (
    <div>
      <h2>Gold Pass</h2>
      <div className="grid">
        <div className="stat"><div className="label">Season</div><div className="value">{gp.id ?? gp.name ?? '—'}</div></div>
        <div className="stat"><div className="label">Start</div><div className="value" style={{ fontSize: 16 }}>{gp.startTime ?? '—'}</div></div>
        <div className="stat"><div className="label">End</div><div className="value" style={{ fontSize: 16 }}>{gp.endTime ?? '—'}</div></div>
      </div>
      <div className="card">
        <pre style={{ maxHeight: 500, overflow: 'auto' }}>{JSON.stringify(gp, null, 2)}</pre>
      </div>
    </div>
  );
}
