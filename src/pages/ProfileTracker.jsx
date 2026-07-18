import { useState, useMemo } from 'react';
import { scoringConfig, rankingSystem } from '../data/scoringConfig';

function ProfileTracker() {
  const [level, setLevel] = useState('Undergraduate');
  const [inputs, setInputs] = useState({});
  const [evidence, setEvidence] = useState({});
  const [verificationStatus, setVerificationStatus] = useState({}); // 'pending', 'analyzing', 'verified', 'rejected'
  const [verificationFeedback, setVerificationFeedback] = useState({});
  const [aiEvaluatedScores, setAiEvaluatedScores] = useState({}); // Scores generated directly by Gemini
  const [aiPersonalizedAdvice, setAiPersonalizedAdvice] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Reset inputs when level changes
  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setInputs({});
    setEvidence({});
    setVerificationStatus({});
    setVerificationFeedback({});
    setAiEvaluatedScores({});
    setAiPersonalizedAdvice('');
  };

  const handleInputChange = (criterionId, inputId, value) => {
    setInputs(prev => ({
      ...prev,
      [criterionId]: { ...(prev[criterionId] || {}), [inputId]: value }
    }));
    setVerificationStatus(prev => ({
      ...prev,
      [criterionId]: { ...(prev[criterionId] || {}), [inputId]: 'pending' }
    }));
  };

  const handleEvidenceChange = (criterionId, inputId, value) => {
    setEvidence(prev => ({
      ...prev,
      [criterionId]: { ...(prev[criterionId] || {}), [inputId]: value }
    }));
    setVerificationStatus(prev => ({
      ...prev,
      [criterionId]: { ...(prev[criterionId] || {}), [inputId]: 'pending' }
    }));
  };

  const authenticateAll = async () => {
    setIsAuthenticating(true);
    setAiPersonalizedAdvice('System is reading your profile and generating personalized advice...');
    
    
    // Set all submitted evidence to 'pending'
    const newVerificationStatus = {};
    Object.keys(evidence).forEach(catId => {
      newVerificationStatus[catId] = {};
      Object.keys(evidence[catId]).forEach(inputId => {
        newVerificationStatus[catId][inputId] = 'pending';
      });
    });
    setVerificationStatus(newVerificationStatus);

    try {
      const response = await fetch('/api/evaluate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          inputs,
          evidenceBase64: evidence // We now store the base64 string directly in evidence state
        })
      });

      if (!response.ok) {
        throw new Error("Backend server error");
      }

      const result = await response.json();
      
      // Update UI with results
      const updatedStatus = {};
      const updatedScores = {};
      const updatedFeedback = {};

      if (result.authentications) {
         Object.keys(result.authentications).forEach(catId => {
            const catResult = result.authentications[catId];
            
            // Map the API results back to our state
            updatedStatus[catId] = { [catResult.inputId || 'score']: catResult.inputId === 'verified' ? 'verified' : 'rejected' };
            updatedScores[catId] = catResult.evaluatedScore || 0;
            updatedFeedback[catId] = { [catResult.inputId || 'score']: catResult.reason || '' };
         });
      }

      setVerificationStatus(updatedStatus);
      setAiEvaluatedScores(updatedScores);
      setVerificationFeedback(updatedFeedback);
      
      // Store the personalized advice (which includes Alternative College Recommendations)
      setAiPersonalizedAdvice(result.personalizedAdvice);

    } catch (err) {
      console.error(err);
      alert("Failed to connect to server. Make sure the Node backend is running!");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const currentConfig = scoringConfig[level];

  // Calculate Score (Using the AI generated scores)
  const scoreData = useMemo(() => {
    let totalScore = 0;
    const weaknesses = [];
    const strengths = [];

    currentConfig.criteria.forEach((criterion) => {
      // Use the score given by the backend, or default to 0 if not authenticated
      const evaluatedScore = aiEvaluatedScores[criterion.id] || 0;
      
      const contribution = (evaluatedScore / 100) * criterion.weight;
      totalScore += contribution;

      if (evaluatedScore > 0) {
        if (evaluatedScore < 40) {
          weaknesses.push({
            key: criterion.label,
            desc: `Your metrics for ${criterion.label} are below the elite threshold. Focus heavily on improving this area as it accounts for ${criterion.weight}% of the profile.`
          });
        } else if (evaluatedScore >= 85) {
          strengths.push({
            key: criterion.label,
            desc: `Excellent work! Your achievements in ${criterion.label} are highly competitive.`
          });
        }
      }
    });

    const normalizedScore = Math.min(100, Math.round((totalScore / currentConfig.totalWeight) * 100));
    const rankObj = rankingSystem.find(r => normalizedScore <= r.maxScore) || rankingSystem[rankingSystem.length - 1];

    return { score: normalizedScore, rank: rankObj, weaknesses, strengths };
  }, [aiEvaluatedScores, currentConfig]);

  const renderStatusBadge = (criterionId, inputId) => {
    const status = (verificationStatus[criterionId] && verificationStatus[criterionId][inputId]) || 'pending';
    const feedback = (verificationFeedback[criterionId] && verificationFeedback[criterionId][inputId]) || '';
    
    switch (status) {
      case 'analyzing': return <span style={{color: 'yellow', fontSize: '0.8rem'}}>Analyzing...</span>;
      case 'verified': return <span style={{color: 'var(--success-color)', fontSize: '0.8rem'}} title={feedback}>✅ Verified</span>;
      case 'rejected': return <span style={{color: 'var(--danger-color)', fontSize: '0.8rem'}} title={feedback}>❌ Rejected</span>;
      default: return null;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Profile Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Securely verify your achievements against Elite Profiles.</p>
        </div>
        
        <button 
          onClick={authenticateAll} 
          disabled={isAuthenticating}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.5rem' }}
        >
          {isAuthenticating ? '🤖 Connecting...' : '🤖 Evaluate'}
        </button>
      </header>

      {/* Level Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${level === 'Undergraduate' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleLevelChange('Undergraduate')}
        >
          Undergraduate (BS)
        </button>
        <button 
          className={`btn ${level === 'Graduate' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleLevelChange('Graduate')}
        >
          Graduate (MS/PhD)
        </button>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Form Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {currentConfig.criteria.map((criterion) => (
            <div key={criterion.id} className="card">
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between' }}>
                {criterion.label} 
                <span style={{ color: 'var(--primary-blue)', fontSize: '0.9rem', fontWeight: '600' }}>Weight: {criterion.weight}%</span>
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {criterion.inputs.map(inputField => (
                  <div key={inputField.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    
                    {/* Raw Data Input */}
                    <div style={{ flex: 1 }}>
                      <label>{inputField.label}</label>
                      {inputField.type === 'select' ? (
                        <select 
                          value={(inputs[criterion.id] && inputs[criterion.id][inputField.id]) || ''}
                          onChange={(e) => handleInputChange(criterion.id, inputField.id, e.target.value)}
                        >
                          {inputField.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type={inputField.type} 
                          placeholder={inputField.placeholder}
                          value={(inputs[criterion.id] && inputs[criterion.id][inputField.id]) || ''} 
                          onChange={(e) => handleInputChange(criterion.id, inputField.id, e.target.value)} 
                        />
                      )}
                    </div>

                    {/* Evidence Input */}
                    {inputField.evidenceType && (
                      <div style={{ flex: 1.5, background: 'var(--bg-light-gray)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{ margin: 0, color: 'var(--text-primary)' }}>{inputField.evidenceLabel}</label>
                            {renderStatusBadge(criterion.id, inputField.id)}
                         </div>
                         
                         <div style={{ display: 'flex', gap: '8px' }}>
                            {inputField.evidenceType === 'url' ? (
                              <input 
                                type="text" 
                                placeholder="https://..."
                                value={(evidence[criterion.id] && evidence[criterion.id][inputField.id]) || ''}
                                onChange={(e) => handleEvidenceChange(criterion.id, inputField.id, e.target.value)}
                                style={{ background: 'var(--bg-white)' }}
                              />
                            ) : (
                              <input 
                                type="file" 
                                accept=".pdf,.png,.jpg,.jpeg,.docx"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      handleEvidenceChange(criterion.id, inputField.id, reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                style={{ background: 'var(--bg-white)', padding: '8px' }}
                              />
                            )}
                         </div>
                         {verificationFeedback[criterion.id] && verificationFeedback[criterion.id][inputField.id] && (
                           <div style={{ fontSize: '0.8rem', marginTop: '8px', color: 'var(--danger-color)' }}>
                             {verificationFeedback[criterion.id][inputField.id]}
                           </div>
                         )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Evaluated Score: <span style={{ color: 'var(--primary-blue)', fontSize: '1.1rem' }}>{aiEvaluatedScores[criterion.id] || 0}</span> / 100
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Evaluation Dashboard</h2>
            
            <div style={{ 
              width: '150px', height: '150px', margin: '0 auto 1.5rem auto', 
              borderRadius: '50%', background: 'conic-gradient(var(--primary-blue) ' + scoreData.score + '%, var(--bg-mid-gray) 0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
            }}>
              <div style={{ width: '130px', height: '130px', background: 'var(--bg-white)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{scoreData.score}</span>
              </div>
            </div>

            <div className="badge" style={{ background: 'var(--bg-light-gray)', fontSize: '1rem', padding: '8px 16px', marginBottom: '1rem' }}>
              {scoreData.rank.emoji} <span style={{ fontWeight: '700', color: scoreData.rank.color }}>{scoreData.rank.rank} Level</span>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Admission Chance: <strong>{scoreData.rank.rank === 'Elite' ? 'Very High' : scoreData.rank.rank === 'Expert' ? 'High' : scoreData.rank.rank === 'Advanced' ? 'Moderate' : 'Low'}</strong>
            </p>
          </div>

          <div className="card" style={{ background: 'var(--bg-light-gray)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)' }}>
              ✨ Strategic Advice
            </h3>
            <div style={{ background: 'var(--bg-white)', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, border: '1px solid var(--border-color)' }}>
               {aiPersonalizedAdvice || (
                 <span>Input your data and authenticate to receive a deeply personalized strategy from our Admissions system.</span>
               )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ProfileTracker;
