import ExportButton from '@/components/ExportButton';
import TeamsDisplay from '@/components/TeamsDisplay';
import { useAppState } from '@/features/app-state/AppStateContext';

const Escalacoes = () => {
  const { players, teams } = useAppState();

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground">
        Etapa 3: confira as escalações e ajuste seu jogo.
      </div>

      {(players.length > 0 || teams.length > 0) && (
        <div className="rounded-xl border border-border/60 bg-card/80 p-3">
          <ExportButton players={players} teams={teams} />
        </div>
      )}

      {teams.length > 0 ? (
        <TeamsDisplay teams={teams} />
      ) : (
        <div className="rounded-xl border border-dashed border-border/70 bg-card/80 p-6 text-center text-sm text-muted-foreground">
          Ainda não há escalações. Vá para a seção de Sorteio para gerar os times.
        </div>
      )}
    </section>
  );
};

export default Escalacoes;
