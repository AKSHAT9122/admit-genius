const gpaEvaluator = (v) => {
  const gpa = parseFloat(v.gpa) || 0;
  const scale = parseFloat(v.scale) || 4.0;
  if (scale <= 0) return 0;
  const ratio = Math.min(1, gpa / scale);
  return ratio * 100;
};

const qualitativeEvaluator = (v) => {
  const level = v.status;
  if (level === 'expert') return 100;
  if (level === 'peer') return 70;
  if (level === 'draft') return 40;
  return 0;
};

export const scoringConfig = {
  Undergraduate: {
    title: "Top University Profile – Undergraduate (BS)",
    totalWeight: 102,
    criteria: [
      {
        id: "Academics",
        label: "Academics (GPA + Rigor)",
        weight: 25,
        inputs: [
          { id: 'gpa', label: 'Your GPA', type: 'number', placeholder: '3.8', evidenceType: 'file', evidenceLabel: 'Transcript (PDF/Img)' },
          { id: 'scale', label: 'GPA Scale', type: 'number', placeholder: '4.0' }
        ],
        evaluator: gpaEvaluator
      },
      {
        id: "Tests",
        label: "Standardized Tests (SAT/ACT)",
        weight: 10,
        inputs: [{ id: 'score', label: 'SAT Score', type: 'number', placeholder: '1500', evidenceType: 'file', evidenceLabel: 'CollegeBoard Result Link' }],
        evaluator: (v) => {
          const s = parseInt(v.score) || 0;
          if (s < 1000) return 0;
          return Math.min(100, ((s - 1000) / 600) * 100);
        }
      },
      {
        id: "Olympiads",
        label: "Olympiads & Competitions",
        weight: 10,
        inputs: [{ id: 'awards', label: 'Number of Major Awards', type: 'number', placeholder: '2', evidenceType: 'file', evidenceLabel: 'Certificate/News Link' }],
        evaluator: (v) => Math.min(100, (parseInt(v.awards) || 0) * 35)
      },
      {
        id: "Research",
        label: "Research & Projects",
        weight: 15,
        inputs: [{ id: 'projects', label: 'Number of Major Projects', type: 'number', placeholder: '3', evidenceType: 'file', evidenceLabel: 'GitHub/Portfolio Link' }],
        evaluator: (v) => Math.min(100, (parseInt(v.projects) || 0) * 35)
      },
      {
        id: "Extracurriculars",
        label: "Extracurriculars & Leadership",
        weight: 10,
        inputs: [{ id: 'roles', label: 'Leadership Roles', type: 'number', placeholder: '2', evidenceType: 'file', evidenceLabel: 'LinkedIn Link' }],
        evaluator: (v) => Math.min(100, (parseInt(v.roles) || 0) * 50)
      },
      {
        id: "SocialWork",
        label: "Social Work & Community Service",
        weight: 10,
        inputs: [{ id: 'hours', label: 'Total Hours', type: 'number', placeholder: '100', evidenceType: 'file', evidenceLabel: 'Certificate (PDF/Img)' }],
        evaluator: (v) => Math.min(100, ((parseInt(v.hours) || 0) / 200) * 100)
      },
      {
        id: "WorkExp",
        label: "Work Experience (Internships)",
        weight: 5,
        inputs: [{ id: 'months', label: 'Months of Internship', type: 'number', placeholder: '3', evidenceType: 'file', evidenceLabel: 'LinkedIn Link' }],
        evaluator: (v) => Math.min(100, ((parseInt(v.months) || 0) / 6) * 100)
      },
      {
        id: "Essays",
        label: "Essays & Personal Statement",
        weight: 10,
        inputs: [{ 
          id: 'status', label: 'Essay Quality', type: 'select', 
          options: [
            { value: '', label: 'Select status...' },
            { value: 'draft', label: 'Drafting / Self-Review' },
            { value: 'peer', label: 'Reviewed by Peers/Teachers' },
            { value: 'expert', label: 'Professionally Edited / Exceptional' }
          ],
          evidenceType: 'file', evidenceLabel: 'Upload Draft (PDF/Docx)'
        }],
        evaluator: qualitativeEvaluator
      },
      {
        id: "LORs",
        label: "LORs (Teacher/Counselor)",
        weight: 5,
        inputs: [{ 
          id: 'status', label: 'Recommendation Strength', type: 'select',
          options: [
            { value: '', label: 'Select status...' },
            { value: 'draft', label: 'Standard/Generic' },
            { value: 'peer', label: 'Strong/Personalized' },
            { value: 'expert', label: 'Exceptional (Top 1%)' }
          ]
        }],
        evaluator: qualitativeEvaluator
      },
      {
        id: "Interviews",
        label: "Personal Qualities / Interviews",
        weight: 2,
        inputs: [{ 
          id: 'status', label: 'Interview Performance', type: 'select',
          options: [
            { value: '', label: 'Select status...' },
            { value: 'draft', label: 'Average' },
            { value: 'peer', label: 'Good' },
            { value: 'expert', label: 'Excellent' }
          ]
        }],
        evaluator: qualitativeEvaluator
      },
      {
        id: "XFactor",
        label: "The X-Factor (Special Achievements)",
        weight: 10,
        inputs: [{ id: 'achievement', label: 'Unique Spike (e.g. Codeforces Rating, Patent, Olympic Medal)', type: 'text', placeholder: 'Codeforces Expert (1600+)', evidenceType: 'file', evidenceLabel: 'Proof Link/Image' }],
        evaluator: (v) => v.achievement && v.achievement.length > 5 ? 100 : 0
      }
    ]
  },
  Graduate: {
    title: "Top University Profile – Graduate (MS/PhD)",
    totalWeight: 102,
    criteria: [
      {
        id: "Academics",
        label: "Academic Record (GPA + Rigor)",
        weight: 25,
        inputs: [
          { id: 'gpa', label: 'Your GPA', type: 'number', placeholder: '3.8', evidenceType: 'file', evidenceLabel: 'Transcript (PDF/Img)' },
          { id: 'scale', label: 'GPA Scale', type: 'number', placeholder: '4.0' }
        ],
        evaluator: gpaEvaluator
      },
      {
        id: "Research",
        label: "Research & Projects (Publications)",
        weight: 30,
        inputs: [
          { id: 'papers', label: 'Published Papers', type: 'number', placeholder: '1', evidenceType: 'url', evidenceLabel: 'Google Scholar/DOI Link' },
          { id: 'projects', label: 'Major Projects', type: 'number', placeholder: '3', evidenceType: 'url', evidenceLabel: 'GitHub Link' }
        ],
        evaluator: (v) => {
          const papers = parseInt(v.papers) || 0;
          const projects = parseInt(v.projects) || 0;
          return Math.min(100, (papers * 40) + (projects * 20));
        }
      },
      {
        id: "WorkExp",
        label: "Work Experience (Internships, Jobs)",
        weight: 15,
        inputs: [{ id: 'months', label: 'Months of Experience', type: 'number', placeholder: '12', evidenceType: 'url', evidenceLabel: 'LinkedIn Link' }],
        evaluator: (v) => Math.min(100, ((parseInt(v.months) || 0) / 12) * 100)
      },
      {
        id: "SOP",
        label: "Statement of Purpose (Essays)",
        weight: 15,
        inputs: [{ 
          id: 'status', label: 'SOP Quality', type: 'select', 
          options: [
            { value: '', label: 'Select status...' },
            { value: 'draft', label: 'Drafting / Generic' },
            { value: 'peer', label: 'Reviewed / Tailored to Dept' },
            { value: 'expert', label: 'Exceptional / Research Aligned' }
          ],
          evidenceType: 'file', evidenceLabel: 'Upload SOP Document'
        }],
        evaluator: qualitativeEvaluator
      },
      {
        id: "LORs",
        label: "LORs (Professors/Research Mentors)",
        weight: 10,
        inputs: [{ 
          id: 'status', label: 'Recommendation Strength', type: 'select',
          options: [
            { value: '', label: 'Select status...' },
            { value: 'draft', label: 'Did well in class' },
            { value: 'peer', label: 'Strong research mentor' },
            { value: 'expert', label: 'Stellar / Renowned Professor' }
          ]
        }],
        evaluator: qualitativeEvaluator
      },
      {
        id: "SocialWork",
        label: "Social Work & Community Service",
        weight: 3,
        inputs: [{ id: 'hours', label: 'Total Hours', type: 'number', placeholder: '50', evidenceType: 'file', evidenceLabel: 'Certificate' }],
        evaluator: (v) => Math.min(100, ((parseInt(v.hours) || 0) / 100) * 100)
      },
      {
        id: "Olympiads",
        label: "Olympiads & Competitions",
        weight: 2,
        inputs: [{ id: 'awards', label: 'Tech Awards/Hackathons', type: 'number', placeholder: '1', evidenceType: 'url', evidenceLabel: 'Certificate Link' }],
        evaluator: (v) => Math.min(100, (parseInt(v.awards) || 0) * 50)
      },
      {
        id: "Extracurriculars",
        label: "Extracurriculars & Leadership",
        weight: 2,
        inputs: [{ id: 'roles', label: 'Leadership Roles', type: 'number', placeholder: '1', evidenceType: 'url', evidenceLabel: 'LinkedIn Link' }],
        evaluator: (v) => Math.min(100, (parseInt(v.roles) || 0) * 50)
      },
      {
        id: "XFactor",
        label: "The X-Factor (Special Achievements)",
        weight: 10,
        inputs: [{ id: 'achievement', label: 'Unique Spike (e.g. Kaggle Grandmaster, Patent, Start-up)', type: 'text', placeholder: 'Kaggle Master / Startup Founder', evidenceType: 'file', evidenceLabel: 'Proof Link' }],
        evaluator: (v) => v.achievement && v.achievement.length > 5 ? 100 : 0
      }
    ]
  }
};

export const rankingSystem = [
  { maxScore: 39, rank: "Newbie", emoji: "🥉", color: "#b08d6a" },
  { maxScore: 59, rank: "Intermediate", emoji: "🥈", color: "#c0c0c0" },
  { maxScore: 79, rank: "Advanced", emoji: "🥇", color: "#ffd700" },
  { maxScore: 94, rank: "Expert", emoji: "💎", color: "#b9f2ff" },
  { maxScore: 100, rank: "Elite", emoji: "👑", color: "#ff4d4d" }
];
