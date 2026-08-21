function tag(raw: string): string {
  const t = decodeURIComponent(raw).toUpperCase().replace(/^#+/, '');
  return `#${t}`;
}

export { tag };
