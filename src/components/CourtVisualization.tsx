
import React from 'react';
import { Player, PlayerPosition } from '@/types/player';
import { getPositionEmoji } from '@/utils/positionUtils';

interface CourtVisualizationProps {
  players: Player[];
  teamId: number;
  requiresGoalkeeper?: boolean;
}

type FormationSlot = {
  x: number;
  y: number;
  preferredPositions: PlayerPosition[];
};

const withGoalkeeperFormations: Record<number, FormationSlot[]> = {
  5: [
    { x: 50, y: 90, preferredPositions: ['goleiro'] },
    { x: 50, y: 68, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 28, y: 48, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 72, y: 48, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 50, y: 22, preferredPositions: ['atacante', 'so-linha'] }
  ],
  6: [
    { x: 50, y: 90, preferredPositions: ['goleiro'] },
    { x: 35, y: 70, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 65, y: 70, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 28, y: 46, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 72, y: 46, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 50, y: 20, preferredPositions: ['atacante', 'so-linha'] }
  ],
  7: [
    { x: 50, y: 90, preferredPositions: ['goleiro'] },
    { x: 30, y: 70, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 50, y: 68, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 70, y: 70, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 28, y: 42, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 72, y: 42, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 50, y: 18, preferredPositions: ['atacante', 'so-linha'] }
  ],
  8: [
    { x: 50, y: 90, preferredPositions: ['goleiro'] },
    { x: 28, y: 72, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 50, y: 68, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 72, y: 72, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 22, y: 44, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 42, y: 44, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 58, y: 44, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 78, y: 44, preferredPositions: ['ala-direita', 'so-linha'] }
  ],
  9: [
    { x: 50, y: 90, preferredPositions: ['goleiro'] },
    { x: 24, y: 74, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 50, y: 70, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 76, y: 74, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 22, y: 48, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 40, y: 48, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 60, y: 48, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 78, y: 48, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 50, y: 20, preferredPositions: ['atacante', 'so-linha'] }
  ],
  10: [
    { x: 50, y: 90, preferredPositions: ['goleiro'] },
    { x: 20, y: 76, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 40, y: 72, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 60, y: 72, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 80, y: 76, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 18, y: 50, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 36, y: 50, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 64, y: 50, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 82, y: 50, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 50, y: 22, preferredPositions: ['atacante', 'so-linha'] }
  ],
  11: [
    { x: 50, y: 90, preferredPositions: ['goleiro'] },
    { x: 16, y: 78, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 35, y: 74, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 50, y: 72, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 65, y: 74, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 84, y: 78, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 18, y: 52, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 36, y: 50, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 64, y: 50, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 82, y: 52, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 50, y: 24, preferredPositions: ['atacante', 'so-linha'] }
  ]
};

const noGoalkeeperFormations: Record<number, FormationSlot[]> = {
  5: [
    { x: 35, y: 72, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 65, y: 72, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 28, y: 44, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 72, y: 44, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 50, y: 18, preferredPositions: ['atacante', 'so-linha'] }
  ],
  6: [
    { x: 30, y: 72, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 50, y: 70, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 70, y: 72, preferredPositions: ['zagueiro', 'so-linha'] },
    { x: 26, y: 44, preferredPositions: ['ala-esquerda', 'so-linha'] },
    { x: 74, y: 44, preferredPositions: ['ala-direita', 'so-linha'] },
    { x: 50, y: 18, preferredPositions: ['atacante', 'so-linha'] }
  ],
  7: withGoalkeeperFormations[8].slice(0, 7),
  8: withGoalkeeperFormations[9].slice(0, 8),
  9: withGoalkeeperFormations[10].slice(0, 9),
  10: withGoalkeeperFormations[11].slice(0, 10),
  11: withGoalkeeperFormations[11]
};

const CourtVisualization = ({ players, teamId, requiresGoalkeeper = true }: CourtVisualizationProps) => {
  const getPlayerSkill = (player: Player) => player.skillLevel ?? 3;
  const normalizedCount = Math.max(5, Math.min(players.length, 11));
  const formationMap = requiresGoalkeeper ? withGoalkeeperFormations : noGoalkeeperFormations;
  const slots = formationMap[normalizedCount] ?? formationMap[5];
  const sortedPool = [...players].sort((a, b) => getPlayerSkill(b) - getPlayerSkill(a));

  const usedIds = new Set<string>();
  const assignedSlots = slots.map((slot) => {
    const preferredPlayer = sortedPool.find(
      (player) => !usedIds.has(player.id) && slot.preferredPositions.includes(player.position)
    );
    const fallbackPlayer = sortedPool.find((player) => !usedIds.has(player.id) && player.position === 'so-linha');
    const anyPlayer = sortedPool.find((player) => !usedIds.has(player.id));
    const selected = preferredPlayer ?? fallbackPlayer ?? anyPlayer;

    if (selected) {
      usedIds.add(selected.id);
    }

    return { slot, player: selected };
  });

  const extraPlayers = sortedPool.filter((player) => !usedIds.has(player.id));

  const PlayerPosition = ({ player, className = "" }: { player?: Player; className?: string }) => (
    <div className={`flex flex-col items-center justify-center p-2 ${className}`}>
      {player ? (
        <>
          <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center text-lg border-2 border-primary/20 shadow-sm">
            {getPositionEmoji(player.position)}
          </div>
          <span className="text-xs font-medium text-foreground mt-1 text-center max-w-20 truncate">
            {player.name}
            {player.skillLevel !== undefined ? ` · ${player.skillLevel}` : ''}
          </span>
        </>
      ) : (
        <div className="w-8 h-8 bg-muted rounded-full border-2 border-border opacity-50"></div>
      )}
    </div>
  );

  return (
    <div className="rounded-lg p-6 relative shadow-lg animate-scale-in bg-gradient-to-br from-primary/15 via-accent/15 to-primary/20">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg border-4 border-card relative min-h-[360px] overflow-hidden">
        <div className="absolute inset-x-0 top-8 border-t border-card/70" />
        <div className="absolute inset-x-0 bottom-8 border-t border-card/70" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card/70" />
        <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-card/70" />

        {assignedSlots.map(({ slot, player }, index) => (
          <div
            key={`${slot.x}-${slot.y}-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            <PlayerPosition player={player} />
          </div>
        ))}

        <div className="absolute inset-x-[38%] bottom-0 h-8 border-x-2 border-t-2 border-card/70" />
        <div className="absolute inset-x-[38%] top-0 h-8 border-x-2 border-b-2 border-card/70" />

        <div className="absolute top-2 right-2 rounded bg-card/90 px-2 py-1 text-[10px] font-semibold text-foreground">
          Formato {players.length}x{players.length}
        </div>
      </div>

      {extraPlayers.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-foreground/90">Suplentes</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {extraPlayers.map((player) => (
              <div key={player.id} className="flex flex-col items-center">
                <div className="w-6 h-6 bg-card rounded-full flex items-center justify-center text-sm border border-border">
                  {getPositionEmoji(player.position)}
                </div>
                <span className="text-xs text-foreground/85 mt-1 max-w-16 truncate">
                  {player.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Título do time */}
      <div className="absolute -top-2 left-4 bg-card px-3 py-1 rounded-full shadow-md">
        <span className="font-bold text-foreground">Time {teamId}</span>
      </div>
    </div>
  );
};

export default CourtVisualization;
