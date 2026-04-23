
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users } from 'lucide-react';
import { Team } from '@/types/player';
import { getPositionEmoji, getPositionLabel } from '@/utils/positionUtils';
import CourtVisualization from './CourtVisualization';
import SectionCard from './SectionCard';

interface TeamsDisplayProps {
  teams: Team[];
}

const TeamsDisplay = ({ teams }: TeamsDisplayProps) => {
  if (teams.length === 0) return null;

  const regularTeams = teams.filter(team => !team.isReserve);
  const reserveTeam = teams.find(team => team.isReserve);
  const averages = regularTeams.map((team) => team.averageSkill ?? 0);
  const maxAverage = averages.length > 0 ? Math.max(...averages) : 0;
  const minAverage = averages.length > 0 ? Math.min(...averages) : 0;
  const balanceGap = Number((maxAverage - minAverage).toFixed(2));

  return (
    <SectionCard
      title="Times Sorteados"
      icon={<Trophy className="h-6 w-6" />}
      className="p-8"
      iconContainerClassName="h-10 w-10 bg-accent/15 text-accent"
    >
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-foreground/90">
          Equilíbrio estimado entre times: diferença média de <strong>{balanceGap}</strong>.
        </p>
      </div>

      {/* Times principais com visualização de quadra */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        {regularTeams.map((team, teamIndex) => (
          <div key={team.id} className="space-y-4">
            {/* Visualização da quadra */}
            <CourtVisualization
              players={team.players}
              teamId={team.id}
              requiresGoalkeeper={team.requiresGoalkeeper ?? true}
            />
            
            {/* Lista detalhada dos jogadores */}
            <Card className="border bg-secondary/35 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Escalação</h3>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {team.players.length} jogadores
                </Badge>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Força do time</span>
                  <span>{team.averageSkill?.toFixed(2) ?? '0.00'} média</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${Math.min(((team.averageSkill ?? 0) / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                {team.players.map((player, playerIndex) => (
                  <div 
                    key={player.id}
                    className="animate-fade-in flex items-center gap-3 rounded border bg-card p-2 transition-all duration-200 hover:shadow-sm"
                    style={{ animationDelay: `${teamIndex * 0.1 + playerIndex * 0.05}s` }}
                  >
                    <span className="text-lg">{getPositionEmoji(player.position)}</span>
                    <span className="flex-1 font-medium text-foreground">{player.name}</span>
                    {player.skillLevel !== undefined && (
                      <Badge variant="outline" className="text-[10px]">
                        N{player.skillLevel}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
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
        <Card className="animate-fade-in border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                <Users className="h-5 w-5 text-accent" />
              </div>
              Time Reserva
            </h3>
            <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1">
              {reserveTeam.players.length} jogadores
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {reserveTeam.players.map((player, index) => (
              <div 
                key={player.id} 
                className="animate-fade-in flex items-center gap-3 rounded-lg border border-accent/30 bg-card p-3 transition-all duration-200 hover:shadow-sm"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="text-lg">{getPositionEmoji(player.position)}</span>
                <div className="flex-1">
                  <span className="block font-medium text-foreground">{player.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {getPositionLabel(player.position)}
                    {player.skillLevel !== undefined ? ` · Nível ${player.skillLevel}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </SectionCard>
  );
};

export default TeamsDisplay;
