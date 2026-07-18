import { useState } from 'react';
import { Compass, Loader2, Search, MapPin, Building2, BookOpen } from 'lucide-react';

export default function CourseMatcher() {
  const [interest, setInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!interest.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/course-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: interest })
      });

      if (!response.ok) throw new Error('Backend failed');
      
      const data = await response.json();
      setResults(data.institutes);
    } catch (error) {
      console.error(error);
      alert('Failed to connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--bg-light-gray)', padding: '16px', borderRadius: '50%' }}>
            <Compass size={40} color="var(--primary-blue)" />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Course & Major Matcher</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Tell us what you want to study (e.g., "Robotics and CS", "Pre-Med", "Finance"). 
          We'll find the absolute best programs for your specific interests.
        </p>
      </header>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '3rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-light)' }} size={20} />
            <input 
              type="text" 
              placeholder="What are your academic interests? (e.g. Physics, Mechanical Engineering)"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '16px 20px 16px 50px', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)',
                fontSize: '1.1rem'
              }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ padding: '0 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading ? <><Loader2 className="animate-spin" /> Matching...</> : 'Find Best Institutes'}
          </button>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Top Recommended Programs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {results.map((inst, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '60px', height: '60px', 
                    borderRadius: '12px', 
                    background: 'var(--bg-light-gray)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-blue)'
                  }}>
                    {inst.logo}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{inst.name}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                      <MapPin size={14} /> {inst.location}
                    </p>
                  </div>
                </div>

                <div style={{ background: 'var(--secondary-blue)', padding: '12px', borderRadius: '8px', marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary-blue)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={16} /> Course Highlights
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {inst.highlight}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Acceptance Rate</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{inst.acceptance}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Avg. Starting Salary</span>
                    <strong style={{ color: 'var(--accent-teal)' }}>{inst.salary}</strong>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
