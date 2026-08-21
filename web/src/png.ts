import { toPng } from 'html-to-image';

export async function saveCard(node: HTMLElement | null, filename: string) {
  if (!node) return;
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 3,
    skipFonts: true,
    backgroundColor: '#16213c'
  });
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
}
