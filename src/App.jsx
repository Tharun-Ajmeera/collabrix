import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Teammates from './pages/Teammates'
import Reels from './pages/Reels'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Chat from './pages/Chat'
import Inbox from './pages/Inbox'
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — anyone can view */}
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/events"      element={<Events />} />
        <Route path="/events/:id"  element={<EventDetail />} />
        <Route path="/teammates"   element={<Teammates />} />
        <Route path="/reels"       element={<Reels />} />

        {/* Protected routes — must be logged in */}
        <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/user/:userId"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/inbox"          element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/chat/:userId"   element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/admin"          element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
