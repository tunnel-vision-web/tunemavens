import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RegionProvider } from './RegionContext.jsx'

console.log("TuneStream Client Booting - v1.0.4");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegionProvider>
      <App />
    </RegionProvider>
  </StrictMode>,
)
