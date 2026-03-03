import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setGlobalTheme } from '@atlaskit/tokens'
import './index.css'
import App from './App.tsx'

setGlobalTheme({ colorMode: 'light', light: 'light', dark: 'dark' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
