import { Home, Users, Shuffle, ClipboardList, Download, X } from 'lucide-react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppState } from '@/features/app-state/AppStateContext';
import { usePwaInstall } from '@/hooks/usePwaInstall';

const links = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/jogadores', label: 'Jogadores', icon: Users },
  { to: '/sorteio', label: 'Sorteio', icon: Shuffle },
  { to: '/escalacoes', label: 'Escalacoes', icon: ClipboardList }
];

const AppShell = () => {
  const { players, teams } = useAppState();
  const { canInstall, dismissed, install, dismiss } = usePwaInstall();
  const regularTeams = teams.filter((team) => !team.isReserve).length;

  return (
    <div className="street-surface min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-3 pb-24 pt-3 sm:px-4 sm:pb-10 sm:pt-6">
        <header className="sticky top-0 z-20 mb-4 rounded-xl border border-border/60 bg-background/85 p-3 backdrop-blur sm:mb-6">
          <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-2xl font-black text-transparent sm:text-3xl">
            TimeFácil App
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Fluxo em 3 etapas: Jogadores, Sorteio e Escalações
          </p>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="rounded-full bg-card px-3 py-1 text-foreground">Jogadores: {players.length}</span>
            <span className="rounded-full bg-card px-3 py-1 text-foreground">Times: {regularTeams}</span>
          </div>
        </header>

        {canInstall && !dismissed && (
          <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm">
                <p className="font-semibold text-foreground">Instale o app no seu celular</p>
                <p className="text-muted-foreground">
                  Tenha acesso rápido e experiência de aplicativo no dia do jogo.
                </p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                className="rounded p-1 text-muted-foreground hover:bg-background/60"
                aria-label="Fechar aviso de instalação"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void install()}
                className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
              >
                <Download className="h-3 w-3" />
                Instalar agora
              </button>
              <Link
                to="/instalar"
                className="inline-flex items-center rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              >
                Ver detalhes
              </Link>
            </div>
          </div>
        )}

        <Outlet />
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur sm:hidden">
        <ul className="grid grid-cols-4">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-1 py-2 text-[11px] text-muted-foreground',
                    isActive && 'text-primary'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AppShell;
