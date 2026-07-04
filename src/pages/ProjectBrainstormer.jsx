import { useState } from 'react';
import { Rocket, Lightbulb, CheckCircle, Loader2, Search } from 'lucide-react';

export default function ProjectBrainstormer() {
  const [interests, setInterests] = useState('');
  const [level, setLevel] = useState('Undergraduate');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!interests.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/brainstorm-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, level })
      });

      if (!response.ok) throw new Error('Backend failed');
      
      const data = await response.json();
      setProjects(data.projects);
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
            <Rocket size={40} color="var(--primary-blue)" />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>X-Factor Project Brainstormer</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Need a unique "spike" for your CV? Enter your passions below, and the system will generate 3 highly impressive, custom project ideas with 30-day roadmaps.
        </p>
      </header>

      {/* Input Section */}
      <div className="card" style={{ marginBottom: '3rem' }}>
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)' }}>Your Passions / Interests</label>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-light)' }} size={20} />
                <input 
                  type="text" 
                  placeholder="e.g. Artificial Intelligence, Climate Change, Music"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '16px 20px 16px 50px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)',
                    fontSize: '1.1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ width: '250px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)' }}>Academic Level</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  fontSize: '1.1rem',
                  background: 'white'
                }}
              >
                <option value="Undergraduate">Undergraduate (BS/BA)</option>
                <option value="Graduate">Graduate (MS/PhD)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? <><Loader2 className="animate-spin" /> Generating High-Impact Ideas...</> : 'Brainstorm Projects'}
          </button>
        </form>
      </div>

      {/* Results */}
      {projects && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb color="var(--accent-teal)" /> Recommended Projects for {level}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {projects.map((proj, idx) => (
              <div key={idx} className="card" style={{ padding: '2rem' }}>
                
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--primary-blue)' }}>
                  Option {idx + 1}: {proj.title}
                </h3>
                
                <div style={{ display: 'inline-block', background: 'var(--bg-light-gray)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: '600' }}>
                  {proj.category}
                </div>

                <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                  {proj.description}
                </p>

                <div style={{ background: 'var(--secondary-blue)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-blue)', fontSize: '1.1rem' }}>
                    30-Day Execution Roadmap
                  </h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {proj.roadmap.map((step, stepIdx) => (
                      <li key={stepIdx} style={{ display: 'flex', gap: '12px', color: 'var(--text-primary)' }}>
                        <CheckCircle size={20} color="var(--primary-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ lineHeight: 1.5 }}>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
