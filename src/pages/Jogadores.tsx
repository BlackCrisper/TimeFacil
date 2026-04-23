import PlayerForm from '@/components/PlayerForm';
import PlayerList from '@/components/PlayerList';
import { useAppState } from '@/features/app-state/AppStateContext';

const Jogadores = () => {
  const { players, addPlayer, updatePlayer, deletePlayer } = useAppState();

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground">
        Etapa 1: cadastre e revise os jogadores. Quanto mais atualizada a lista, melhor o sorteio.
      </div>
      {players.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
          Comece adicionando pelo menos 5 jogadores para habilitar um sorteio completo.
        </div>
      )}
      <PlayerForm onAddPlayer={addPlayer} />
      <PlayerList players={players} onUpdatePlayer={updatePlayer} onDeletePlayer={deletePlayer} />
    </section>
  );
};

export default Jogadores;
