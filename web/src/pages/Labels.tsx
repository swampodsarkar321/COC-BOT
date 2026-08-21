import { useState, useEffect } from 'react';
import { getClanLabels, getPlayerLabels } from '../api';

export default function Labels() {
  const [clan, setClan] = useState<any[]>([]);
  const [player, setPlayer] = useState<any[]>([]);

  useEffect(() => {
    getClanLabels().then(setClan).catch(() => setClan([]));
    getPlayerLabels().then(setPlayer).catch(() => setPlayer([]));
  }, []);

  const render = (title: string, list: any[]) => (
    <div className="card">
      <h3>{title}</h3>
      <div className="grid">
        {list.map((l) => (
          <div className="stat" key={l.id}>
            <div className="label">{l.name}</div>
            <div className="value" style={{ fontSize: 14 }}>#{l.id}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2>Labels</h2>
      {render('Clan Labels', clan)}
      {render('Player Labels', player)}
    </div>
  );
}
