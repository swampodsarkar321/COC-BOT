import { useState } from 'react';
import { searchClans } from '../api';
import { useNavigate } from 'react-router-dom';

export default function ClanSearch() {
  const [name, setName] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const search = async () => {
    setError('');
    try {
      setResults(await searchClans(name));
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Search failed');
    }
  };

  return (
    <div>
      <h2>Clan Search</h2>
      <div style={{ marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Clan name (e.g. Order)" />
        <button onClick={search}>Search</button>
      </div>
      {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
      {results.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr><th>Badge</th><th>Name</th><th>Tag</th><th>Level</th><th>Members</th><th>Points</th><th>Location</th></tr>
            </thead>
            <tbody>
              {results.map((c) => (
                <tr key={c.tag} style={{ cursor: 'pointer' }} onClick={() => navigate(`/?tag=${encodeURIComponent(c.tag)}`)}>
                  <td>{c.badge ? <img className="avatar" src={c.badge} alt="" /> : '–'}</td>
                  <td>{c.name}</td><td>{c.tag}</td><td>{c.level}</td><td>{c.members}</td><td>{c.points}</td><td>{c.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {results.length === 0 && name && <p className="muted">No clans found.</p>}
    </div>
  );
}
