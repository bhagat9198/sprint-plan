import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SprintDashboard } from './pages/SprintDashboard';
import { SprintBoard } from './pages/SprintBoard';
import { useThemeStore } from './store/themeStore';

function App() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sprint/:sprintId" element={<SprintDashboard />} />
        <Route path="/sprint/:sprintId/board" element={<SprintBoard />} />
      </Routes>
    </Router>
  );
}

export default App;