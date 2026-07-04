import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProfileTracker from './pages/ProfileTracker';
import EssayAssistant from './pages/EssayAssistant';
import CollegeDiscovery from './pages/CollegeDiscovery';
import CourseMatcher from './pages/CourseMatcher';
import ProjectBrainstormer from './pages/ProjectBrainstormer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard layout wrapper for authenticated-style routes */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/tracker" element={<DashboardLayout><ProfileTracker /></DashboardLayout>} />
        <Route path="/essay" element={<DashboardLayout><EssayAssistant /></DashboardLayout>} />
        <Route path="/discovery" element={<DashboardLayout><CollegeDiscovery /></DashboardLayout>} />
        <Route path="/courses" element={<DashboardLayout><CourseMatcher /></DashboardLayout>} />
        <Route path="/brainstorm" element={<DashboardLayout><ProjectBrainstormer /></DashboardLayout>} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
// Trigger recompile
