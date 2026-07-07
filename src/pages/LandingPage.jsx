import { Link, Navigate } from 'react-router-dom';
import { PenTool, BarChart2, DollarSign, Target } from 'lucide-react';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { PenTool, BarChart2, DollarSign, Target } from 'lucide-react';

export default function LandingPage() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    { icon: PenTool, title: "Essay Assistant", desc: "Real-time feedback, structure, and grammar optimization for Ivy League essays." },
    { icon: BarChart2, title: "Real-Time Admission Chancing", desc: "Know exactly where you stand against Elite student profiles with predictive analytics." },
    { icon: DollarSign, title: "FAFSA & Scholarship Guide", desc: "Discover best-fit financial aid opportunities automatically." },
    { icon: Target, title: "Extracurricular Builder", desc: "Track, verify, and highlight your projects and leadership effectively." }
  ];

  return (
    <div style={{ background: 'var(--bg-white)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 3rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ color: 'var(--primary-blue)', margin: 0, fontWeight: '800' }}>Admit<span style={{color: 'var(--accent-teal)'}}>Genius</span></h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SignInButton mode="modal">
            <button className="btn btn-outline">Login</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn btn-primary">Sign Up</button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', maxWidth: '800px', marginBottom: '1.5rem', lineHeight: 1.2 }}>
          Your All-in-One Guide to <span className="text-gradient">College Admissions.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2.5rem' }}>
          The smart super app that helps you write stellar essays, discover financial aid, and find your perfect college fit.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SignUpButton mode="modal">
            <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', border: 'none', cursor: 'pointer' }}>Start for Free</button>
          </SignUpButton>
          <Link to="/essay" className="btn btn-accent-teal" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', textDecoration: 'none' }}>Explore Tools</Link>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px', marginTop: '5rem' }}>
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="card" style={{ textAlign: 'left', background: 'var(--bg-light-gray)' }}>
                <div style={{ background: 'var(--bg-white)', padding: '12px', borderRadius: '12px', display: 'inline-block', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                  <Icon size={24} color="var(--primary-blue)" />
                </div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
