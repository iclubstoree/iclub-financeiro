
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import SaidasPage from '@/pages/SaidasPage';
import AnalisesPage from '@/pages/AnalisesPage';
import DrePage from '@/pages/DrePage';
import ConfiguracoesPage from '@/pages/ConfiguracoesPage';
import NotFound from '@/pages/NotFound';

// Import i18n configuration
import '@/lib/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/saidas" element={<SaidasPage />} />
              <Route path="/analises" element={<AnalisesPage />} />
              <Route path="/dre" element={<DrePage />} />
              <Route path="/configuracoes" element={<ConfiguracoesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>);

}

export default App;