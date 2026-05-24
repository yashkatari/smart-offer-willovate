import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Dashboard from './Dashboard.tsx'
import OffersList from './OffersList.tsx'
import OfferDetail from './OfferDetail.tsx'
import Auth from './Auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/offers" element={<OffersList />} />
        <Route path="/offer/:id" element={<OfferDetail />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
