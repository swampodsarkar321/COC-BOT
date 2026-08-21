import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export async function getClan(tag: string) {
  const { data } = await api.get(`/clan/${encodeURIComponent(tag)}`);
  return data;
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
  return data;
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
