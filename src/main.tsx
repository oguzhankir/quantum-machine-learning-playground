import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { initializeTheme } from './lib/theme';
import 'katex/dist/katex.min.css';
import './styles/main.css';
import './styles/polish.css';
import './styles/theme.css';

initializeTheme();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
