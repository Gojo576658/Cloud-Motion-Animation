// Offline Iconify icons (MIT / Apache / ISC sets only): <Icon name="ph:wifi-high-bold" size={64} color="#fff" />
import React from 'react';
import { getIconData, iconToSVG, replaceIDs } from '@iconify/utils';
import ph from '@iconify-json/ph/icons.json';
import tabler from '@iconify-json/tabler/icons.json';
import lucide from '@iconify-json/lucide/icons.json';
import mdi from '@iconify-json/mdi/icons.json';
import carbon from '@iconify-json/carbon/icons.json';
import ms from '@iconify-json/material-symbols/icons.json';
import fluent from '@iconify-json/fluent/icons.json';
import huge from '@iconify-json/hugeicons/icons.json';

const SETS: Record<string, any> = { ph, tabler, lucide, mdi, carbon, 'material-symbols': ms, fluent, hugeicons: huge };

export const Icon: React.FC<{ name: string; size?: number; color?: string; style?: React.CSSProperties; glow?: boolean }> = ({ name, size = 48, color = 'currentColor', style, glow }) => {
  const [set, icon] = name.split(':');
  const data = SETS[set] && getIconData(SETS[set], icon);
  if (!data) throw new Error(`icon not found: ${name}`);
  const svg = iconToSVG(data, { height: size });
  const body = replaceIDs(svg.body).replace(/currentColor/g, color);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={svg.attributes.viewBox} style={{ display: 'block', color, filter: glow ? `drop-shadow(0 0 ${size * 0.15}px ${color})` : undefined, ...style }} dangerouslySetInnerHTML={{ __html: body }} />
  );
};
