import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';

const InstalarApp = () => {
  const { canInstall, isStandalone, install } = usePwaInstall();

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5">
        <h2 className="text-lg font-bold text-foreground">Instalar TimeFácil no celular</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Instale para abrir como aplicativo, usar tela cheia e ter melhor desempenho no dia do jogo.
        </p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 p-5">
        <h3 className="font-semibold text-foreground">O que muda ao instalar</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>- Acesso direto na tela inicial</li>
          <li>- Experiência em modo app (sem barra do navegador)</li>
          <li>- Funcionamento offline para dados e interface principal</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 p-5">
        {isStandalone ? (
          <p className="text-sm font-medium text-foreground">O app já está instalado neste dispositivo.</p>
        ) : canInstall ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Seu dispositivo permite instalação automática agora.
            </p>
            <Button className="w-full" onClick={() => void install()}>
              Instalar aplicativo
            </Button>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Se o botão de instalar não aparecer, use o menu do navegador:
            </p>
            <p>- Android/Chrome: menu ⋮ → Instalar app</p>
            <p>- iPhone/Safari: compartilhar → Adicionar à Tela de Início</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default InstalarApp;
