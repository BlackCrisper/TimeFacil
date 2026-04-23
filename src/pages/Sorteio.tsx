import TeamDrawer from '@/components/TeamDrawer';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/features/app-state/AppStateContext';

const Sorteio = () => {
  const { players, teams, drawTeams, clearTeams, lastDrawConfig } = useAppState();

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground">
        Etapa 2: configure regras de sorteio e gere novos times.
      </div>

      <TeamDrawer players={players} onDrawTeams={drawTeams} />

      <div className="rounded-xl border border-border/60 bg-card/80 p-4">
        <div className="mb-3 text-sm text-foreground">
          <p className="font-semibold">Resumo do último sorteio</p>
          {lastDrawConfig ? (
            <p className="text-muted-foreground">
              {lastDrawConfig.playersPerTeam} por time · {lastDrawConfig.enforceGoalkeeper ? 'com' : 'sem'} goleiro obrigatório
            </p>
          ) : (
            <p className="text-muted-foreground">Nenhum sorteio registrado ainda.</p>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full"
          disabled={teams.length === 0}
          onClick={clearTeams}
        >
          Limpar times atuais
        </Button>
      </div>
    </section>
  );
};

export default Sorteio;
