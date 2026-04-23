
import { Player, Team } from '@/types/player';

export interface SortTeamsOptions {
  enforceGoalkeeper: boolean;
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getPlayerSkill = (player: Player): number => player.skillLevel ?? 3;

export const sortTeams = (
  players: Player[],
  playersPerTeam: number,
  options: SortTeamsOptions = { enforceGoalkeeper: true }
): Team[] => {
  const goalkeepers = players.filter((p) => p.position === 'goleiro');

  if (options.enforceGoalkeeper && goalkeepers.length === 0) {
    throw new Error('É necessário pelo menos 1 goleiro para formar times!');
  }

  const totalPlayers = players.length;
  const maxPossibleTeams = Math.floor(totalPlayers / playersPerTeam);
  const teamsToCreate = options.enforceGoalkeeper
    ? Math.min(maxPossibleTeams, goalkeepers.length)
    : maxPossibleTeams;

  if (teamsToCreate === 0) {
    throw new Error(`Número insuficiente de jogadores! Você precisa de pelo menos ${playersPerTeam} jogadores.`);
  }

  const teams: Team[] = Array.from({ length: teamsToCreate }, (_, index) => ({
    id: index + 1,
    players: [],
    requiresGoalkeeper: options.enforceGoalkeeper
  }));

  const goalkeeperRandomWeights = new Map(goalkeepers.map((player) => [player.id, Math.random()]));
  const sortedGoalkeepers = shuffleArray(goalkeepers).sort((a, b) => {
    const skillDiff = getPlayerSkill(b) - getPlayerSkill(a);
    if (skillDiff !== 0) return skillDiff;
    return (goalkeeperRandomWeights.get(a.id) ?? 0) - (goalkeeperRandomWeights.get(b.id) ?? 0);
  });
  if (options.enforceGoalkeeper) {
    sortedGoalkeepers.forEach((goalkeeper, index) => {
      if (index < teams.length) {
        teams[index].players.push(goalkeeper);
      }
    });
  }

  const assignedIds = new Set(
    options.enforceGoalkeeper
      ? sortedGoalkeepers.slice(0, teamsToCreate).map((player) => player.id)
      : []
  );
  const remainingPlayers = players.filter((player) => !assignedIds.has(player.id));
  const randomWeights = new Map(remainingPlayers.map((player) => [player.id, Math.random()]));

  const rankedRemainingPlayers = shuffleArray(remainingPlayers).sort((a, b) => {
    const skillDiff = getPlayerSkill(b) - getPlayerSkill(a);
    if (skillDiff !== 0) {
      return skillDiff;
    }
    if (a.position === b.position) {
      return (randomWeights.get(a.id) ?? 0) - (randomWeights.get(b.id) ?? 0);
    }
    return (randomWeights.get(a.id) ?? 0) - (randomWeights.get(b.id) ?? 0);
  });

  const baseTeamOrder = shuffleArray(Array.from({ length: teams.length }, (_, index) => index));

  const getSnakeTeamIndex = (pickIndex: number): number => {
    const cycle = Math.floor(pickIndex / teams.length);
    const offset = pickIndex % teams.length;
    return cycle % 2 === 0
      ? baseTeamOrder[offset]
      : baseTeamOrder[teams.length - 1 - offset];
  };

  let pickIndex = 0;
  for (const player of rankedRemainingPlayers) {
    const availableTeamIndexes = teams
      .map((team, index) => ({ team, index }))
      .filter(({ team }) => team.players.length < playersPerTeam)
      .map(({ index }) => index);

    if (availableTeamIndexes.length === 0) {
      break;
    }

    const snakeTarget = getSnakeTeamIndex(pickIndex);
    const fallbackTeamIndex = availableTeamIndexes[0];
    const targetTeamIndex = availableTeamIndexes.includes(snakeTarget) ? snakeTarget : fallbackTeamIndex;
    teams[targetTeamIndex].players.push(player);
    assignedIds.add(player.id);
    pickIndex += 1;
  }

  const calculateTeamScore = (team: Team): number => {
    const totalSkill = team.players.reduce((sum, player) => sum + getPlayerSkill(player), 0);
    const positionBonus = new Set(team.players.map((player) => player.position)).size * 0.2;
    return totalSkill + positionBonus;
  };

  const tryBalanceTeams = () => {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const scoredTeams = teams.map((team, index) => ({
        team,
        index,
        score: calculateTeamScore(team)
      }));
      const strongest = scoredTeams.reduce((max, current) => (current.score > max.score ? current : max), scoredTeams[0]);
      const weakest = scoredTeams.reduce((min, current) => (current.score < min.score ? current : min), scoredTeams[0]);

      if (strongest.score - weakest.score <= 1.2) {
        break;
      }

      const sourceTeam = teams[strongest.index];
      const targetTeam = teams[weakest.index];

      const sourceCandidates = sourceTeam.players
        .filter((player) => !options.enforceGoalkeeper || player.position !== 'goleiro')
        .sort((a, b) => getPlayerSkill(b) - getPlayerSkill(a));
      const targetCandidates = targetTeam.players
        .filter((player) => !options.enforceGoalkeeper || player.position !== 'goleiro')
        .sort((a, b) => getPlayerSkill(a) - getPlayerSkill(b));

      if (sourceCandidates.length === 0 || targetCandidates.length === 0) {
        break;
      }

      const swapOut = sourceCandidates[0];
      const swapIn = targetCandidates[0];

      if (getPlayerSkill(swapOut) <= getPlayerSkill(swapIn)) {
        break;
      }

      sourceTeam.players = sourceTeam.players.map((player) => (player.id === swapOut.id ? swapIn : player));
      targetTeam.players = targetTeam.players.map((player) => (player.id === swapIn.id ? swapOut : player));
    }
  };

  tryBalanceTeams();

  const hydratedTeams = teams.map((team) => {
    const totalSkill = team.players.reduce((sum, player) => sum + getPlayerSkill(player), 0);
    const averageSkill = team.players.length > 0 ? totalSkill / team.players.length : 0;
    const uniquePositions = new Set(team.players.map((player) => player.position)).size;
    const balanceScore = Number((averageSkill + uniquePositions * 0.15).toFixed(2));

    return {
      ...team,
      totalSkill,
      averageSkill: Number(averageSkill.toFixed(2)),
      balanceScore,
      requiresGoalkeeper: options.enforceGoalkeeper
    };
  });

  const reservePlayers = players.filter((player) => !assignedIds.has(player.id));
  if (reservePlayers.length > 0) {
    teams.push({
      id: 0,
      players: shuffleArray(reservePlayers),
      isReserve: true,
      requiresGoalkeeper: options.enforceGoalkeeper
    });
  }

  return [...hydratedTeams, ...teams.filter((team) => team.isReserve)];
};
