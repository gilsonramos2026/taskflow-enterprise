import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

// Cria a instância do cliente do React Query com configurações recomendadas para projetos corporativos
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // Os dados são considerados frescos por 2 minutos (evita requisições repetidas à toa)
      retry: 1, // Se der erro de rede, tenta apenas mais uma vez antes de falhar
      refetchOnWindowFocus: false, // Evita rebuscar dados no backend toda vez que o usuário muda de aba no navegador
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
