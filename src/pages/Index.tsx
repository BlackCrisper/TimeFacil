
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/features/app-state/AppStateContext';

const Index = () => {
  const { players, teams, lastDrawConfig } = useAppState();
  const regularTeams = teams.filter((team) => !team.isReserve);
  const isFirstRun = players.length === 0 && teams.length === 0 && !lastDrawConfig;

  return (
    <section className="space-y-4">
      {isFirstRun && (
        <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5">
          <h2 className="text-lg font-bold text-foreground">Primeiros passos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Em menos de 1 minuto você já consegue gerar o primeiro sorteio.
          </p>
          <ol className="mt-3 space-y-2 text-sm text-foreground/90">
            <li>1. Cadastre os jogadores na seção Jogadores</li>
            <li>2. Configure o sorteio na seção Sorteio</li>
            <li>3. Revise a formação final em Escalações</li>
          </ol>
        </div>
      )}

      <div className="rounded-2xl border border-border/70 bg-card/85 p-5">
        <h2 className="text-lg font-bold text-foreground">Painel da rodada</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Siga o fluxo recomendado: Jogadores, Sorteio e Escalações.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-secondary/60 p-3">
            <p className="text-xs text-muted-foreground">Jogadores</p>
            <p className="text-xl font-bold">{players.length}</p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-3">
            <p className="text-xs text-muted-foreground">Times</p>
            <p className="text-xl font-bold">{regularTeams.length}</p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-3">
            <p className="text-xs text-muted-foreground">Reserva</p>
            <p className="text-xl font-bold">{teams.find((team) => team.isReserve)?.players.length ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 p-5">
        <h3 className="font-semibold text-foreground">Acesso rápido</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Button asChild className="w-full">
            <Link to="/jogadores">Etapa 1: Jogadores</Link>
          </Button>
          <Button asChild className="w-full" variant="secondary">
            <Link to="/sorteio">Etapa 2: Sorteio</Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link to="/escalacoes">Etapa 3: Escalações</Link>
          </Button>
        </div>
        <div className="mt-3">
          <Button asChild className="w-full sm:w-auto" variant="ghost">
            <Link to="/instalar">Instalar app no dispositivo</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 text-sm text-muted-foreground">
        {lastDrawConfig ? (
          <>
            Último sorteio: {lastDrawConfig.playersPerTeam} por time ·{' '}
            {lastDrawConfig.enforceGoalkeeper ? 'com' : 'sem'} goleiro obrigatório.
          </>
        ) : (
          <>Nenhum sorteio registrado ainda.</>
        )}
      </div>
    </section>
  );
};

export default Index;
