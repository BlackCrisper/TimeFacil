
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shuffle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Player } from '@/types/player';

interface TeamDrawerProps {
  players: Player[];
  onDrawTeams: (playersPerTeam: number) => void;
}

const TeamDrawer = ({ players, onDrawTeams }: TeamDrawerProps) => {
  const [playersPerTeam, setPlayersPerTeam] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  const goalkeepers = players.filter(p => p.position === 'goleiro');
  const totalPlayers = players.length;
  const maxPossibleTeams = Math.floor(totalPlayers / playersPerTeam);
  const teamsWithGoalkeepers = Math.min(maxPossibleTeams, goalkeepers.length);

  const handleDraw = async () => {
    if (goalkeepers.length === 0) {
      alert('É necessário pelo menos 1 goleiro para formar times!');
      return;
    }
    if (totalPlayers < playersPerTeam) {
      alert(`Número insuficiente de jogadores! Você precisa de pelo menos ${playersPerTeam} jogadores.`);
      return;
    }
    
    setIsDrawing(true);
    
    // Adiciona uma animação de suspense
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onDrawTeams(playersPerTeam);
    setIsDrawing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Shuffle className="w-5 h-5 text-blue-600" />
        </div>
        Sortear Times
      </h2>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="playersPerTeam" className="text-gray-700 font-medium">
            Jogadores por Time
          </Label>
          <Input
            id="playersPerTeam"
            type="number"
            min="3"
            max="11"
            value={playersPerTeam}
            onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {totalPlayers > 0 && (
          <Alert className="bg-blue-50 border-blue-200 animate-fade-in">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-gray-700">
              <div className="space-y-1 text-sm">
                <p><strong>Total de jogadores:</strong> {totalPlayers}</p>
                <p><strong>Goleiros disponíveis:</strong> {goalkeepers.length}</p>
                <p><strong>Times completos possíveis:</strong> {teamsWithGoalkeepers}</p>
                {totalPlayers % playersPerTeam > 0 && (
                  <p><strong>Jogadores no time reserva:</strong> {totalPlayers - (teamsWithGoalkeepers * playersPerTeam)}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleDraw}
          disabled={totalPlayers === 0 || goalkeepers.length === 0 || isDrawing}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform ${
            isDrawing ? 'scale-95' : 'hover:scale-105'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {isDrawing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
    </div>
  );
};

export default TeamDrawer;
