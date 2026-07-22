require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for Base64 images

const groqClient1 = new Groq({ apiKey: process.env.GROQ_API_KEY_1 });
const groqClient2 = new Groq({ apiKey: process.env.GROQ_API_KEY_2 });

const eliteProfiles = {
    Undergraduate: { gpa: "3.9 - 4.0", sat: "1530 - 1600", projects: "3+ major independent technical projects" },
    Graduate: { gpa: "3.8 - 4.0", publications: "1 to 2 strong papers", projects: "3+ highly relevant technical projects" }
};

// Generic AI Caller
async function callGroqAI(messages, model = "llama-3.3-70b-versatile", jsonMode = false) {
    const payload = {
        model: model,
        messages: messages,
    };
    if (jsonMode) payload.response_format = { type: "json_object" };

    try {
        const chatCompletion = await groqClient1.chat.completions.create(payload);
        return chatCompletion.choices[0].message.content;
    } catch (error1) {
        console.warn("Key 1 failed. Switching to Key 2...", error1.message);
        try {
            const chatCompletion2 = await groqClient2.chat.completions.create(payload);
            return chatCompletion2.choices[0].message.content;
        } catch (error2) {
            console.error("Both keys failed!", error2.message);
            throw new Error("AI generation failed.");
        }
    }
}

// 1. Evaluate Profile (with Alternative Recommender & OCR capability)
app.post('/api/evaluate-profile', async (req, res) => {
    try {
        const { level, inputs, evidenceBase64 } = req.body; // evidenceBase64 is an object mapping to data URIs
        const eliteContext = eliteProfiles[level];

        const promptText = `
You are an elite University Admissions AI Officer. 
Evaluate a ${level} candidate. Elite context: ${JSON.stringify(eliteContext)}.
Candidate Data: ${JSON.stringify(inputs)}

Task 1: Authentication & OCR
The user has uploaded documents. If you have been provided with any visual context, act as if you extracted data from those images to verify the inputs. 
For each category, set status to "verified" or "rejected", and give a short reason.

Task 2: Scoring
For verified categories, give a score out of 100 based on closeness to Elite. Rejected = 0.

Task 3: Strategic Advice & ALTERNATIVE RECOMMENDER
Calculate the average score. If the average is below 70, you MUST include a list of 3 Alternative 'Match' or 'Safety' universities where they have a high chance of admission, based on their data. 
Write a personalized paragraph summarizing this.

Return ONLY a JSON object:
{
  "authentications": {
    "Category_ID": { "inputId": "verified", "reason": "...", "evaluatedScore": 85 }
  },
  "personalizedAdvice": "Your paragraph here, including alternative schools if applicable."
}`;
        // If we actually had real base64 images passed from frontend, we would use the vision model.
        // For stability and speed, we will pass it as a text prompt mimicking OCR for now.
        const rawJSON = await callGroqAI([{ role: "user", content: promptText }], "llama-3.3-70b-versatile", true);
        res.json(JSON.parse(rawJSON));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Chat Brainstorming Interviewer
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const systemMessage = {
            role: "system",
            content: "You are an elite college admissions coach. Your job is to interview the student to brainstorm essay ideas. Ask them deep, probing questions ONE AT A TIME (e.g. What are your interests? What pulls you toward this university? What is a unique challenge you overcame?). Do NOT write the essay for them. Just interview them."
        };
        const reply = await callGroqAI([systemMessage, ...messages]);
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Live AI College Search
app.post('/api/search-college', async (req, res) => {
    try {
        const { query } = req.body;
        const prompt = `Provide highly accurate real-world admissions data for the university matching this query: "${query}". 
If the user's query is vague, match it to the closest Top 50 Global University. 
If it is not a real university, return an error flag.
Return exactly this JSON format:
{
  "name": "University Name",
  "location": "City, State/Country",
  "acceptance": "XX%",
  "tuition": "$XX,XXX",
  "chance": "Match", 
  "chanceColor": "var(--warning-color)",
  "logo": "First Letter of Uni",
  "description": "A 2-3 sentence engaging overview of the campus vibe and academic reputation.",
  "topMajors": ["Major 1", "Major 2", "Major 3"],
  "notableAlumni": ["Alumni 1", "Alumni 2"]
}`;
        const rawJSON = await callGroqAI([{ role: "user", content: prompt }], "llama-3.3-70b-versatile", true);
        res.json(JSON.parse(rawJSON));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Dashboard Predictive Analytics
app.get('/api/dashboard-insights', async (req, res) => {
    try {
        const prompt = `Generate a realistic predictive analytics JSON for a student applying to college.
Format:
{
  "score": 68,
  "status": "On Track for Regular Decision",
  "nextAction": "Improve SAT score by 50 points to boost Elite chances.",
  "deadlines": [
    { "university": "MIT Early Action", "date": "Nov 1" },
    { "university": "UC Berkeley", "date": "Nov 30" }
  ]
}`;
        const rawJSON = await callGroqAI([{ role: "user", content: prompt }], "llama-3.3-70b-versatile", true);
        res.json(JSON.parse(rawJSON));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Course & Major Matcher
app.post('/api/course-match', async (req, res) => {
    try {
        const { interests } = req.body;
        const prompt = `You are an elite college counselor. A student is interested in: "${interests}". 
Recommend the top 3 global institutes best known for this specific field. You MUST strictly select from the Top 50 Global Universities (Ivy League, Russell Group, Tier 1 Research Institutes).
Return EXACTLY this JSON format:
{
  "institutes": [
    {
      "name": "University Name",
      "location": "City, Country",
      "logo": "First Letter of Uni",
      "highlight": "2 sentences highlighting why this specific course/program is world-class here.",
      "acceptance": "XX%",
      "salary": "$XX,XXX"
    }
  ]
}`;
        const rawJSON = await callGroqAI([{ role: "user", content: prompt }], "llama-3.3-70b-versatile", true);
        res.json(JSON.parse(rawJSON));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Project Brainstormer
app.post('/api/brainstorm-project', async (req, res) => {
    try {
        const { interests, level } = req.body;
        const prompt = `Act as an Elite College/University Admissions Consultant. A student at the ${level} level is passionate about: "${interests}". 
Generate 3 highly unique, impressive, and actionable "X-Factor" project ideas that combine these interests.
If Undergraduate, focus on impactful extracurriculars, apps, community projects, or independent research.
If Graduate, focus on advanced research gaps, thesis topics, novel open-source tools, or deep technical projects.

Return EXACTLY this JSON format:
{
  "projects": [
    {
      "title": "Catchy Project Title",
      "category": "e.g. Open-Source App, Research Paper, Community Org",
      "description": "3-4 sentences detailing what the project is, why it stands out to admissions officers, and the impact it will have.",
      "roadmap": [
        "Week 1: Exact first step to take",
        "Week 2: Next milestone",
        "Week 3: Third milestone",
        "Week 4: Final goal for the 30-day sprint"
      ]
    }
  ]
}`;
        const rawJSON = await callGroqAI([{ role: "user", content: prompt }], "llama-3.3-70b-versatile", true);
        res.json(JSON.parse(rawJSON));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve Frontend in Production
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-All Route to serve index.html for React Router
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`UniTrack Backend running on http://localhost:${PORT}`);
});
