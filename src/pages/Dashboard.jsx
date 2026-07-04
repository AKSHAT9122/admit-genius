import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Building2, ChevronRight, Loader2, Target } from 'lucide-react';

export default function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard-insights')
      .then(res => res.json())
      .then(data => {
        setInsights(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setInsights({ score: 0, status: "Offline", nextAction: "Backend server is down." });
        setLoading(false);
      });
  }, []);

  const score = insights ? insights.score : 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, Alex! 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{insights?.status || "Loading your analytics..."}</p>
      </header>

      {/* Progress Bar Widget */}
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary-blue), #3B82F6)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Application Readiness</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Target size={16} /> 
               {loading ? "Calculating..." : insights?.nextAction}
            </p>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
            {loading ? <Loader2 className="animate-spin" size={32} /> : `${score}%`}
          </div>
        </div>
        
        {/* The Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', background: 'var(--accent-teal)', borderRadius: '4px', transition: 'width 1s ease-out' }}></div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Quick Access</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* Saved Colleges */}
        <Link to="/discovery" className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--secondary-blue)', padding: '10px', borderRadius: '8px' }}><Building2 color="var(--primary-blue)"/></div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Saved Colleges</h3>
            </div>
            <ChevronRight color="var(--text-light)" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>3 colleges matched and saved.</p>
        </Link>

        {/* Ongoing Essays */}
        <Link to="/essay" className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#FEE2E2', padding: '10px', borderRadius: '8px' }}><BookOpen color="var(--danger-color)"/></div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Ongoing Essays</h3>
            </div>
            <ChevronRight color="var(--text-light)" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Stanford SOP - Draft 2</p>
        </Link>

        {/* Deadlines */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--warning-bg)', padding: '10px', borderRadius: '8px' }}><Calendar color="var(--warning-color)"/></div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Deadlines</h3>
            </div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
               <span>MIT EA</span>
               <span style={{ color: 'var(--danger-color)', fontWeight: '600' }}>Nov 1</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span>UC Berkeley</span>
               <span style={{ fontWeight: '600' }}>Nov 30</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
