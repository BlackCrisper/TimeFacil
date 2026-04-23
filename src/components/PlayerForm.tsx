
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { Player, PlayerPosition } from '@/types/player';
import { positionConfig } from '@/utils/positionUtils';
import SectionCard from './SectionCard';

interface PlayerFormProps {
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
}

const PlayerForm = ({ onAddPlayer }: PlayerFormProps) => {
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>('so-linha');
  const [useSkillLevel, setUseSkillLevel] = useState(false);
  const [playerSkillLevel, setPlayerSkillLevel] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsSubmitting(true);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onAddPlayer({
        name: playerName.trim(),
        position: playerPosition,
        skillLevel: useSkillLevel ? playerSkillLevel : undefined
      });
      
      setPlayerName('');
      setPlayerPosition('so-linha');
      setUseSkillLevel(false);
      setPlayerSkillLevel(3);
      setIsSubmitting(false);
    }
  };

  return (
    <SectionCard
      title="Adicionar Jogador"
      icon={<Plus className="h-5 w-5" />}
      iconContainerClassName="bg-accent/15 text-accent"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="playerName" className="font-medium text-foreground/90">
            Nome do Jogador
          </Label>
          <Input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Digite o nome do jogador"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="playerPosition" className="font-medium text-foreground/90">
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

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border/70 bg-secondary/40 px-3 py-2">
            <Label htmlFor="useSkillLevel" className="font-medium text-foreground/90">
              Informar nível técnico
            </Label>
            <Switch
              id="useSkillLevel"
              checked={useSkillLevel}
              onCheckedChange={setUseSkillLevel}
            />
          </div>
          {useSkillLevel && (
            <div className="space-y-2">
              <Label htmlFor="playerSkillLevel" className="font-medium text-foreground/90">
                Nível Técnico
              </Label>
              <Select value={String(playerSkillLevel)} onValueChange={(value) => setPlayerSkillLevel(Number(value))}>
                <SelectTrigger id="playerSkillLevel" className="w-full">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Iniciante</SelectItem>
                  <SelectItem value="2">2 - Recreativo</SelectItem>
                  <SelectItem value="3">3 - Intermediário</SelectItem>
                  <SelectItem value="4">4 - Competitivo</SelectItem>
                  <SelectItem value="5">5 - Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting || !playerName.trim()}
          variant="default"
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" />
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
    </SectionCard>
  );
};

export default PlayerForm;
