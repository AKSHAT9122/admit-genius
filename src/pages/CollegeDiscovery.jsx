import { useState } from 'react';
import { Search, MapPin, GraduationCap, DollarSign, Award, Loader2 } from 'lucide-react';

export default function CollegeDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/search-college', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (!data.error) {
        setColleges([data]);
      } else {
        alert("College not found or error occurred.");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed. Backend might be down.");
    }
    setIsLoading(false);
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      
      {/* Left Content: Search and Colleges */}
      <div style={{ flex: 1 }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Live College Discovery</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Search ANY university worldwide. The system will pull its real stats instantly.</p>
        </header>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search ANY university (e.g., Harvard, Oxford, UCLA)..." 
              style={{ paddingLeft: '40px' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
          </button>
          <button className="btn btn-outline">Filters</button>
        </div>

        {/* College List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {colleges.length === 0 ? (
             <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                Type a university name above and let the system find its stats!
             </div>
          ) : (
            colleges.map((college, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {/* Logo Mock */}
                <div style={{ width: '64px', height: '64px', background: 'var(--secondary-blue)', color: 'var(--primary-blue)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800' }}>
                  {college.logo}
                </div>
                
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{college.name}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} /> {college.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GraduationCap size={16} /> Acc: {college.acceptance}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={16} /> {college.tuition}</span>
                  </div>
                </div>

                {/* Admission Chance */}
                <div style={{ textAlign: 'center', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Match</p>
                  <span className="badge" style={{ background: 'var(--bg-light-gray)', color: college.chanceColor, fontSize: '1rem', padding: '6px 12px' }}>
                    {college.chance}
                  </span>
                </div>
              </div>
              
              {/* Detailed Breakdown */}
              {college.description && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                    {college.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Majors</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {college.topMajors?.map((major, idx) => (
                          <span key={idx} style={{ background: 'var(--bg-light-gray)', color: 'var(--text-primary)', fontSize: '0.85rem', padding: '4px 10px', borderRadius: '100px' }}>{major}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notable Alumni</span>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {college.notableAlumni?.map((alumni, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Award size={14} color="var(--primary-blue)" /> {alumni}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            ))
          )}
        </div>
      </div>

      {/* Right Content: Scholarship Widget */}
      <div style={{ width: '350px' }}>
        <div className="card" style={{ background: 'var(--primary-blue)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px' }}>
               <Award color="white" />
            </div>
            <h3 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>Matching Scholarships</h3>
          </div>
          
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Based on your STEM profile and location, the system found $45,000 in potential aid.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>National Merit</span>
                <span style={{ color: '#FCD34D', fontWeight: 'bold' }}>$2,500</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Match: 95%</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>Women in Tech Fund</span>
                <span style={{ color: '#FCD34D', fontWeight: 'bold' }}>$10,000</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Match: 88%</span>
            </div>
            
            <button className="btn" style={{ background: 'white', color: 'var(--primary-blue)', width: '100%', marginTop: '0.5rem' }}>
              View All 14 Matches
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
