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

*** CRITICAL PERSONA INSTRUCTIONS ***
- YOU MUST STAY IN CHARACTER AS THE INTERVIEWER AT ALL TIMES.
- NEVER dump the candidate's profile data, ATS score, or raw resume text back to them.
- DO NOT provide a summary of what you are going to do. Just start the interview immediately.
- BE CONVERSATIONAL. When the candidate answers a question, you MUST briefly respond to their answer naturally (e.g., "That's a great example of handling technical debt..." or "Interesting approach to state management...") BEFORE asking the next question.
- ASK EXACTLY ONE QUESTION at a time. Wait for the candidate's response.

CANDIDATE PROFILE (For your internal context only):
- Name: ${candidateName}
- Hard Skills: ${hardSkills}
- Missing Skills (Areas to probe): ${missingSkills}

TARGET JOB DESCRIPTION (For your internal context only):
${scan.jobDescription}

CANDIDATE RESUME TEXT (For your internal context only):
${scan.resumeText}

INTERVIEW FLOW:
1. If this is the VERY FIRST message, start with a warm, professional greeting using the candidate's name, briefly introduce the role, and ask a simple ice-breaker (e.g., "Tell me about your background").
2. For subsequent messages, acknowledge and briefly comment on their previous answer.
3. Then, ask the next question. Base your questions on:
   - Their previous answer (ask a follow-up if their answer was shallow).
   - Specific projects or skills mentioned in their resume.
   - The core technical requirements from the job description.
4. Keep your tone professional, warm, and encouraging.
5. After approximately 8 exchanges, ask if they have any final questions for you.

WHEN THE USER SENDS "END_INTERVIEW" (or explicitly says they want to end), provide a comprehensive interview feedback summary in this EXACT format:

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
