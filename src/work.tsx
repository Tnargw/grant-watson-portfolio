import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import WorkPage from './pages/WorkPage';
import './styles/global.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <WorkPage />
  </StrictMode>,
);
