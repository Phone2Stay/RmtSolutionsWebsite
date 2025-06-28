import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(queryKey[0] as string);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/contact" component={ContactPage} />
        <Route>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
              <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="text-primary hover:underline">Return to Homepage</a>
            </div>
          </div>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}

export default App;