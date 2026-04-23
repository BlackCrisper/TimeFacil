
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Edit, Trash2, Check, X } from 'lucide-react';
import { Player, PlayerPosition } from '@/types/player';
import { getPositionLabel, getPositionEmoji, getPositionColor } from '@/utils/positionUtils';
import SectionCard from './SectionCard';

interface PlayerListProps {
  players: Player[];
  onUpdatePlayer: (id: string, updatedData: Omit<Player, 'id'>) => void;
  onDeletePlayer: (id: string) => void;
}

const PlayerList = ({ players, onUpdatePlayer, onDeletePlayer }: PlayerListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState<PlayerPosition>('goleiro');
  const [editUseSkillLevel, setEditUseSkillLevel] = useState(false);
  const [editSkillLevel, setEditSkillLevel] = useState(3);

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setEditName(player.name);
    setEditPosition(player.position);
    setEditUseSkillLevel(player.skillLevel !== undefined);
    setEditSkillLevel(player.skillLevel ?? 3);
  };

  const saveEdit = (player: Player) => {
    if (editName.trim()) {
      onUpdatePlayer(player.id, {
        name: editName.trim(),
        position: editPosition,
        skillLevel: editUseSkillLevel ? editSkillLevel : undefined
      });
    }
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditUseSkillLevel(false);
    setEditSkillLevel(3);
  };

  // Agrupar jogadores por posição
  const playersByPosition = players.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {} as Record<string, Player[]>);

  const PlayerCard = ({ player, index }: { player: Player; index: number }) => (
    <Card 
      key={player.id} 
      className="animate-fade-in border p-4 transition-all duration-300 hover:shadow-md"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center justify-between">
        {editingId === player.id ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit(player);
                if (e.key === 'Escape') cancelEdit();
              }}
              autoFocus
            />
            <Select value={editPosition} onValueChange={(value: PlayerPosition) => setEditPosition(value)}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goleiro">🟦 Goleiro</SelectItem>
                <SelectItem value="zagueiro">🟩 Zagueiro</SelectItem>
                <SelectItem value="ala-esquerda">🟨 Ala Esquerda</SelectItem>
                <SelectItem value="ala-direita">🟨 Ala Direita</SelectItem>
                <SelectItem value="atacante">🟥 Atacante</SelectItem>
                <SelectItem value="so-linha">⚽ Só Linha</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 rounded border border-border px-2 py-1">
              <span className="text-[10px] text-muted-foreground">Nivel</span>
              <Switch
                checked={editUseSkillLevel}
                onCheckedChange={setEditUseSkillLevel}
                aria-label="Ativar nível técnico"
              />
            </div>
            {editUseSkillLevel && (
              <Select value={String(editSkillLevel)} onValueChange={(value) => setEditSkillLevel(Number(value))}>
                <SelectTrigger className="h-8 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Nivel 1</SelectItem>
                  <SelectItem value="2">Nivel 2</SelectItem>
                  <SelectItem value="3">Nivel 3</SelectItem>
                  <SelectItem value="4">Nivel 4</SelectItem>
                  <SelectItem value="5">Nivel 5</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button
              size="sm"
              onClick={() => saveEdit(player)}
              className="h-8 w-8 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={cancelEdit}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xl">{getPositionEmoji(player.position)}</span>
              <span className="font-medium text-foreground">{player.name}</span>
              <Badge className={`text-xs text-white ${getPositionColor(player.position)}`}>
                {getPositionLabel(player.position)}
              </Badge>
              {player.skillLevel !== undefined && (
                <Badge variant="outline" className="text-xs">
                  Nivel {player.skillLevel}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => startEditing(player)}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                aria-label={`Editar ${player.name}`}
              >
                <Edit className="h-3 w-3 text-primary" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeletePlayer(player.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
                aria-label={`Excluir ${player.name}`}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );

  return (
    <SectionCard
      title={`Jogadores Cadastrados (${players.length})`}
      icon={<Users className="h-5 w-5" />}
      iconContainerClassName="bg-secondary text-secondary-foreground"
    >
      {players.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">Nenhum jogador cadastrado ainda</p>
          <p className="mt-1 text-sm text-muted-foreground/80">Adicione jogadores para começar</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(playersByPosition).map(([position, positionPlayers]) => (
            <div key={position} className="animate-fade-in">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-foreground/90">
                <span className="text-xl">{getPositionEmoji(position as any)}</span>
                <span>{getPositionLabel(position as any)} ({positionPlayers.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {positionPlayers.map((player, index) => (
                  <PlayerCard key={player.id} player={player} index={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default PlayerList;
