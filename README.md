# CV Generator - AI-Powered Resume Builder

A comprehensive CV Generator web application built with React (frontend), Node.js/Express (backend), and MySQL (database) with AI-powered enhancements.

## Features

### ✅ Implemented
- **User Authentication**: JWT-based registration and login system
- **Modern UI**: Clean, responsive design with TailwindCSS and Vite
- **Database Models**: Complete MySQL schema with Sequelize ORM
- **API Structure**: RESTful API endpoints for all major operations
- **AI Integration**: Hugging Face models for text enhancement and job matching
- **Document Export**: PDF and DOCX generation capabilities
- **Security**: Helmet, rate limiting, CORS, input validation

### 🚧 In Development
- **CV Builder**: Multi-step form interface for creating CVs
- **Template System**: Multiple professional CV templates
- **Real-time Preview**: Live CV preview as you build
- **AI Enhancements**: Text improvement, skill suggestions, grammar checking

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Hook Form** for form management
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express framework
- **MySQL** with Sequelize ORM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Puppeteer** for PDF generation
- **DOCX** library for Word document export
- **Helmet** and rate limiting for security

### AI Features
- **Hugging Face API** integration
- **Flan-T5** for text enhancement
- **Sentence-BERT** for job matching
- **KeyBERT** for skill suggestions
- **Gramformer** for grammar improvement

## Project Structure

```
cv-generator/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── main.jsx        # App entry point
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middleware/         # Custom middleware
│   └── index.js            # Server entry point
└── package.json            # Root package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd cv-generator

# Install all dependencies
npm run install-all
```

### 2. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE cv_generator;
```

### 3. Environment Configuration

```bash
# Copy environment file
cp server/.env.example server/.env

# Edit server/.env with your configuration:
# - Database credentials
# - JWT secret
# - Hugging Face API key (optional)
```

### 4. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
# Backend (http://localhost:5003)
npm run server

# Frontend (http://localhost:3000)
npm run client
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### CV Management
- `POST /api/cv/create` - Create new CV
- `GET /api/cv/my-cvs` - Get user's CVs
- `GET /api/cv/:id` - Get specific CV
- `PUT /api/cv/:id` - Update CV
- `DELETE /api/cv/:id` - Delete CV
- `POST /api/cv/:id/export/pdf` - Export as PDF
- `POST /api/cv/:id/export/docx` - Export as DOCX

### AI Features
- `POST /api/ai/enhance-text` - Enhance text content
- `POST /api/ai/suggest-skills` - Get skill suggestions
- `POST /api/ai/job-match` - Calculate job match score
- `POST /api/ai/improve-grammar` - Improve grammar

## Database Schema

### Users Table
- `id` (Primary Key)
- `firstName`, `lastName`
- `email` (Unique)
- `password` (Hashed)
- `isActive`
- `createdAt`, `updatedAt`

### CVs Table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `title`
- `templateId`
- `personalInfo` (JSON)
- `education` (JSON)
- `experience` (JSON)
- `skills` (JSON)
- `projects` (JSON)
- `certifications` (JSON)
- `achievements` (JSON)
- `summary` (Text)
- `isPublic`
- `lastModified`

### Templates Table
- `id` (Primary Key)
- `name`
- `description`
- `previewImage`
- `htmlTemplate` (Long Text)
- `cssStyles` (Long Text)
- `isActive`
- `category`
- `usageCount`

## Development Status

### ✅ Completed
- [x] Project setup and configuration
- [x] Database models and relationships
- [x] Authentication system
- [x] API endpoints structure
- [x] Frontend routing and navigation
- [x] Responsive UI components
- [x] AI service integration
- [x] Document generation services

### 🔄 In Progress
- [ ] CV Builder form interface
- [ ] Template management system
- [ ] Real-time CV preview
- [ ] File upload handling
- [ ] Advanced AI features

### 📋 Planned
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social media login
- [ ] CV analytics and tracking
- [ ] Collaborative CV editing
- [ ] Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.