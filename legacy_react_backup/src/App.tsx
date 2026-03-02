import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Monitor } from './pages/Monitor';
import { Education } from './pages/Education';
import { About } from './pages/About';
import { Analytics } from './pages/Analytics';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { AuroraBackground } from './components/AuroraBackground';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/education" element={<Education />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

import { CRTOverlay } from './components/CRTOverlay';

// ... (existing imports)

function App() {
  return (
    <Router>
      <div className="min-h-screen text-[#F8FAFC] font-sans selection:bg-cyan-500/30 selection:text-cyan-100 relative">
        <CRTOverlay />
        <AuroraBackground />
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
