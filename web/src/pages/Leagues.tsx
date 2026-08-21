import { useState, useEffect } from 'react';
import { getWarLeagues, getCapitalLeagues, getBuilderLeagues, getLeagueTiers } from '../api';

export default function Leagues() {
  const [war, setWar] = useState<any[]>([]);
  const [capital, setCapital] = useState<any[]>([]);
  const [builder, setBuilder] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);

  useEffect(() => {
    getWarLeagues().then(setWar).catch(() => setWar([]));
    getCapitalLeagues().then(setCapital).catch(() => setCapital([]));
    getBuilderLeagues().then(setBuilder).catch(() => setBuilder([]));
    getLeagueTiers().then(setTiers).catch(() => setTiers([]));
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
      <h2>Leagues</h2>
      {render('War Leagues', war)}
      {render('Capital Leagues', capital)}
      {render('Builder Base Leagues', builder)}
      {render('League Tiers', tiers)}
    </div>
  );
}
