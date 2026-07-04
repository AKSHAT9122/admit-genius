// Simulated AI Verification Service
// In production, this would make calls to OpenAI GPT-4 Vision, Google Gemini, etc.

export const verifyEvidenceWithAI = async (criterionId, inputId, rawValue, evidenceValue) => {
  return new Promise((resolve) => {
    // Simulate API delay (1 to 3 seconds)
    const delay = Math.floor(Math.random() * 2000) + 1000;
    
    setTimeout(() => {
      // Mock AI Logic to judge the evidence
      
      if (!evidenceValue || evidenceValue.trim() === '') {
        return resolve({
          status: 'rejected',
          reason: 'No evidence provided. AI cannot authenticate.'
        });
      }
      
      if (!rawValue || rawValue === '') {
        return resolve({
          status: 'rejected',
          reason: 'No raw value provided to verify against.'
        });
      }

      const evidence = evidenceValue.toLowerCase();

      // Check for URLs
      if (evidence.startsWith('http') || evidence.startsWith('www')) {
        if (evidence.includes('linkedin.com') || evidence.includes('github.com') || evidence.includes('scholar.google')) {
          return resolve({
            status: 'verified',
            reason: 'AI authenticated the external link and cross-referenced achievements.'
          });
        }
        // Randomly reject some generic links to show it "working"
        if (Math.random() > 0.8) {
           return resolve({
            status: 'rejected',
            reason: 'AI could not find matching data on the provided webpage.'
          });
        }
        return resolve({
          status: 'verified',
          reason: 'AI successfully scanned the URL and validated the claim.'
        });
      }

      // Check for Files (Mocked as strings ending in extensions)
      if (evidence.endsWith('.pdf') || evidence.endsWith('.png') || evidence.endsWith('.jpg')) {
         return resolve({
            status: 'verified',
            reason: 'AI Vision model successfully extracted text and matched your inputs.'
         });
      }
      
      // Default case (User just typed something weird)
      if (evidence.length > 5) {
         return resolve({
            status: 'verified',
            reason: 'AI accepted the provided context.'
         });
      }

      resolve({
        status: 'rejected',
        reason: 'Evidence format not recognized by the AI model.'
      });

    }, delay);
  });
};
