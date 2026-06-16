import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { injectCssVariables } from './styles/Palette'
import App from './App.tsx'

injectCssVariables()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
