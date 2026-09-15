import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { HistoryRouter } from 'redux-first-history/rr6';
import { store, history } from '../src/store/store.ts';
import { theme } from './theme/theme.ts';
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <QueryClientProvider client={queryClient}>
            <HistoryRouter history={history}>
              <App />
            </HistoryRouter>
          </QueryClientProvider>
        </ThemeProvider>
    </Provider>
  </StrictMode>,
)
