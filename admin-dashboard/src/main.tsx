import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// HANYA IMPORT CSS KITA (YANG TAILWIND)
import './styles/global.css' 

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)