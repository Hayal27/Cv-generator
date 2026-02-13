const express = require('express');
const Joi = require('joi');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { 
  enhanceText, 
  suggestSkills, 
  calculateJobMatch,
  improveGrammar 
} = require('../services/aiService');

const router = express.Router();

// Validation schemas
const enhanceTextSchema = Joi.object({
  text: Joi.string().min(10).max(5003).required(),
  type: Joi.string().valid('summary', 'experience', 'achievement', 'general').default('general')
});

const skillSuggestionSchema = Joi.object({
  jobTitle: Joi.string().min(2).max(100).required(),
  currentSkills: Joi.array().items(Joi.string()).default([]),
  industry: Joi.string().allow('')
});

const jobMatchSchema = Joi.object({
  cvText: Joi.string().min(50).required(),
  jobDescription: Joi.string().min(50).required()
});

const grammarSchema = Joi.object({
  text: Joi.string().min(1).max(5003).required()
});

// Enhance text using AI
router.post('/enhance-text', optionalAuth, async (req, res) => {
  try {
    const { error, value } = enhanceTextSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details[0].message 
      });
    }

    const { text, type } = value;
    const enhancedText = await enhanceText(text, type);

    res.json({
      originalText: text,
      enhancedText,
      type
    });
  } catch (error) {
    console.error('Text enhancement error:', error);
    res.status(500).json({ 
      message: 'Failed to enhance text',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Suggest skills based on job title
router.post('/suggest-skills', optionalAuth, async (req, res) => {
  try {
    const { error, value } = skillSuggestionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details[0].message 
      });
    }

    const { jobTitle, currentSkills, industry } = value;
    const suggestedSkills = await suggestSkills(jobTitle, currentSkills, industry);

    res.json({
      jobTitle,
      currentSkills,
      suggestedSkills,
      industry
    });
  } catch (error) {
    console.error('Skill suggestion error:', error);
    res.status(500).json({ 
      message: 'Failed to suggest skills',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Calculate job match score
router.post('/job-match', optionalAuth, async (req, res) => {
  try {
    const { error, value } = jobMatchSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details[0].message 
      });
    }

    const { cvText, jobDescription } = value;
    const matchResult = await calculateJobMatch(cvText, jobDescription);

    res.json({
      matchScore: matchResult.score,
      matchedKeywords: matchResult.matchedKeywords,
      missingKeywords: matchResult.missingKeywords,
      recommendations: matchResult.recommendations
    });
  } catch (error) {
    console.error('Job match calculation error:', error);
    res.status(500).json({ 
      message: 'Failed to calculate job match',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Improve grammar and writing
router.post('/improve-grammar', optionalAuth, async (req, res) => {
  try {
    const { error, value } = grammarSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details[0].message 
      });
    }

    const { text } = value;
    const improvedText = await improveGrammar(text);

    res.json({
      originalText: text,
      improvedText,
      corrections: improvedText.corrections || []
    });
  } catch (error) {
    console.error('Grammar improvement error:', error);
    res.status(500).json({ 
      message: 'Failed to improve grammar',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get available AI features
router.get('/features', (req, res) => {
  res.json({
    features: [
      {
        name: 'Text Enhancement',
        endpoint: '/api/ai/enhance-text',
        description: 'Improve and rewrite CV content using AI',
        types: ['summary', 'experience', 'achievement', 'general']
      },
      {
        name: 'Skill Suggestions',
        endpoint: '/api/ai/suggest-skills',
        description: 'Get skill recommendations based on job title and industry'
      },
      {
        name: 'Job Match Score',
        endpoint: '/api/ai/job-match',
        description: 'Calculate how well your CV matches a job description'
      },
      {
        name: 'Grammar Improvement',
        endpoint: '/api/ai/improve-grammar',
        description: 'Fix grammar and improve writing quality'
      }
    ]
  });
});

module.exports = router;