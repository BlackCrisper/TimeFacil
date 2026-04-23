import PlayerForm from '@/components/PlayerForm';
import PlayerList from '@/components/PlayerList';
import { useAppState } from '@/features/app-state/AppStateContext';

const Jogadores = () => {
  const { players, addPlayer, updatePlayer, deletePlayer } = useAppState();

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground">
        Etapa 1: cadastre e organize os jogadores antes do sorteio.
      </div>
      <PlayerForm onAddPlayer={addPlayer} />
      <PlayerList players={players} onUpdatePlayer={updatePlayer} onDeletePlayer={deletePlayer} />
    </section>
  );
};

export default Jogadores;
