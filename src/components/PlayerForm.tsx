
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Player, PlayerPosition } from '@/types/player';
import { positionConfig } from '@/utils/positionUtils';

interface PlayerFormProps {
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
}

const PlayerForm = ({ onAddPlayer }: PlayerFormProps) => {
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>('so-linha');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsSubmitting(true);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onAddPlayer({
        name: playerName.trim(),
        position: playerPosition
      });
      
      setPlayerName('');
      setPlayerPosition('so-linha');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-green-600" />
        </div>
        Adicionar Jogador
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="playerName" className="text-gray-700 font-medium">
            Nome do Jogador
          </Label>
          <Input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Digite o nome do jogador"
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="playerPosition" className="text-gray-700 font-medium">
            Posição Preferida
          </Label>
          <Select value={playerPosition} onValueChange={(value: PlayerPosition) => setPlayerPosition(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a posição" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(positionConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span>{config.emoji}</span>
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting || !playerName.trim()}
          className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform ${
            isSubmitting ? 'scale-95' : 'hover:scale-105'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adicionando...
            </div>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Jogador
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default PlayerForm;
