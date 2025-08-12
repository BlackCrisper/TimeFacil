
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Edit, Trash2, Check, X } from 'lucide-react';
import { Player, PlayerPosition } from '@/types/player';
import { getPositionLabel, getPositionEmoji, getPositionColor } from '@/utils/positionUtils';

interface PlayerListProps {
  players: Player[];
  onUpdatePlayer: (id: string, updatedData: Omit<Player, 'id'>) => void;
  onDeletePlayer: (id: string) => void;
}

const PlayerList = ({ players, onUpdatePlayer, onDeletePlayer }: PlayerListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState<PlayerPosition>('goleiro');

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setEditName(player.name);
    setEditPosition(player.position);
  };

  const saveEdit = (player: Player) => {
    if (editName.trim()) {
      onUpdatePlayer(player.id, {
        name: editName.trim(),
        position: editPosition
      });
    }
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
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
      className="border p-4 transition-all duration-300 hover:shadow-md animate-fade-in bg-white border-gray-200"
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
            <Button
              size="sm"
              onClick={() => saveEdit(player)}
              className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
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
              <span className="text-gray-900 font-medium">{player.name}</span>
              <Badge className={`text-xs text-white ${getPositionColor(player.position)}`}>
                {getPositionLabel(player.position)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => startEditing(player)}
                className="h-8 w-8 p-0 hover:bg-blue-100"
              >
                <Edit className="h-3 w-3 text-blue-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeletePlayer(player.id)}
                className="h-8 w-8 p-0 hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
        <Users className="w-6 h-6 text-gray-600" />
        Jogadores Cadastrados ({players.length})
      </h2>
      
      {players.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">Nenhum jogador cadastrado ainda</p>
          <p className="text-gray-400 text-sm mt-1">Adicione jogadores para começar</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(playersByPosition).map(([position, positionPlayers]) => (
            <div key={position} className="animate-fade-in">
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
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
    </div>
  );
};

export default PlayerList;
