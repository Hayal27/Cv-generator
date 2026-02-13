import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CVPreview = ({ cvData, onBack, onSave, onPublish, saving }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(cvData?.templateId || 'executive');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Ensure cvData has default structure
  const safeCV = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      linkedIn: '',
      github: '',
      website: '',
      profileImage: '',
      ...cvData?.personalInfo
    },
    summary: cvData?.summary || '',
    experience: Array.isArray(cvData?.experience) ? cvData.experience : [],
    education: Array.isArray(cvData?.education) ? cvData.education : [],
    skills: Array.isArray(cvData?.skills) ? cvData.skills : [],
    projects: Array.isArray(cvData?.projects) ? cvData.projects : [],
    certifications: Array.isArray(cvData?.certifications) ? cvData.certifications : [],
    achievements: Array.isArray(cvData?.achievements) ? cvData.achievements : [],
    id: cvData?.id
  };

  
  // Load templates from backend (optional - we have built-in templates)
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        if (response.ok) {
          const templatesData = await response.json();
          setTemplates(templatesData);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        // Continue with built-in templates
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Export functions
  const handleExportPDF = async () => {
    try {
      setExporting(true);
      
      // Use client-side PDF generation as fallback
      const { default: html2pdf } = await import('html2pdf.js');
      
      // Get the CV preview element
      const element = document.querySelector('.cv-preview-content');
      if (!element) {
        toast.error('CV content not found');
        return;
      }

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${safeCV.personalInfo.firstName}_${safeCV.personalInfo.lastName}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error exporting PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportDOCX = async () => {
    if (!safeCV.id) {
      toast.error('Please save your CV first');
      return;
    }

    try {
      setExporting(true);
      const response = await fetch(`/api/cv/${safeCV.id}/export/docx`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${safeCV.personalInfo.firstName}_${safeCV.personalInfo.lastName}_CV.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('DOCX exported successfully!');
      } else {
        toast.error('Failed to export DOCX');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error exporting DOCX');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate, endDate, isCurrent = false) => {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const getSkillLevel = (level) => {
    const levels = { 'Beginner': 25, 'Intermediate': 50, 'Advanced': 75, 'Expert': 100 };
    return levels[level] || 50;
  };

  const templateNames = {
    executive: 'Executive',
    modern: 'Modern',
    creative: 'Creative',
    minimal: 'Minimal'
  };

  // Modern Template
  const ModernTemplate = () => (
    <div className="bg-white shadow-2xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b-4 border-blue-500 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {safeCV.personalInfo.profileImage && (
              <img 
                src={safeCV.personalInfo.profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-lg object-cover shadow-lg"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {safeCV.personalInfo.firstName} {safeCV.personalInfo.lastName}
              </h1>
              {safeCV.summary && (
                <p className="text-lg text-gray-600 mb-4 max-w-2xl">
                  {safeCV.summary}
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                {safeCV.personalInfo.email && <span>📧 {safeCV.personalInfo.email}</span>}
                {safeCV.personalInfo.phone && <span>📱 {safeCV.personalInfo.phone}</span>}
                {(safeCV.personalInfo.city || safeCV.personalInfo.country) && (
                  <span>📍 {[safeCV.personalInfo.city, safeCV.personalInfo.country].filter(Boolean).join(', ')}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Experience */}
              {safeCV.experience && safeCV.experience.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-100 pb-2">
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {safeCV.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{exp.jobTitle}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {formatDateRange(exp.startDate, exp.endDate, exp.isCurrentJob)}
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-blue-600 mb-2">{exp.company}</p>
                        {exp.location && <p className="text-gray-600 mb-2">{exp.location}</p>}
                        {exp.description && <p className="text-gray-700 mb-3">{exp.description}</p>}
                        {exp.achievements && exp.achievements.length > 0 && exp.achievements[0] && (
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {exp.achievements.filter(achievement => achievement.trim()).map((achievement, achIndex) => (
                              <li key={achIndex}>{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {safeCV.projects && safeCV.projects.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-100 pb-2">
                    Projects
                  </h2>
                  <div className="space-y-6">
                    {safeCV.projects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                          <span className="text-sm text-gray-500">
                            {formatDateRange(project.startDate, project.endDate, project.isOngoing)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-4">
                          {project.projectUrl && (
                            <a href={project.projectUrl} className="text-blue-600 hover:underline text-sm">
                              🔗 Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} className="text-blue-600 hover:underline text-sm">
                              📂 Source Code
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Skills */}
              {safeCV.skills && safeCV.skills.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-blue-600 mb-4">Skills</h2>
                  <div className="space-y-4">
                    {Object.entries(
                      safeCV.skills.reduce((acc, skill) => {
                        if (!acc[skill.category]) acc[skill.category] = [];
                        acc[skill.category].push(skill);
                        return acc;
                      }, {})
                    ).map(([category, skills]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                        <div className="space-y-2">
                          {skills.map((skill, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-gray-700">{skill.name}</span>
                              <span className="text-sm text-blue-600 font-medium">{skill.level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {safeCV.education && safeCV.education.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-blue-600 mb-4">Education</h2>
                  <div className="space-y-4">
                    {safeCV.education.map((edu, index) => (
                      <div key={index}>
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-blue-600 font-semibold">{edu.fieldOfStudy}</p>
                        <p className="text-gray-700">{edu.institution}</p>
                        <p className="text-sm text-gray-600">
                          {formatDateRange(edu.startDate, edu.endDate, edu.isCurrentlyStudying)}
                        </p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {safeCV.certifications && safeCV.certifications.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-blue-600 mb-4">Certifications</h2>
                  <div className="space-y-3">
                    {safeCV.certifications.map((cert, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded">
                        <h3 className="font-bold text-gray-900">{cert.name}</h3>
                        <p className="text-blue-600 font-semibold">{cert.issuer}</p>
                        <p className="text-sm text-gray-600">{formatDate(cert.issueDate)}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Creative Template
  const CreativeTemplate = () => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {safeCV.personalInfo.profileImage && (
              <div className="relative">
                <img 
                  src={safeCV.personalInfo.profileImage} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  ✨
                </div>
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                {safeCV.personalInfo.firstName} {safeCV.personalInfo.lastName}
              </h1>
              {safeCV.summary && (
                <p className="text-xl text-purple-100 mb-4 max-w-2xl">
                  {safeCV.summary}
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {safeCV.personalInfo.email && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    📧 {safeCV.personalInfo.email}
                  </span>
                )}
                {safeCV.personalInfo.phone && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    📱 {safeCV.personalInfo.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Experience */}
              {safeCV.experience && safeCV.experience.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                    🚀 Experience
                  </h2>
                  <div className="space-y-6">
                    {safeCV.experience.map((exp, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{exp.jobTitle}</h3>
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
                            {formatDateRange(exp.startDate, exp.endDate, exp.isCurrentJob)}
                          </span>
                        </div>
                        <p className="text-xl font-semibold text-purple-600 mb-2">{exp.company}</p>
                        {exp.location && <p className="text-gray-600 mb-3">📍 {exp.location}</p>}
                        {exp.description && <p className="text-gray-700 mb-4">{exp.description}</p>}
                        {exp.achievements && exp.achievements.length > 0 && exp.achievements[0] && (
                          <div className="space-y-2">
                            {exp.achievements.filter(achievement => achievement.trim()).map((achievement, achIndex) => (
                              <div key={achIndex} className="flex items-start">
                                <span className="text-purple-500 mr-2">⭐</span>
                                <span className="text-gray-700">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {safeCV.projects && safeCV.projects.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                    💡 Projects
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {safeCV.projects.map((project, index) => (
                      <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{project.name}</h3>
                          <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                            {formatDateRange(project.startDate, project.endDate, project.isOngoing)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-4">
                          {project.projectUrl && (
                            <a href={project.projectUrl} className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:shadow-md transition-shadow font-semibold">
                              🔗 Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:shadow-md transition-shadow font-semibold">
                              📂 Code
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              {safeCV.skills && safeCV.skills.length > 0 && (
                <section className="bg-white rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-purple-600 mb-4">🎯 Skills</h2>
                  <div className="space-y-4">
                    {Object.entries(
                      safeCV.skills.reduce((acc, skill) => {
                        if (!acc[skill.category]) acc[skill.category] = [];
                        acc[skill.category].push(skill);
                        return acc;
                      }, {})
                    ).map(([category, skills]) => (
                      <div key={category}>
                        <h3 className="font-bold text-gray-900 mb-2">{category}</h3>
                        <div className="space-y-2">
                          {skills.map((skill, index) => (
                            <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">{skill.name}</span>
                                <span className="text-purple-600 text-sm font-bold">{skill.level}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {safeCV.education && safeCV.education.length > 0 && (
                <section className="bg-white rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-purple-600 mb-4">🎓 Education</h2>
                  <div className="space-y-4">
                    {safeCV.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-purple-400 pl-4">
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-purple-600 font-semibold">{edu.fieldOfStudy}</p>
                        <p className="text-gray-700">{edu.institution}</p>
                        <p className="text-sm text-gray-600">
                          {formatDateRange(edu.startDate, edu.endDate, edu.isCurrentlyStudying)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Minimal Template
  const MinimalTemplate = () => (
    <div className="bg-white shadow-lg">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12 pb-8 border-b border-gray-200">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            {safeCV.personalInfo.firstName} {safeCV.personalInfo.lastName}
          </h1>
          {safeCV.summary && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              {safeCV.summary}
            </p>
          )}
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            {safeCV.personalInfo.email && <span>{safeCV.personalInfo.email}</span>}
            {safeCV.personalInfo.phone && <span>{safeCV.personalInfo.phone}</span>}
            {(safeCV.personalInfo.city || safeCV.personalInfo.country) && (
              <span>{[safeCV.personalInfo.city, safeCV.personalInfo.country].filter(Boolean).join(', ')}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="md:col-span-3 space-y-12">
            {/* Experience */}
            {safeCV.experience && safeCV.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-6 uppercase tracking-wide">
                  Experience
                </h2>
                <div className="space-y-8">
                  {safeCV.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-xl font-medium text-gray-900">{exp.jobTitle}</h3>
                        <span className="text-sm text-gray-500">
                          {formatDateRange(exp.startDate, exp.endDate, exp.isCurrentJob)}
                        </span>
                      </div>
                      <p className="text-lg text-gray-700 mb-1">{exp.company}</p>
                      {exp.location && <p className="text-gray-600 mb-3">{exp.location}</p>}
                      {exp.description && <p className="text-gray-700 mb-3">{exp.description}</p>}
                      {exp.achievements && exp.achievements.length > 0 && exp.achievements[0] && (
                        <ul className="space-y-1 text-gray-700">
                          {exp.achievements.filter(achievement => achievement.trim()).map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {safeCV.projects && safeCV.projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-6 uppercase tracking-wide">
                  Projects
                </h2>
                <div className="space-y-6">
                  {safeCV.projects.map((project, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-xl font-medium text-gray-900">{project.name}</h3>
                        <span className="text-sm text-gray-500">
                          {formatDateRange(project.startDate, project.endDate, project.isOngoing)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                        </p>
                      )}
                      <div className="flex space-x-4 text-sm">
                        {project.projectUrl && (
                          <a href={project.projectUrl} className="text-gray-700 hover:text-gray-900 underline">
                            View Project
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} className="text-gray-700 hover:text-gray-900 underline">
                            Source Code
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            {safeCV.skills && safeCV.skills.length > 0 && (
              <section>
                <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wide">
                  Skills
                </h2>
                <div className="space-y-4">
                  {Object.entries(
                    safeCV.skills.reduce((acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = [];
                      acc[skill.category].push(skill);
                      return acc;
                    }, {})
                  ).map(([category, skills]) => (
                    <div key={category}>
                      <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
                      <div className="space-y-1">
                        {skills.map((skill, index) => (
                          <div key={index} className="text-sm text-gray-700">
                            {skill.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {safeCV.education && safeCV.education.length > 0 && (
              <section>
                <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wide">
                  Education
                </h2>
                <div className="space-y-4">
                  {safeCV.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.fieldOfStudy}</p>
                      <p className="text-gray-700">{edu.institution}</p>
                      <p className="text-sm text-gray-600">
                        {formatDateRange(edu.startDate, edu.endDate, edu.isCurrentlyStudying)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {safeCV.certifications && safeCV.certifications.length > 0 && (
              <section>
                <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wide">
                  Certifications
                </h2>
                <div className="space-y-3">
                  {safeCV.certifications.map((cert, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-gray-700">{cert.issuer}</p>
                      <p className="text-sm text-gray-600">{formatDate(cert.issueDate)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ExecutiveTemplate = () => (
    <div className="bg-white shadow-2xl">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Profile Image */}
            {safeCV.personalInfo.profileImage && (
              <div className="lg:col-span-1 flex justify-center lg:justify-start">
                <div className="relative">
                  <img 
                    src={safeCV.personalInfo.profileImage} 
                    alt="Profile" 
                    className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-500/20"></div>
                </div>
              </div>
            )}
            <div className={safeCV.personalInfo.profileImage ? "lg:col-span-2" : "lg:col-span-2"}>
              <h1 className="text-5xl font-bold mb-2 tracking-tight">
                {safeCV.personalInfo.firstName} {safeCV.personalInfo.lastName}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-500 mb-4"></div>
              {safeCV.summary && (
                <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
                  {safeCV.summary}
                </p>
              )}
            </div>
            <div className="space-y-3 text-right lg:text-left">
              {safeCV.personalInfo.email && (
                <div className="flex items-center justify-end lg:justify-start">
                  <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-200">{safeCV.personalInfo.email}</span>
                </div>
              )}
              {safeCV.personalInfo.phone && (
                <div className="flex items-center justify-end lg:justify-start">
                  <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-200">{safeCV.personalInfo.phone}</span>
                </div>
              )}
              {(safeCV.personalInfo.city || safeCV.personalInfo.country) && (
                <div className="flex items-center justify-end lg:justify-start">
                  <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-gray-200">
                    {[safeCV.personalInfo.city, safeCV.personalInfo.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              <div className="flex space-x-4 justify-end lg:justify-start mt-4">
                {safeCV.personalInfo.linkedIn && (
                  <a href={safeCV.personalInfo.linkedIn} className="text-blue-400 hover:text-blue-300 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {safeCV.personalInfo.github && (
                  <a href={safeCV.personalInfo.github} className="text-blue-400 hover:text-blue-300 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {safeCV.personalInfo.website && (
                  <a href={safeCV.personalInfo.website} className="text-blue-400 hover:text-blue-300 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Experience */}
            {safeCV.experience && safeCV.experience.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Professional Experience</h2>
                </div>
                <div className="space-y-8">
                  {safeCV.experience.map((exp, index) => (
                    <div key={index} className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-l-0">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{exp.jobTitle}</h3>
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            {formatDateRange(exp.startDate, exp.endDate, exp.isCurrentJob)}
                          </span>
                        </div>
                        <div className="flex items-center mb-4">
                          <h4 className="text-xl font-semibold text-blue-600">{exp.company}</h4>
                          {exp.location && <span className="text-gray-500 ml-2">• {exp.location}</span>}
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 mb-4 leading-relaxed">{exp.description}</p>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && exp.achievements[0] && (
                          <div className="space-y-2">
                            <h5 className="font-semibold text-gray-900 mb-2">Key Achievements:</h5>
                            <ul className="space-y-2">
                              {exp.achievements.filter(achievement => achievement.trim()).map((achievement, achIndex) => (
                                <li key={achIndex} className="flex items-start">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-gray-700">{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {safeCV.projects && safeCV.projects.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {safeCV.projects.map((project, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{project.name}</h3>
                        <span className="text-sm text-gray-600">
                          {formatDateRange(project.startDate, project.endDate, project.isOngoing)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.highlights && project.highlights.length > 0 && project.highlights[0] && (
                        <ul className="space-y-2 mb-4">
                          {project.highlights.filter(highlight => highlight.trim()).map((highlight, hlIndex) => (
                            <li key={hlIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex space-x-4">
                        {project.projectUrl && (
                          <a href={project.projectUrl} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Source Code
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            {safeCV.skills && safeCV.skills.length > 0 && (
              <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                </div>
                <div className="space-y-6">
                  {Object.entries(
                    safeCV.skills.reduce((acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = [];
                      acc[skill.category].push(skill);
                      return acc;
                    }, {})
                  ).map(([category, skills]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                      <div className="space-y-3">
                        {skills.map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-700 font-medium">{skill.name}</span>
                              <span className="text-sm text-gray-500">{skill.level}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getSkillLevel(skill.level)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {safeCV.education && safeCV.education.length > 0 && (
              <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                </div>
                <div className="space-y-4">
                  {safeCV.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-4 pb-4">
                      <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-indigo-600 font-semibold">{edu.fieldOfStudy}</p>
                      <p className="text-gray-700 font-medium">{edu.institution}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">
                          {formatDateRange(edu.startDate, edu.endDate, edu.isCurrentlyStudying)}
                        </span>
                        {edu.gpa && <span className="text-sm font-medium text-gray-700">GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {safeCV.certifications && safeCV.certifications.length > 0 && (
              <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
                </div>
                <div className="space-y-4">
                  {safeCV.certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-gray-900 mb-1">{cert.name}</h3>
                      <p className="text-orange-600 font-semibold mb-2">{cert.issuer}</p>
                      <div className="text-sm text-gray-600">
                        <p>Issued: {formatDate(cert.issueDate)}</p>
                        {!cert.neverExpires && cert.expiryDate && (
                          <p>Expires: {formatDate(cert.expiryDate)}</p>
                        )}
                      </div>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block">
                          Verify →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {safeCV.achievements && safeCV.achievements.length > 0 && (
              <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                </div>
                <div className="space-y-4">
                  {safeCV.achievements.map((achievement, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-4">
                      <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                      {achievement.organization && (
                        <p className="text-red-600 font-semibold">{achievement.organization}</p>
                      )}
                      {achievement.date && (
                        <p className="text-sm text-gray-600">{formatDate(achievement.date)}</p>
                      )}
                      {achievement.description && (
                        <p className="text-gray-700 text-sm mt-1">{achievement.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">CV Preview</h1>
            <p className="text-gray-600">Review your professional CV before publishing</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Template Selector */}
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(templateNames).map(([key, name]) => (
                <option key={key} value={key}>{name} Template</option>
              ))}
            </select>
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Back to Edit
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={onPublish}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Publish CV
            </button>
          </div>
        </div>

        {/* CV Preview */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden cv-preview-content">
          {selectedTemplate === 'executive' && <ExecutiveTemplate />}
          {selectedTemplate === 'modern' && <ModernTemplate />}
          {selectedTemplate === 'creative' && <CreativeTemplate />}
          {selectedTemplate === 'minimal' && <MinimalTemplate />}
        </div>

        {/* Print/Export Options */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print CV
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button 
            onClick={handleExportDOCX}
            disabled={exporting}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707v11a2 2 0 01-2 2z" />
            </svg>
            {exporting ? 'Exporting...' : 'Export DOCX'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;