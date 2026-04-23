import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Player, Team } from '@/types/player';
import { sortTeams } from '@/utils/teamSorter';

const STORAGE_KEYS = {
  PLAYERS: 'timefacil_players',
  TEAMS: 'timefacil_teams',
  LAST_DRAW: 'timefacil_last_draw'
} as const;

type LastDrawConfig = {
  playersPerTeam: number;
  enforceGoalkeeper: boolean;
  drawnAt: string;
};

interface AppStateContextValue {
  players: Player[];
  teams: Team[];
  lastDrawConfig: LastDrawConfig | null;
  addPlayer: (playerData: Omit<Player, 'id'>) => void;
  updatePlayer: (id: string, updatedData: Omit<Player, 'id'>) => void;
  deletePlayer: (id: string) => void;
  drawTeams: (playersPerTeam: number, enforceGoalkeeper: boolean) => void;
  clearTeams: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [lastDrawConfig, setLastDrawConfig] = useState<LastDrawConfig | null>(null);

  useEffect(() => {
    try {
      const savedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
      const savedTeams = localStorage.getItem(STORAGE_KEYS.TEAMS);
      const savedLastDraw = localStorage.getItem(STORAGE_KEYS.LAST_DRAW);

      if (savedPlayers) {
        setPlayers(JSON.parse(savedPlayers));
      }
      if (savedTeams) {
        setTeams(JSON.parse(savedTeams));
      }
      if (savedLastDraw) {
        setLastDrawConfig(JSON.parse(savedLastDraw));
      }
    } catch (error) {
      console.error('Erro ao carregar estado local:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    if (lastDrawConfig) {
      localStorage.setItem(STORAGE_KEYS.LAST_DRAW, JSON.stringify(lastDrawConfig));
    }
  }, [lastDrawConfig]);

  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...playerData
    };
    setPlayers((prev) => [...prev, newPlayer]);
    toast.success(`${newPlayer.name} adicionado com sucesso.`);
  };

  const updatePlayer = (id: string, updatedData: Omit<Player, 'id'>) => {
    setPlayers((prev) =>
      prev.map((player) => (player.id === id ? { ...player, ...updatedData } : player))
    );
    toast.success('Jogador atualizado com sucesso.');
  };

  const deletePlayer = (id: string) => {
    const player = players.find((p) => p.id === id);
    setPlayers((prev) => prev.filter((player) => player.id !== id));
    toast.success(`${player?.name ?? 'Jogador'} removido.`);
  };

  const drawTeams = (playersPerTeam: number, enforceGoalkeeper: boolean) => {
    try {
      const sortedTeams = sortTeams(players, playersPerTeam, { enforceGoalkeeper });
      setTeams(sortedTeams);

      const regularTeams = sortedTeams.filter((team) => !team.isReserve);
      const averages = regularTeams.map((team) => team.averageSkill ?? 0);
      const highestAverage = averages.length > 0 ? Math.max(...averages) : 0;
      const lowestAverage = averages.length > 0 ? Math.min(...averages) : 0;
      const diff = Number((highestAverage - lowestAverage).toFixed(2));

      setLastDrawConfig({
        playersPerTeam,
        enforceGoalkeeper,
        drawnAt: new Date().toISOString()
      });

      toast.success(
        `Times sorteados (${enforceGoalkeeper ? 'com' : 'sem'} goleiro obrigatório). Diferença média: ${diff}`
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao sortear times');
    }
  };

  const clearTeams = () => {
    setTeams([]);
    toast.success('Times limpos. Faça um novo sorteio.');
  };

  const value = useMemo(
    () => ({
      players,
      teams,
      lastDrawConfig,
      addPlayer,
      updatePlayer,
      deletePlayer,
      drawTeams,
      clearTeams
    }),
    [players, teams, lastDrawConfig]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState deve ser usado dentro de AppStateProvider');
  }
  return context;
};
