import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 👇 ADD THIS - clears stale token on every app start
const key = Object.keys(localStorage).find(k => k.includes('auth-token'));
if (key) localStorage.removeItem(key);

createRoot(document.getElementById('root')!).render(
  <App />
)