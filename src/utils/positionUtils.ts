
import { PlayerPosition } from '@/types/player';

export const positionConfig = {
  'goleiro': { label: 'Goleiro', color: 'bg-blue-500', emoji: '🟦' },
  'zagueiro': { label: 'Zagueiro', color: 'bg-green-500', emoji: '🟩' },
  'ala-esquerda': { label: 'Ala Esquerda', color: 'bg-yellow-500', emoji: '🟨' },
  'ala-direita': { label: 'Ala Direita', color: 'bg-yellow-500', emoji: '🟨' },
  'atacante': { label: 'Atacante (Pivô)', color: 'bg-red-500', emoji: '🟥' },
  'so-linha': { label: 'Só Linha', color: 'bg-gray-500', emoji: '⚽' }
} as const;

export const getPositionLabel = (position: PlayerPosition): string => {
  return positionConfig[position].label;
};

export const getPositionColor = (position: PlayerPosition): string => {
  return positionConfig[position].color;
};

export const getPositionEmoji = (position: PlayerPosition): string => {
  return positionConfig[position].emoji;
};
