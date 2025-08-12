
import React, { useState, useEffect } from 'react';
import PlayerForm from '@/components/PlayerForm';
import PlayerList from '@/components/PlayerList';
import TeamDrawer from '@/components/TeamDrawer';
import TeamsDisplay from '@/components/TeamsDisplay';
import ExportButton from '@/components/ExportButton';
import { sortTeams } from '@/utils/teamSorter';
import { toast } from 'sonner';
import { Player, Team } from '@/types/player';

const STORAGE_KEYS = {
  PLAYERS: 'timefacil_players',
  TEAMS: 'timefacil_teams'
};

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    const savedTeams = localStorage.getItem(STORAGE_KEYS.TEAMS);
    
    if (savedPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedPlayers);
        setPlayers(parsedPlayers);
        console.log('Jogadores carregados do localStorage:', parsedPlayers);
      } catch (error) {
        console.error('Erro ao carregar jogadores do localStorage:', error);
      }
    }
    
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams);
        setTeams(parsedTeams);
        console.log('Times carregados do localStorage:', parsedTeams);
      } catch (error) {
        console.error('Erro ao carregar times do localStorage:', error);
      }
    }
  }, []);

  // Salvar jogadores no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    console.log('Jogadores salvos no localStorage:', players);
  }, [players]);

  // Salvar times no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    console.log('Times salvos no localStorage:', teams);
  }, [teams]);

  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      ...playerData
    };
    setPlayers(prev => [...prev, newPlayer]);
    toast.success(`${newPlayer.name} foi adicionado como ${playerData.position === 'goleiro' ? 'goleiro' : playerData.position}!`);
  };

  const updatePlayer = (id: string, updatedData: Omit<Player, 'id'>) => {
    setPlayers(prev => prev.map(player => player.id === id ? {
      ...player,
      ...updatedData
    } : player));
    toast.success('Jogador atualizado com sucesso!');
  };

  const deletePlayer = (id: string) => {
    const player = players.find(p => p.id === id);
    setPlayers(prev => prev.filter(player => player.id !== id));
    toast.success(`${player?.name} foi removido da lista!`);
  };

  const handleDrawTeams = (playersPerTeam: number) => {
    try {
      const sortedTeams = sortTeams(players, playersPerTeam);
      setTeams(sortedTeams);
      toast.success('Times sorteados com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao sortear times');
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header with animation */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-center text-5xl font-bold text-gray-900">
          ⚽ TimeFácil
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Sistema inteligente para sortear times de futebol
        </p>
        
        {/* Botão de exportar */}
        {(players.length > 0 || teams.length > 0) && (
          <div className="mt-6 flex justify-center">
            <ExportButton players={players} teams={teams} />
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-12">
        {/* Left sidebar - Forms */}
        <div className="xl:col-span-1 space-y-6">
          <div className="animate-slide-in-right">
            <PlayerForm onAddPlayer={addPlayer} />
          </div>
          <div className="animate-slide-in-right" style={{
          animationDelay: '0.1s'
        }}>
            <TeamDrawer players={players} onDrawTeams={handleDrawTeams} />
          </div>
        </div>
        
        {/* Right content - Player list */}
        <div className="xl:col-span-3">
          <div className="animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            <PlayerList players={players} onUpdatePlayer={updatePlayer} onDeletePlayer={deletePlayer} />
          </div>
        </div>
      </div>

      {/* Teams display */}
      {teams.length > 0 && <div className="animate-scale-in" style={{
      animationDelay: '0.3s'
    }}>
          <TeamsDisplay teams={teams} />
        </div>}
    </div>
  </div>;
};

export default Index;
