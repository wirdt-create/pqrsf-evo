import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RadicarPage } from './pages/RadicarPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RadicarPage />
    </QueryClientProvider>
  );
}
