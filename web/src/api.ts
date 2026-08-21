import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

const arr = (v: any) => (Array.isArray(v) ? v : []);
const num = (v: any) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

export function normalizePlayer(p: any) {
  if (!p || typeof p !== 'object') return p;
  return {
    ...p,
    name: p.name ?? '',
    tag: p.tag ?? '',
    townHallLevel: num(p.townHallLevel),
    expLevel: num(p.expLevel),
    trophies: num(p.trophies),
    bestTrophies: num(p.bestTrophies),
    warStars: num(p.warStars),
    attackWins: num(p.attackWins),
    defenseWins: num(p.defenseWins),
    donations: num(p.donations),
    received: num(p.received),
    clanCapitalContributions: num(p.clanCapitalContributions),
    heroes: arr(p.heroes),
    troops: arr(p.troops),
    spells: arr(p.spells),
    heroEquipment: arr(p.heroEquipment),
    achievements: arr(p.achievements).map((a: any) => ({
      ...a,
      stars: num(a.stars),
      value: num(a.value),
      target: num(a.target)
    })),
    labels: arr(p.labels)
  };
}

export function normalizeClan(c: any) {
  if (!c || typeof c !== 'object') return c;
  return {
    ...c,
    name: c.name ?? '',
    tag: c.tag ?? '',
    clanLevel: num(c.clanLevel),
    members: num(c.members),
    clanPoints: num(c.clanPoints),
    requiredTrophies: num(c.requiredTrophies),
    warWins: num(c.warWins),
    warWinStreak: num(c.warWinStreak),
    memberList: arr(c.memberList)
  };
}

export async function getClan(tag: string) {
  const { data } = await api.get(`/clan/${encodeURIComponent(tag)}`);
  return normalizeClan(data);
}
export async function getWar(tag: string) {
  const { data } = await api.get(`/war/${encodeURIComponent(tag)}/current`);
  return data;
}
export async function getWarLog(tag: string) {
  const { data } = await api.get(`/war/${encodeURIComponent(tag)}/log`);
  return data;
}
export async function getCwl(tag: string) {
  const { data } = await api.get(`/cwl/${encodeURIComponent(tag)}`);
  return data;
}
export async function getCapital(tag: string) {
  const { data } = await api.get(`/capital/${encodeURIComponent(tag)}`);
  return data;
}
export async function getPlayer(tag: string) {
  const { data } = await api.get(`/player/${encodeURIComponent(tag)}`);
  return normalizePlayer(data);
}
export async function getLocations() {
  const { data } = await api.get('/rankings/locations');
  return data;
}
export async function getLocationClans(id: string) {
  const { data } = await api.get(`/rankings/${id}/clans`);
  return data;
}
export async function getLocationPlayers(id: string) {
  const { data } = await api.get(`/rankings/${id}/players`);
  return data;
}
export async function getBuilderClans(id: string) {
  const { data } = await api.get(`/misc/rankings/${id}/builder`);
  return data;
}
export async function getCapitalClans(id: string) {
  const { data } = await api.get(`/misc/rankings/${id}/capital`);
  return data;
}
export async function getSeasonRankings(season: string) {
  const { data } = await api.get(`/misc/rankings/season/${season}`);
  return data;
}
export async function getGoldPass() {
  const { data } = await api.get('/misc/goldpass');
  return data;
}
export async function getWarLeagues() {
  const { data } = await api.get('/misc/leagues/war');
  return data;
}
export async function getCapitalLeagues() {
  const { data } = await api.get('/misc/leagues/capital');
  return data;
}
export async function getBuilderLeagues() {
  const { data } = await api.get('/misc/leagues/builder');
  return data;
}
export async function getLeagueTiers() {
  const { data } = await api.get('/misc/leagues/tiers');
  return data;
}
export async function getClanLabels() {
  const { data } = await api.get('/misc/labels/clan');
  return data;
}
export async function getPlayerLabels() {
  const { data } = await api.get('/misc/labels/player');
  return data;
}
export async function searchClans(name: string) {
  const { data } = await api.get('/misc/clans/search', { params: { name } });
  return data;
}
export async function getBattleLog(tag: string) {
  const { data } = await api.get(`/player/${encodeURIComponent(tag)}/battlelog`);
  return data;
}
export async function getLeagueHistory(tag: string) {
  const { data } = await api.get(`/player/${encodeURIComponent(tag)}/leaguehistory`);
  return data;
}
export async function getCwlCurrentWar(tag: string) {
  const { data } = await api.get(`/cwl/${encodeURIComponent(tag)}/currentwar`);
  return data;
}

export default api;
