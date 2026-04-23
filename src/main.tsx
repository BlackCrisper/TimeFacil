import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { toast } from 'sonner'
import App from './App.tsx'
import './index.css'

const updateSW = registerSW({
  onNeedRefresh() {
    toast.info('Nova versão disponível.', {
      action: {
        label: 'Atualizar',
        onClick: () => updateSW(true)
      }
    });
  },
  onOfflineReady() {
    toast.success('App pronto para uso offline.');
  }
});

createRoot(document.getElementById("root")!).render(<App />);
