
import React from 'react';
import { Player } from '@/types/player';
import { getPositionEmoji } from '@/utils/positionUtils';

interface CourtVisualizationProps {
  players: Player[];
  teamId: number;
}

const CourtVisualization = ({ players, teamId }: CourtVisualizationProps) => {
  // Organizar jogadores por posição
  const goalkeeper = players.find(p => p.position === 'goleiro');
  const defender = players.find(p => p.position === 'zagueiro') || players.find(p => p.position === 'so-linha');
  const leftWing = players.find(p => p.position === 'ala-esquerda') || players.find(p => p.position === 'so-linha' && p !== defender);
  const rightWing = players.find(p => p.position === 'ala-direita') || players.find(p => p.position === 'so-linha' && p !== defender && p !== leftWing);
  const attacker = players.find(p => p.position === 'atacante') || players.find(p => p.position === 'so-linha' && p !== defender && p !== leftWing && p !== rightWing);

  // Jogadores extras que não se encaixaram nas posições principais
  const extraPlayers = players.filter(p => 
    p !== goalkeeper && p !== defender && p !== leftWing && p !== rightWing && p !== attacker
  );

  const PlayerPosition = ({ player, className = "" }: { player?: Player; className?: string }) => (
    <div className={`flex flex-col items-center justify-center p-2 ${className}`}>
      {player ? (
        <>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg border-2 border-gray-300 shadow-sm">
            {getPositionEmoji(player.position)}
          </div>
          <span className="text-xs font-medium text-gray-700 mt-1 text-center max-w-20 truncate">
            {player.name}
          </span>
        </>
      ) : (
        <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-gray-300 opacity-50"></div>
      )}
    </div>
  );

  return (
    <div className="bg-green-400 rounded-lg p-6 relative shadow-lg animate-scale-in">
      {/* Campo de futebol society */}
      <div className="bg-green-500 rounded-lg border-4 border-white relative min-h-64 flex flex-col justify-between">
        
        {/* Área do goleiro - fundo */}
        <div className="flex justify-center p-4">
          <div className="bg-green-600 rounded border-2 border-white p-2 w-24 flex justify-center">
            <PlayerPosition player={goalkeeper} />
          </div>
        </div>

        {/* Meio campo */}
        <div className="flex-1 flex flex-col justify-between px-4">
          {/* Zagueiro */}
          <div className="flex justify-center mb-4">
            <PlayerPosition player={defender} />
          </div>

          {/* Alas */}
          <div className="flex justify-between items-center mb-4">
            <PlayerPosition player={leftWing} />
            <div className="flex-1 flex justify-center">
              {/* Linha central do campo */}
              <div className="w-16 h-0.5 bg-white"></div>
            </div>
            <PlayerPosition player={rightWing} />
          </div>

          {/* Atacante */}
          <div className="flex justify-center">
            <PlayerPosition player={attacker} />
          </div>
        </div>

        {/* Área adversária */}
        <div className="flex justify-center p-2">
          <div className="bg-green-600 rounded border-2 border-white p-1 w-20 h-6"></div>
        </div>

        {/* Jogadores extras */}
        {extraPlayers.length > 0 && (
          <div className="absolute -bottom-16 left-0 right-0">
            <div className="flex justify-center gap-2 flex-wrap">
              {extraPlayers.map((player, index) => (
                <div key={player.id} className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-sm border border-gray-400">
                    {getPositionEmoji(player.position)}
                  </div>
                  <span className="text-xs text-gray-600 mt-1 max-w-16 truncate">
                    {player.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Título do time */}
      <div className="absolute -top-2 left-4 bg-white px-3 py-1 rounded-full shadow-md">
        <span className="font-bold text-gray-800">Time {teamId}</span>
      </div>
    </div>
  );
};

export default CourtVisualization;
