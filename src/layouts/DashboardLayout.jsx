import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, Search, GraduationCap, Settings, Compass, Rocket } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tracker', icon: CheckSquare, label: 'Profile Tracker' },
    { path: '/essay', icon: FileText, label: 'Essay Assistant' },
    { path: '/discovery', icon: Search, label: 'College Discovery' },
    { path: '/courses', icon: Compass, label: 'Course Matcher' },
    { path: '/brainstorm', icon: Rocket, label: 'Project Brainstormer' },
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <nav style={{
        width: '260px',
        background: 'var(--bg-white)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary-blue)', color: 'white', padding: '8px', borderRadius: '8px' }}>
            <GraduationCap size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--primary-blue)' }}>Admit<span style={{color: 'var(--accent-teal)'}}>Genius</span></h2>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: isActive ? 'var(--primary-blue)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--secondary-blue)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Footer Area */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: 'auto' }}>
          <Link to="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', padding: '8px 16px', fontWeight: '500' }}>
            <Settings size={20} />
            Settings
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
