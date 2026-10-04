import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are served from this app, not Google, so the postcard download can
// embed them (a browser won't let a page read another site's font CSS).
import '@fontsource/courier-prime/400.css'
import '@fontsource/courier-prime/700.css'
import '@fontsource-variable/nunito-sans'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
