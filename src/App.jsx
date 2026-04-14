import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Events from './pages/Events'
import Teammates from './pages/Teammates'
import Reels from './pages/Reels'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/teammates" element={<Teammates />} />
         <Route path="/reels" element={<Reels />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App