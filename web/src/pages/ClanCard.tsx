import { useState } from 'react';

export default function ClanCardInline({ clan, onMember }: { clan: any; onMember: (tag: string) => void }) {
  const [open, setOpen] = useState(false);
  const members = clan.memberList ?? [];

  return (
    <div className="cc-inline">
      <div className="cc-head">
        <div className="cc-av">{(clan?.name ?? '').charAt(0)}</div>
        <div className="cc-id">
          <div className="cc-name">{clan.name}</div>
          <div className="cc-sub">{clan.tag} · Lvl {clan.clanLevel} · {clan.members}/50 members</div>
        </div>
        <div className="cc-points">🏆<br />{(clan.clanPoints ?? clan.points ?? 0).toLocaleString()}</div>
      </div>
      <div className="cc-stats">
        Req {clan.requiredTrophies ?? 0} · Wins {clan.warWins ?? 0} · {clan.warLogIsPublic ? 'War log public' : 'War log private'}
      </div>
      <button className="more-btn" onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide members' : `View ${members.length} members`}
      </button>
      {open && (
        <div className="cc-members">
          {members.map((m: any) => (
            <div key={m.tag} className="cc-member" onClick={() => onMember(m.tag)}>
              <span className="cc-m-name">{m.name}</span>
              <span className="cc-m-role">{m.role}</span>
              <span className="cc-m-tr">🏆 {m.trophies}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
