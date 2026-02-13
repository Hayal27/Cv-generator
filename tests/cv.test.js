const request = require('supertest');
const app = require('../server/index');
const { sequelize, CV, User } = require('../server/models');
const jwt = require('jsonwebtoken');

describe('CV API Tests', () => {
  let testUser;
  let authToken;
  let testCV;

  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });
    
    // Create test user
    testUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      password: 'password123'
    });

    // Generate auth token
    authToken = jwt.sign(
      { id: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/cv', () => {
    it('should create a new CV with valid data', async () => {
      const cvData = {
        title: 'Software Engineer Resume',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          city: 'New York',
          country: 'USA',
          linkedIn: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe'
        },
        summary: 'Experienced software engineer with 5+ years of experience in full-stack development.',
        experience: [
          {
            jobTitle: 'Senior Software Engineer',
            company: 'Tech Corp',
            location: 'New York, NY',
            startDate: '2020-01',
            endDate: '2023-12',
            isCurrentJob: false,
            description: 'Led development of web applications using React and Node.js',
            achievements: [
              'Improved application performance by 40%',
              'Led a team of 5 developers'
            ]
          }
        ],
        education: [
          {
            degree: "Bachelor's Degree",
            fieldOfStudy: 'Computer Science',
            institution: 'University of Technology',
            location: 'New York, NY',
            startDate: '2015-09',
            endDate: '2019-05',
            gpa: '3.8/4.0',
            achievements: ['Dean\'s List', 'Magna Cum Laude']
          }
        ],
        skills: [
          {
            name: 'JavaScript',
            level: 'Expert',
            category: 'Technical'
          },
          {
            name: 'React',
            level: 'Advanced',
            category: 'Technical'
          },
          {
            name: 'Leadership',
            level: 'Advanced',
            category: 'Soft Skills'
          }
        ],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce platform using MERN stack',
            technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
            startDate: '2022-01',
            endDate: '2022-06',
            projectUrl: 'https://example-ecommerce.com',
            githubUrl: 'https://github.com/johndoe/ecommerce',
            highlights: [
              'Implemented secure payment processing',
              'Built responsive design for mobile and desktop'
            ]
          }
        ],
        certifications: [
          {
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            issueDate: '2022-03',
            expiryDate: '2025-03',
            credentialId: 'AWS-123456',
            credentialUrl: 'https://aws.amazon.com/verification'
          }
        ],
        achievements: [
          {
            title: 'Employee of the Year',
            description: 'Recognized for outstanding performance and leadership',
            date: '2022-12',
            category: 'Professional',
            organization: 'Tech Corp'
          }
        ]
      };

      const response = await request(app)
        .post('/api/cv')
        .set('Authorization', `Bearer ${authToken}`)
        .send(cvData)
        .expect(201);

      expect(response.body.message).toBe('CV created successfully');
      expect(response.body.title).toBe(cvData.title);
      expect(response.body.personalInfo.firstName).toBe(cvData.personalInfo.firstName);
      expect(response.body.experience).toHaveLength(1);
      expect(response.body.skills).toHaveLength(3);

      testCV = response.body;
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        title: 'Te', // Too short
        personalInfo: {
          firstName: '',
          lastName: 'Doe',
          email: 'invalid-email'
        }
      };

      const response = await request(app)
        .post('/api/cv')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Validation error');
    });

    it('should return 401 for unauthenticated request', async () => {
      const cvData = {
        title: 'Test CV',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      };

      await request(app)
        .post('/api/cv')
        .send(cvData)
        .expect(401);
    });
  });

  describe('GET /api/cv/my-cvs', () => {
    it('should get user CVs with pagination', async () => {
      const response = await request(app)
        .get('/api/cv/my-cvs?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.cvs).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.cvs.length).toBeGreaterThan(0);
    });

    it('should return 401 for unauthenticated request', async () => {
      await request(app)
        .get('/api/cv/my-cvs')
        .expect(401);
    });
  });

  describe('GET /api/cv/:id', () => {
    it('should get CV by ID for owner', async () => {
      const response = await request(app)
        .get(`/api/cv/${testCV.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(testCV.id);
      expect(response.body.title).toBe(testCV.title);
    });

    it('should return 404 for non-existent CV', async () => {
      await request(app)
        .get('/api/cv/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/cv/:id', () => {
    it('should update CV with valid data', async () => {
      const updatedData = {
        ...testCV,
        title: 'Updated Software Engineer Resume',
        summary: 'Updated summary with more experience details.',
        skills: [
          ...testCV.skills,
          {
            name: 'Python',
            level: 'Intermediate',
            category: 'Technical'
          }
        ]
      };

      const response = await request(app)
        .put(`/api/cv/${testCV.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.message).toBe('CV updated successfully');
      expect(response.body.title).toBe('Updated Software Engineer Resume');
      expect(response.body.skills).toHaveLength(4);
    });
  });

  describe('DELETE /api/cv/:id', () => {
    it('should delete CV successfully', async () => {
      // Create a CV to delete
      const cvToDelete = await CV.create({
        title: 'CV to Delete',
        templateId: 1,
        userId: testUser.id,
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        summary: ''
      });

      const response = await request(app)
        .delete(`/api/cv/${cvToDelete.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('CV deleted successfully');
    });
  });
});

module.exports = {
  testUser,
  authToken
};