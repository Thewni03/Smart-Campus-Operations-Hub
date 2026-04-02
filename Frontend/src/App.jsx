import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UserResource from './components/UserResource/UserResource'
import AdminResource from './components/Adminresource/Adminresource'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/resource" element={<UserResource />} />
        <Route path="/admin-resources" element={<AdminResource />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App