
export type PlayerPosition = 'goleiro' | 'zagueiro' | 'ala-esquerda' | 'ala-direita' | 'atacante' | 'so-linha';

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
}

export interface Team {
  id: number;
  players: Player[];
  isReserve?: boolean;
}

export interface TeamPositions {
  goleiro?: Player;
  zagueiro?: Player;
  alaEsquerda?: Player;
  alaDireita?: Player;
  atacante?: Player;
}
