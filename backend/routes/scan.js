const express = require('express');
const router = express.Router();
const multer = require('multer');
const { pdfToText } = require('pdf-ts'); // Modern, Node v22 safe extraction method
const { Groq } = require('groq-sdk');
const authMiddleware = require('../middleware/authMiddleware');
const Scan = require('../models/Scan');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 1. POST: Analyze Pipeline via Groq Cloud Inference
router.post('/analyze', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a physical PDF resume file.' });
    if (!req.body.jobDescription) return res.status(400).json({ error: 'Missing target requirements framework.' });
    if (!req.body.jobRole) return res.status(400).json({ error: 'Missing target job role.' });

    // Modern text extraction execution pattern
    let resumeText = '';
    try {
      resumeText = await pdfToText(req.file.buffer);
    } catch (parseError) {
      console.error('PDF Extraction Error:', parseError);
      return res.status(400).json({ error: 'Failed to process document syntax structure cleanly.' });
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: 'Failed to extract text from the PDF. Verify file contents.' });
    }

    // Advanced precision system prompt matching criteria
    const systemPrompt = `You are a strict, precision Enterprise ATS Optimization Engine and technical resume reviewer.
Your job is to analyze the provided Candidate Resume Text against the Target Job Description requirements with uncompromising, granular accuracy.

CRITICAL INSTRUCTIONS FOR USER SPECIFICITY:
1. Hard Skills Match: Extract ONLY actual software, languages, frameworks, and methodologies that explicitly exist within both the Candidate Resume Text AND the Target Job Description. Do not infer or assume.
2. Missing Priority Items: Identify core technical skills required in the Job Description that are completely missing or severely under-represented in the Candidate Resume.
3. Actionable Structural Feedback: Write highly detailed, customized advice. You MUST dynamically reference the actual project names, company names, or existing skill groups found inside the Candidate's Resume Text. 
   - DO NOT regurgitate generic placeholder example names from the JSON schema layout below.
   - For every improvement point, explicitly point out a real section in the candidate's resume and tell them EXACTLY what required phrasing, metric, or technical detail to inject to satisfy the target job description.
4. Score Breakdown: Break down the overall score into ATS Compatibility, Recruiter Readability, Technical Depth, and Impact Statements (0-100).
5. Keyword Density: List the top 5-10 technical keywords from the resume and their occurrence count.
6. Rewrite Suggestions: You MUST return an array of STRINGS. Each string must EXACTLY follow this format: "Original: [bad bullet point from resume] -> Rewrite: [optimized bullet point]". DO NOT return an array of objects.
7. Extracted Sections & Auto-Correction: Extract explicit text for the candidate's Name, Job Title, Phone, Email, Portfolio, Summary, Experience, Education, Hard Skills, Soft Skills. If missing, return null. CRITICAL: PDF extraction often drops the first letter of a name or capitalizes it (e.g. "USHANTH BANDARI"). You MUST intelligently infer the correct name and Title Case it (e.g. "Sushanth Bandari") using context like the email address. Ensure ALL extracted fields have clean formatting, proper casing, and no stray characters.

You must respond with a single, valid JSON object matching the structural schema below. Do not include any conversational text or markdown code wrappers.

Required JSON Output Structure:
{
  "overallScore": 75,
  "scoreBreakdown": {
    "atsCompatibility": 80,
    "recruiterReadability": 70,
    "technicalDepth": 75,
    "impactStatements": 65
  },
  "metrics": {
    "contactInfoPresent": true,
    "educationDetected": true,
    "experienceQuantified": false,
    "skillsMatch": false,
    "clearFormatting": true
  },
  "skillsAnalysis": {
    "hardSkills": ["SkillFound1", "SkillFound2"],
    "missingSkills": ["RequiredSkillMissing1", "RequiredSkillMissing2"]
  },
  "extractedSections": {
    "name": "Candidate Name or null",
    "jobTitle": "Job Title or null",
    "phone": "Phone Number or null",
    "email": "Email Address or null",
    "portfolio": "Portfolio/Website Link or null",
    "summary": "Summary/Objective or null",
    "experience": "Past Companies or null",
    "education": "Degrees/Universities or null",
    "hardSkills": "Technical Skills List or null",
    "softSkills": "Soft Skills List or null"
  },
  "keywordDensity": [
    { "keyword": "React", "count": 5 }
  ],
  "improvements": [
    "Dynamically generated explicit change step 1 targeting a real entity found in the candidate's resume."
  ],
  "rewriteSuggestions": [
    "Original: Did software development. -> Rewrite: Engineered a highly scalable software solution..."
  ]
}`;

    const userPrompt = `--- TARGET JOB DESCRIPTION ---
${req.body.jobDescription}

--- CANDIDATE RESUME TEXT ---
${resumeText}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1, 
      response_format: { type: "json_object" }
    });

    const analysisData = JSON.parse(completion.choices[0].message.content);

    // Defensive parsing for LLM hallucinations on rewriteSuggestions
    let safeRewriteSuggestions = [];
    if (analysisData.rewriteSuggestions) {
      let rawSuggestions = analysisData.rewriteSuggestions;
      if (typeof rawSuggestions === 'string') {
        try { rawSuggestions = JSON.parse(rawSuggestions); } catch (e) { rawSuggestions = [rawSuggestions]; }
      }
      if (Array.isArray(rawSuggestions)) {
        safeRewriteSuggestions = rawSuggestions.map(item => {
          if (typeof item === 'object') {
            return `Original: ${item.original || item.before || ''} -> Rewrite: ${item.rewrite || item.after || ''}`;
          }
          return String(item);
        });
      }
    }

    const newScan = new Scan({
      userId: req.user.id,
      filename: req.file.originalname,
      jobRole: req.body.jobRole,
      jobDescription: req.body.jobDescription,
      resumeText: resumeText,
      overallScore: analysisData.overallScore,
      scoreBreakdown: analysisData.scoreBreakdown,
      metrics: analysisData.metrics,
      skillsAnalysis: analysisData.skillsAnalysis,
      keywordDensity: analysisData.keywordDensity,
      improvements: analysisData.improvements,
      rewriteSuggestions: safeRewriteSuggestions,
      extractedSections: analysisData.extractedSections
    });

    await newScan.save();
    return res.status(200).json(newScan);

  } catch (error) {
    console.error('Groq Pipeline Failure Log:', error);
    return res.status(500).json({ error: 'Failed to process assessment logic sequence.' });
  }
});

// 2. GET: Retrieve user history records dynamically from MongoDB
router.get('/', authMiddleware, async (req, res) => {
  try {
    const historicalLogs = await Scan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(historicalLogs);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load historical database registries.' });
  }
});

// 3. POST: Generate Cover Letter
router.post('/generate-cover-letter/:scanId', authMiddleware, async (req, res) => {
  try {
    const scanId = req.params.scanId;
    const scan = await Scan.findOne({ _id: scanId, userId: req.user.id });

    if (!scan) return res.status(404).json({ error: 'Scan record not found.' });

    // Return cached cover letter if it exists
    if (scan.coverLetter) {
      return res.status(200).json({ coverLetter: scan.coverLetter });
    }

    if (!scan.resumeText) {
      return res.status(400).json({ error: 'Resume text is missing for this scan. Cannot generate cover letter.' });
    }

    const systemPrompt = `You are an expert career coach and professional copywriter.
Your task is to write a highly persuasive, tailored cover letter for the candidate applying for the role of ${scan.jobRole}.
Use the provided Candidate Resume Text and Target Job Description.
Do not invent facts; rely entirely on the provided resume. 

CRITICAL FORMATTING REQUIREMENT: 
You MUST format the output EXACTLY like the template below. 
Extract the candidate's actual Name, Email, Phone, and Location from their resume. If any of these are missing, use placeholders like [Your Email]. Extract the Company Name and Hiring Manager from the Job Description. If missing, use placeholders like [Company Name]. Use the current date for [Date].

--- START TEMPLATE ---
[Candidate Name]
[Candidate Email]
[Candidate Phone]
[Candidate Location]

[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]

Dear [Hiring Manager's Name],

[Paragraph 1: Introduction, expressing strong interest in the specific position at the company, and a brief summary of why the candidate is a great fit based on their top skills.]

[Paragraph 2: Core technical paragraph. Discuss extensive experience relevant to the job description. Mention specific technologies and refer to recent relevant experience or internships, detailing how the candidate used these skills to build scalable or responsive applications.]

[Paragraph 3: Culture and value alignment. Express being impressed by the company's commitment or values (extracted from JD if possible) and reiterate how the candidate's passion for high-quality code makes them an excellent fit.]

[Paragraph 4: Additional skills and soft skills. Highlight teamwork, tools used for collaboration, and any DevOps/Cloud experience to show adaptability and broad technical knowledge.]

[Paragraph 5: Excitement for the role and portfolio summary. Mention specific projects from the candidate's resume that showcase their ability to design and implement robust solutions.]

Thank you for considering my application. I would welcome the opportunity to discuss my qualifications further and explore how I can contribute to the success of [Company Name]. Please feel free to contact me at [Candidate Email] or [Candidate Phone].

Sincerely,

[Candidate Name]
--- END TEMPLATE ---

Return ONLY the cover letter text, strictly following the template above, without any markdown formatting or extra commentary.`;

    const userPrompt = `--- TARGET JOB DESCRIPTION ---
${scan.jobDescription}

--- CANDIDATE RESUME TEXT ---
${scan.resumeText}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
    });

    let coverLetter = completion.choices[0].message.content.trim();
    coverLetter = coverLetter.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();

    scan.coverLetter = coverLetter;
    await scan.save();

    return res.status(200).json({ coverLetter: scan.coverLetter });

  } catch (error) {
    console.error('Cover Letter Generation Error:', error);
    return res.status(500).json({ error: 'Failed to generate cover letter.' });
  }
});

// 4. DELETE: Delete a specific scan record
router.delete('/:scanId', authMiddleware, async (req, res) => {
  try {
    const scan = await Scan.findOneAndDelete({ _id: req.params.scanId, userId: req.user.id });
    if (!scan) return res.status(404).json({ error: 'Scan record not found.' });
    return res.status(200).json({ message: 'Scan record deleted successfully.' });
  } catch (error) {
    console.error('Delete Scan Error:', error);
    return res.status(500).json({ error: 'Failed to delete scan record.' });
  }
});

module.exports = router;