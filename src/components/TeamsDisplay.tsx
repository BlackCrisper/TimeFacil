
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users } from 'lucide-react';
import { Team } from '@/types/player';
import { getPositionEmoji, getPositionLabel } from '@/utils/positionUtils';
import CourtVisualization from './CourtVisualization';

interface TeamsDisplayProps {
  teams: Team[];
}

const TeamsDisplay = ({ teams }: TeamsDisplayProps) => {
  if (teams.length === 0) return null;

  const regularTeams = teams.filter(team => !team.isReserve);
  const reserveTeam = teams.find(team => team.isReserve);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Trophy className="w-6 h-6 text-yellow-600" />
        </div>
        Times Sorteados
      </h2>
      
      {/* Times principais com visualização de quadra */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        {regularTeams.map((team, teamIndex) => (
          <div key={team.id} className="space-y-4">
            {/* Visualização da quadra */}
            <CourtVisualization players={team.players} teamId={team.id} />
            
            {/* Lista detalhada dos jogadores */}
            <Card className="border border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Escalação</h3>
                <Badge className="bg-gray-600 text-white text-sm px-3 py-1">
                  {team.players.length} jogadores
                </Badge>
              </div>
              
              <div className="space-y-2">
                {team.players.map((player, playerIndex) => (
                  <div 
                    key={player.id}
                    className="flex items-center gap-3 p-2 bg-white rounded border transition-all duration-200 hover:shadow-sm animate-fade-in"
                    style={{ animationDelay: `${teamIndex * 0.1 + playerIndex * 0.05}s` }}
                  >
                    <span className="text-lg">{getPositionEmoji(player.position)}</span>
                    <span className="text-gray-900 font-medium flex-1">{player.name}</span>
                    <span className="text-xs text-gray-500">
                      {getPositionLabel(player.position)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Time reserva */}
      {reserveTeam && reserveTeam.players.length > 0 && (
        <Card className="border-2 border-orange-200 p-6 bg-gradient-to-br from-orange-50 to-white animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              Time Reserva
            </h3>
            <Badge className="bg-orange-600 text-white text-sm px-3 py-1">
              {reserveTeam.players.length} jogadores
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {reserveTeam.players.map((player, index) => (
              <div 
                key={player.id} 
                className="bg-white border border-orange-200 rounded-lg p-3 flex items-center gap-3 transition-all duration-200 hover:shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="text-lg">{getPositionEmoji(player.position)}</span>
                <div className="flex-1">
                  <span className="text-gray-900 font-medium block">{player.name}</span>
                  <span className="text-xs text-gray-500">{getPositionLabel(player.position)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeamsDisplay;
