import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'
import ClientView from './components/ClientView'
import Header from './components/Header'

function App() {
  const [mode, setMode] = useState('client') // 'admin' or 'client'

  return (
    <Router>
      <div className="min-h-screen">
        <Header mode={mode} setMode={setMode} />
        <Routes>
          <Route path="/" element={<ClientView />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

