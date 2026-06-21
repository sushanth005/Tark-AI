const express = require('express');
const router = express.Router();
const { Groq } = require('groq-sdk');
const authMiddleware = require('../middleware/authMiddleware');
const Scan = require('../models/Scan');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST: AI Mock Interview Chat powered by Groq
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { scanId, messages } = req.body;

    if (!scanId) return res.status(400).json({ error: 'Scan ID is required.' });
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages array is required.' });

    const scan = await Scan.findOne({ _id: scanId, userId: req.user.id });
    if (!scan) return res.status(404).json({ error: 'Scan record not found.' });

    const candidateName = scan.extractedSections?.name || 'the candidate';
    const hardSkills = scan.skillsAnalysis?.hardSkills?.join(', ') || 'Not available';
    const missingSkills = scan.skillsAnalysis?.missingSkills?.join(', ') || 'None';
    const experience = scan.extractedSections?.experience || 'Not specified';
    const education = scan.extractedSections?.education || 'Not specified';
    const softSkills = scan.extractedSections?.softSkills || 'Not specified';
    const overallScore = scan.overallScore || 'N/A';

    const systemPrompt = `You are a professional, experienced technical interviewer conducting a mock interview for the role of "${scan.jobRole}".

CANDIDATE PROFILE:
- Name: ${candidateName}
- ATS Score: ${overallScore}/100
- Hard Skills Found: ${hardSkills}
- Missing Skills: ${missingSkills}
- Experience: ${experience}
- Education: ${education}
- Soft Skills: ${softSkills}

TARGET JOB DESCRIPTION:
${scan.jobDescription}

CANDIDATE RESUME TEXT:
${scan.resumeText}

INTERVIEW GUIDELINES:
1. Ask ONE question at a time. Never ask multiple questions in a single message.
2. Start with a warm, professional greeting using the candidate's name and a brief introduction about the role.
3. Begin with an easy ice-breaker question (e.g., "Tell me about yourself" or "Walk me through your background").
4. Progress through these phases:
   - Phase 1 (Questions 1-2): Behavioral questions about experience and motivation
   - Phase 2 (Questions 3-5): Technical questions targeting specific skills from the job description and resume
   - Phase 3 (Questions 6-7): Situational/problem-solving questions relevant to the role
   - Phase 4 (Question 8): A closing question about their goals or questions for the company
5. After each candidate response, provide a brief, encouraging acknowledgment before asking the next question.
6. Reference SPECIFIC skills, projects, or experiences from the candidate's actual resume when asking questions.
7. Target skills that appear in the job description, especially any missing skills.
8. Keep your tone professional but warm and encouraging.
9. After approximately 8 exchanges, indicate the interview is wrapping up and ask if they have any final questions.

WHEN THE USER SENDS "END_INTERVIEW", provide a comprehensive interview feedback summary in this EXACT format:

🎯 **Interview Performance Summary**

**Overall Rating:** [Excellent/Good/Needs Improvement] 

**Strengths:**
• [Specific strength 1 based on their actual responses]
• [Specific strength 2]
• [Specific strength 3]

**Areas for Improvement:**
• [Specific area 1 with actionable advice]
• [Specific area 2 with actionable advice]
• [Specific area 3 with actionable advice]

**Key Recommendations:**
• [Recommendation 1 for interview preparation]
• [Recommendation 2]

**Final Note:** [Encouraging closing message]

Do NOT use markdown code blocks. Use only plain text with bold markers (**) and bullet points (•).`;

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0].message.content.trim();

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Interview Chat Error:', error);
    return res.status(500).json({ error: 'Failed to generate interview response.' });
  }
});

// GET: Fetch scan data for interview context display
router.get('/scan/:scanId', authMiddleware, async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.scanId, userId: req.user.id })
      .select('jobRole jobDescription filename overallScore extractedSections skillsAnalysis');
    
    if (!scan) return res.status(404).json({ error: 'Scan record not found.' });
    
    return res.status(200).json(scan);
  } catch (error) {
    console.error('Fetch Scan for Interview Error:', error);
    return res.status(500).json({ error: 'Failed to load scan data.' });
  }
});

module.exports = router;
