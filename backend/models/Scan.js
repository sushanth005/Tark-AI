const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  jobRole: { type: String, required: true },
  jobDescription: { type: String, required: true },
  resumeText: { type: String },
  coverLetter: { type: String },
  overallScore: { type: Number, required: true },
  scoreBreakdown: {
    atsCompatibility: { type: Number },
    recruiterReadability: { type: Number },
    technicalDepth: { type: Number },
    impactStatements: { type: Number }
  },
  metrics: {
    contactInfoPresent: { type: Boolean, default: false },
    educationDetected: { type: Boolean, default: false },
    experienceQuantified: { type: Boolean, default: false },
    skillsMatch: { type: Boolean, default: false },
    clearFormatting: { type: Boolean, default: false }
  },
  extractedSections: {
    name: { type: String, default: null },
    jobTitle: { type: String, default: null },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    portfolio: { type: String, default: null },
    summary: { type: String, default: null },
    experience: { type: String, default: null },
    education: { type: String, default: null },
    hardSkills: { type: String, default: null },
    softSkills: { type: String, default: null }
  },
  skillsAnalysis: {
    hardSkills: [{ type: String }],
    missingSkills: [{ type: String }]
  },
  keywordDensity: [{
    keyword: { type: String },
    count: { type: Number }
  }],
  improvements: [{ type: String }],
  rewriteSuggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', ScanSchema);