export type UnitType = 'troops' | 'spells' | 'heroes';

// Supercell does not provide a free, hotlinkable CDN for troop/spell/hero
// icons (the public asset host returns a generic placeholder for every path).
// Drop PNG files into web/public/icons/{troops|spells|heroes}/<Name>.png
// (spaces -> hyphens, dots removed) and they will appear automatically.
export function unitImage(name: string, type: UnitType): string {
  const file = name.replace(/\./g, '').replace(/\s+/g, '-');
  return `/icons/${type}/${file}.png`;
}
