import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LearningStoreProvider } from './context/LearningStoreContext';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LearningStoreProvider>
        <App />
      </LearningStoreProvider>
    </BrowserRouter>
  </StrictMode>,
);
