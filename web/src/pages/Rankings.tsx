import { useEffect, useState } from 'react';
import { getLocations, getLocationClans, getLocationPlayers, getBuilderClans, getCapitalClans } from '../api';

export default function Rankings() {
  const [locations, setLocations] = useState<any[]>([]);
  const [selected, setSelected] = useState('');
  const [tab, setTab] = useState<'clans' | 'players' | 'builder' | 'capital'>('clans');
  const [clans, setClans] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [builder, setBuilder] = useState<any[]>([]);
  const [capital, setCapital] = useState<any[]>([]);

  useEffect(() => {
    getLocations().then(setLocations).catch(() => setLocations([]));
  }, []);

  const load = async (id: string) => {
    setSelected(id);
    const [c, p, b, cap] = await Promise.all([
      getLocationClans(id),
      getLocationPlayers(id),
      getBuilderClans(id),
      getCapitalClans(id)
    ]);
    setClans(c);
    setPlayers(p);
    setBuilder(b);
    setCapital(cap);
  };

  const tabs = [
    { key: 'clans', label: 'Clans' },
    { key: 'players', label: 'Players' },
    { key: 'builder', label: 'Builder Base' },
    { key: 'capital', label: 'Capital' }
  ] as const;

  return (
    <div>
      <h2>Rankings</h2>
      <div style={{ marginBottom: 16 }}>
        <select value={selected} onChange={(e) => load(e.target.value)} style={{ padding: 9, borderRadius: 8, background: '#1b2540', color: '#f3f1e7', border: '2px solid var(--stroke)' }}>
          <option value="">Select location</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>
      {selected && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{ background: tab === t.key ? 'var(--gold)' : 'var(--panel-2)' }}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="card">
            {tab === 'clans' && (
              <table>
                <thead><tr><th>Name</th><th>Points</th><th>Members</th></tr></thead>
                <tbody>{clans.map((c) => <tr key={c.tag}><td>{c.name}</td><td>{c.points}</td><td>{c.members}</td></tr>)}</tbody>
              </table>
            )}
            {tab === 'players' && (
              <table>
                <thead><tr><th>Name</th><th>Trophies</th><th>Clan</th></tr></thead>
                <tbody>{players.map((p) => <tr key={p.tag}><td>{p.name}</td><td>{p.trophies}</td><td>{p.clan}</td></tr>)}</tbody>
              </table>
            )}
            {tab === 'builder' && (
              <table>
                <thead><tr><th>Name</th><th>Points</th><th>Members</th></tr></thead>
                <tbody>{builder.map((c) => <tr key={c.tag}><td>{c.name}</td><td>{c.points}</td><td>{c.members}</td></tr>)}</tbody>
              </table>
            )}
            {tab === 'capital' && (
              <table>
                <thead><tr><th>Name</th><th>Points</th><th>Members</th></tr></thead>
                <tbody>{capital.map((c) => <tr key={c.tag}><td>{c.name}</td><td>{c.points}</td><td>{c.members}</td></tr>)}</tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
