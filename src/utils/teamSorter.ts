
import { Player, Team, TeamPositions } from '@/types/player';

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const sortTeams = (players: Player[], playersPerTeam: number): Team[] => {
  // Separar jogadores por posição
  const goalkeepers = players.filter(p => p.position === 'goleiro');
  const defenders = players.filter(p => p.position === 'zagueiro');
  const leftWings = players.filter(p => p.position === 'ala-esquerda');
  const rightWings = players.filter(p => p.position === 'ala-direita');
  const attackers = players.filter(p => p.position === 'atacante');
  const anyField = players.filter(p => p.position === 'so-linha');
  
  if (goalkeepers.length === 0) {
    throw new Error('É necessário pelo menos 1 goleiro para formar times!');
  }
  
  const totalPlayers = players.length;
  const maxPossibleTeams = Math.floor(totalPlayers / playersPerTeam);
  const teamsToCreate = Math.min(maxPossibleTeams, goalkeepers.length);
  
  if (teamsToCreate === 0) {
    throw new Error(`Número insuficiente de jogadores! Você precisa de pelo menos ${playersPerTeam} jogadores.`);
  }
  
  // Embaralhar jogadores
  const shuffledGoalkeepers = shuffleArray(goalkeepers);
  const shuffledDefenders = shuffleArray(defenders);
  const shuffledLeftWings = shuffleArray(leftWings);
  const shuffledRightWings = shuffleArray(rightWings);
  const shuffledAttackers = shuffleArray(attackers);
  const shuffledAnyField = shuffleArray(anyField);
  
  const teams: Team[] = [];
  const usedPlayers = new Set<string>();
  
  // Criar times completos
  for (let i = 0; i < teamsToCreate; i++) {
    const team: Team = {
      id: i + 1,
      players: []
    };
    
    // Adicionar goleiro (obrigatório)
    const goalkeeper = shuffledGoalkeepers[i];
    team.players.push(goalkeeper);
    usedPlayers.add(goalkeeper.id);
    
    // Função auxiliar para preencher posição
    const fillPosition = (preferredPlayers: Player[], fallbackPlayers: Player[]): Player | null => {
      // Primeiro, tentar com jogadores da posição preferida
      for (const player of preferredPlayers) {
        if (!usedPlayers.has(player.id)) {
          usedPlayers.add(player.id);
          return player;
        }
      }
      
      // Se não houver, usar jogadores "só linha"
      for (const player of fallbackPlayers) {
        if (!usedPlayers.has(player.id)) {
          usedPlayers.add(player.id);
          return player;
        }
      }
      
      return null;
    };
    
    // Preencher as outras posições
    const defender = fillPosition(shuffledDefenders, shuffledAnyField);
    const leftWing = fillPosition(shuffledLeftWings, shuffledAnyField);
    const rightWing = fillPosition(shuffledRightWings, shuffledAnyField);
    const attacker = fillPosition(shuffledAttackers, shuffledAnyField);
    
    // Adicionar jogadores que foram alocados
    [defender, leftWing, rightWing, attacker].forEach(player => {
      if (player) team.players.push(player);
    });
    
    // Se o time ainda não está completo, preencher com qualquer jogador disponível
    const allRemainingPlayers = shuffleArray([
      ...shuffledDefenders,
      ...shuffledLeftWings,
      ...shuffledRightWings,
      ...shuffledAttackers,
      ...shuffledAnyField
    ]);
    
    while (team.players.length < playersPerTeam && allRemainingPlayers.length > 0) {
      for (const player of allRemainingPlayers) {
        if (!usedPlayers.has(player.id) && team.players.length < playersPerTeam) {
          team.players.push(player);
          usedPlayers.add(player.id);
          break;
        }
      }
      break; // Evitar loop infinito
    }
    
    teams.push(team);
  }
  
  // Criar time reserva com jogadores restantes
  const remainingPlayers = players.filter(player => !usedPlayers.has(player.id));
  
  if (remainingPlayers.length > 0) {
    teams.push({
      id: 0,
      players: shuffleArray(remainingPlayers),
      isReserve: true
    });
  }
  
  return teams;
};
