import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Events from './pages/Events'
import Teammates from './pages/Teammates'
import Reels from './pages/Reels'
import Login from './pages/Login'
import Admin from './pages/Admin'
import EventDetail from './pages/EventDetail'
import Chat from './pages/Chat'
import Inbox from './pages/Inbox'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/teammates" element={<Teammates />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App