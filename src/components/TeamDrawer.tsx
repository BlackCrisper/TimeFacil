
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shuffle, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Player } from '@/types/player';
import { toast } from 'sonner';
import SectionCard from './SectionCard';

interface TeamDrawerProps {
  players: Player[];
  onDrawTeams: (playersPerTeam: number, enforceGoalkeeper: boolean) => void;
}

const TeamDrawer = ({ players, onDrawTeams }: TeamDrawerProps) => {
  const [playersPerTeam, setPlayersPerTeam] = useState(5);
  const [enforceGoalkeeper, setEnforceGoalkeeper] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);

  const goalkeepers = players.filter(p => p.position === 'goleiro');
  const totalPlayers = players.length;
  const maxPossibleTeams = Math.floor(totalPlayers / playersPerTeam);
  const teamsWithGoalkeepers = Math.min(maxPossibleTeams, goalkeepers.length);

  const handleDraw = async () => {
    if (enforceGoalkeeper && goalkeepers.length === 0) {
      toast.error('É necessário pelo menos 1 goleiro para formar times.');
      return;
    }
    if (totalPlayers < playersPerTeam) {
      toast.error(`Número insuficiente de jogadores. Você precisa de pelo menos ${playersPerTeam} jogadores.`);
      return;
    }
    
    setIsDrawing(true);
    
    // Adiciona uma animação de suspense
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onDrawTeams(playersPerTeam, enforceGoalkeeper);
    setIsDrawing(false);
  };

  return (
    <SectionCard
      title="Sortear Times"
      icon={<Shuffle className="h-5 w-5" />}
      iconContainerClassName="bg-primary/15 text-primary"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="playersPerTeam" className="font-medium text-foreground/90">
            Jogadores por Time
          </Label>
          <Input
            id="playersPerTeam"
            type="number"
            min="3"
            max="11"
            value={playersPerTeam}
            onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
          />
        </div>
        
        <div className="flex items-center justify-between rounded-lg border border-border/70 bg-secondary/40 px-3 py-2">
          <div>
            <Label htmlFor="enforceGoalkeeper" className="font-medium text-foreground/90">
              Exigir goleiro por time
            </Label>
            <p className="text-xs text-muted-foreground">
              Desative para sortear sem obrigação de 1 goleiro em cada time.
            </p>
          </div>
          <Switch
            id="enforceGoalkeeper"
            checked={enforceGoalkeeper}
            onCheckedChange={setEnforceGoalkeeper}
          />
        </div>

        {totalPlayers > 0 && (
          <Alert className="animate-fade-in border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground/80">
              <div className="space-y-1 text-sm">
                <p><strong>Total de jogadores:</strong> {totalPlayers}</p>
                <p><strong>Goleiros disponíveis:</strong> {goalkeepers.length}</p>
                <p>
                  <strong>Times completos possíveis:</strong>{' '}
                  {enforceGoalkeeper ? teamsWithGoalkeepers : maxPossibleTeams}
                </p>
                <p>
                  <strong>Modo:</strong>{' '}
                  {enforceGoalkeeper
                    ? 'Balanceamento avançado com goleiro obrigatório'
                    : 'Balanceamento avançado sem obrigar goleiro por time'}
                </p>
                {totalPlayers % playersPerTeam > 0 && (
                  <p>
                    <strong>Jogadores no time reserva:</strong>{' '}
                    {totalPlayers - ((enforceGoalkeeper ? teamsWithGoalkeepers : maxPossibleTeams) * playersPerTeam)}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleDraw}
          disabled={totalPlayers === 0 || (enforceGoalkeeper && goalkeepers.length === 0) || isDrawing}
          className="w-full"
        >
          {isDrawing ? (
            <div className="flex items-center gap-2" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sorteando...
            </div>
          ) : (
            <>
              <Shuffle className="w-4 h-4 mr-2" />
              Sortear Times
            </>
          )}
        </Button>
      </div>
    </SectionCard>
  );
};

export default TeamDrawer;
