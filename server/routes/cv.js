const express = require('express');
const Joi = require('joi');
const { CV, User, Template } = require('../models');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { generatePDF, generateDOCX } = require('../services/documentGenerator');

const router = express.Router();

// Enhanced validation schemas
const personalInfoSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow(''),
  address: Joi.string().allow(''),
  city: Joi.string().allow(''),
  country: Joi.string().allow(''),
  linkedIn: Joi.string().uri().allow(''),
  website: Joi.string().uri().allow(''),
  github: Joi.string().uri().allow(''),
  profileImage: Joi.string().allow('')
});

const educationSchema = Joi.object({
  id: Joi.number().optional(),
  degree: Joi.string().required(),
  fieldOfStudy: Joi.string().required(),
  institution: Joi.string().required(),
  location: Joi.string().allow(''),
  startDate: Joi.string().required(),
  endDate: Joi.string().allow(''),
  isCurrentlyStudying: Joi.boolean().default(false),
  gpa: Joi.string().allow(''),
  achievements: Joi.array().items(Joi.string()).default([])
});

const experienceSchema = Joi.object({
  id: Joi.number().optional(),
  jobTitle: Joi.string().required(),
  company: Joi.string().required(),
  location: Joi.string().allow(''),
  startDate: Joi.string().required(),
  endDate: Joi.string().allow(''),
  isCurrentJob: Joi.boolean().default(false),
  description: Joi.string().allow(''),
  achievements: Joi.array().items(Joi.string()).default([])
});

const skillSchema = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().required(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').required(),
  category: Joi.string().required()
});

const projectSchema = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  technologies: Joi.array().items(Joi.string()).default([]),
  startDate: Joi.string().allow(''),
  endDate: Joi.string().allow(''),
  isOngoing: Joi.boolean().default(false),
  projectUrl: Joi.string().uri().allow(''),
  githubUrl: Joi.string().uri().allow(''),
  highlights: Joi.array().items(Joi.string()).default([])
});

const certificationSchema = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().required(),
  issuer: Joi.string().required(),
  issueDate: Joi.string().required(),
  expiryDate: Joi.string().allow(''),
  neverExpires: Joi.boolean().default(false),
  credentialId: Joi.string().allow(''),
  credentialUrl: Joi.string().uri().allow('')
});

const achievementSchema = Joi.object({
  id: Joi.number().optional(),
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  date: Joi.string().allow(''),
  category: Joi.string().required(),
  organization: Joi.string().allow('')
});

const cvSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  templateId: Joi.number().integer().min(1).default(1),
  personalInfo: personalInfoSchema.required(),
  education: Joi.array().items(educationSchema).default([]),
  experience: Joi.array().items(experienceSchema).default([]),
  skills: Joi.array().items(skillSchema).default([]),
  projects: Joi.array().items(projectSchema).default([]),
  certifications: Joi.array().items(certificationSchema).default([]),
  achievements: Joi.array().items(achievementSchema).default([]),
  summary: Joi.string().allow('').default(''),
  isPublic: Joi.boolean().default(false)
});

// Create CV - Main route
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Creating CV with data:', JSON.stringify(req.body, null, 2));
    
    const { error, value } = cvSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details[0].message 
      });
    }

    // Use default template if not specified
    if (!value.templateId) {
      value.templateId = 1;
    }

    console.log('Creating CV for user:', req.user.id);
    
    const cv = await CV.create({
      ...value,
      userId: req.user.id
    });

    console.log('CV created with ID:', cv.id);

    res.status(201).json({
      message: 'CV created successfully',
      id: cv.id,
      title: cv.title,
      personalInfo: cv.personalInfo,
      experience: cv.experience,
      education: cv.education,
      skills: cv.skills,
      projects: cv.projects,
      certifications: cv.certifications,
      achievements: cv.achievements,
      summary: cv.summary,
      isPublic: cv.isPublic,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt
    });
  } catch (error) {
    console.error('CV creation error:', error);
    res.status(500).json({ message: 'Failed to create CV', error: error.message });
  }
});

// Legacy route for backward compatibility
router.post('/create', authenticateToken, async (req, res) => {
  try {
    console.log('Creating CV via legacy route with data:', JSON.stringify(req.body, null, 2));
    
    const { error, value } = cvSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details[0].message 
      });
    }

    // Use default template if not specified
    if (!value.templateId) {
      value.templateId = 1;
    }

    console.log('Creating CV for user:', req.user.id);
    
    const cv = await CV.create({
      ...value,
      userId: req.user.id
    });

    console.log('CV created with ID:', cv.id);

    res.status(201).json({
      message: 'CV created successfully',
      id: cv.id,
      title: cv.title,
      personalInfo: cv.personalInfo,
      experience: cv.experience,
      education: cv.education,
      skills: cv.skills,
      projects: cv.projects,
      certifications: cv.certifications,
      achievements: cv.achievements,
      summary: cv.summary,
      isPublic: cv.isPublic,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt
    });
  } catch (error) {
    console.error('CV creation error:', error);
    res.status(500).json({ message: 'Failed to create CV', error: error.message });
  }
});

// Get user's CVs
router.get('/my-cvs', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: cvs } = await CV.findAndCountAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'title', 'templateId', 'isPublic', 'createdAt', 'updatedAt', 'lastModified']
    });

    res.json({
      cvs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Fetch CVs error:', error);
    res.status(500).json({ message: 'Failed to fetch CVs', error: error.message });
  }
});

// Get CV by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const cvId = parseInt(req.params.id);
    if (isNaN(cvId)) {
      return res.status(400).json({ message: 'Invalid CV ID' });
    }

    const cv = await CV.findByPk(cvId);

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Check if user can access this CV
    if (!cv.isPublic && (!req.user || req.user.id !== cv.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      id: cv.id,
      title: cv.title,
      personalInfo: cv.personalInfo,
      experience: cv.experience,
      education: cv.education,
      skills: cv.skills,
      projects: cv.projects,
      certifications: cv.certifications,
      achievements: cv.achievements,
      summary: cv.summary,
      isPublic: cv.isPublic,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt
    });
  } catch (error) {
    console.error('Fetch CV error:', error);
    res.status(500).json({ message: 'Failed to fetch CV', error: error.message });
  }
});

// Update CV
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const cvId = parseInt(req.params.id);
    if (isNaN(cvId)) {
      return res.status(400).json({ message: 'Invalid CV ID' });
    }

    const { error, value } = cvSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details[0].message 
      });
    }

    const cv = await CV.findOne({
      where: { id: cvId, userId: req.user.id }
    });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found or access denied' });
    }

    // Update the CV
    await cv.update({
      ...value,
      lastModified: new Date()
    });

    res.json({
      message: 'CV updated successfully',
      id: cv.id,
      title: cv.title,
      personalInfo: cv.personalInfo,
      experience: cv.experience,
      education: cv.education,
      skills: cv.skills,
      projects: cv.projects,
      certifications: cv.certifications,
      achievements: cv.achievements,
      summary: cv.summary,
      isPublic: cv.isPublic,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt
    });
  } catch (error) {
    console.error('CV update error:', error);
    res.status(500).json({ message: 'Failed to update CV', error: error.message });
  }
});

// Delete CV
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const cvId = parseInt(req.params.id);
    if (isNaN(cvId)) {
      return res.status(400).json({ message: 'Invalid CV ID' });
    }

    const cv = await CV.findOne({
      where: { id: cvId, userId: req.user.id }
    });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found or access denied' });
    }

    await cv.destroy();

    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    console.error('CV deletion error:', error);
    res.status(500).json({ message: 'Failed to delete CV', error: error.message });
  }
});

// Toggle CV visibility
router.patch('/:id/visibility', authenticateToken, async (req, res) => {
  try {
    const cvId = parseInt(req.params.id);
    if (isNaN(cvId)) {
      return res.status(400).json({ message: 'Invalid CV ID' });
    }

    const { isPublic } = req.body;
    if (typeof isPublic !== 'boolean') {
      return res.status(400).json({ message: 'isPublic must be a boolean' });
    }

    const cv = await CV.findOne({
      where: { id: cvId, userId: req.user.id }
    });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found or access denied' });
    }

    await cv.update({ isPublic });

    res.json({ 
      message: `CV ${isPublic ? 'published' : 'unpublished'} successfully`,
      isPublic 
    });
  } catch (error) {
    console.error('CV visibility toggle error:', error);
    res.status(500).json({ message: 'Failed to update CV visibility', error: error.message });
  }
});

// Export CV as PDF
router.post('/:id/export/pdf', authenticateToken, async (req, res) => {
  try {
    const cvId = parseInt(req.params.id);
    if (isNaN(cvId)) {
      return res.status(400).json({ message: 'Invalid CV ID' });
    }

    const cv = await CV.findOne({
      where: { id: cvId, userId: req.user.id },
      include: [{
        model: Template,
        as: 'template'
      }]
    });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found or access denied' });
    }

    const pdfBuffer = await generatePDF(cv);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cv.title || 'CV'}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Failed to export PDF', error: error.message });
  }
});

// Export CV as DOCX
router.post('/:id/export/docx', authenticateToken, async (req, res) => {
  try {
    const cvId = parseInt(req.params.id);
    if (isNaN(cvId)) {
      return res.status(400).json({ message: 'Invalid CV ID' });
    }

    const cv = await CV.findOne({
      where: { id: cvId, userId: req.user.id },
      include: [{
        model: Template,
        as: 'template'
      }]
    });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found or access denied' });
    }

    const docxBuffer = await generateDOCX(cv);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${cv.title || 'CV'}.docx"`);
    res.send(docxBuffer);
  } catch (error) {
    console.error('DOCX export error:', error);
    res.status(500).json({ message: 'Failed to export DOCX', error: error.message });
  }
});

module.exports = router;