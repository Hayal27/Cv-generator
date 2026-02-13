import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import PersonalInfoForm from '../components/CVBuilder/PersonalInfoForm';
import EducationForm from '../components/CVBuilder/EducationForm';
import ExperienceForm from '../components/CVBuilder/ExperienceForm';
import SkillsForm from '../components/CVBuilder/SkillsForm';
import ProjectsForm from '../components/CVBuilder/ProjectsForm';
import CertificationsForm from '../components/CVBuilder/CertificationsForm';
import AchievementsForm from '../components/CVBuilder/AchievementsForm';
import SummaryForm from '../components/CVBuilder/SummaryForm';
import CVPreview from '../components/CVBuilder/CVPreview';

const CVBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [cvData, setCvData] = useState({
    title: '',
    templateId: 1,
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      linkedIn: '',
      website: '',
      github: '',
      profileImage: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    summary: ''
  });

  const steps = [
    { id: 0, title: 'Personal Info', component: PersonalInfoForm },
    { id: 1, title: 'Summary', component: SummaryForm },
    { id: 2, title: 'Experience', component: ExperienceForm },
    { id: 3, title: 'Education', component: EducationForm },
    { id: 4, title: 'Skills', component: SkillsForm },
    { id: 5, title: 'Projects', component: ProjectsForm },
    { id: 6, title: 'Certifications', component: CertificationsForm },
    { id: 7, title: 'Achievements', component: AchievementsForm }
  ];

  useEffect(() => {
    if (isEditing) {
      loadCV();
    }
  }, [id, isEditing]);

  const loadCV = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cv/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCvData(data);
      } else {
        toast.error('Failed to load CV');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading CV:', error);
      toast.error('Error loading CV');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const saveCV = async (showToast = true) => {
    try {
      setSaving(true);
      const url = isEditing ? `/api/cv/${id}` : '/api/cv';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cvData)
      });

      if (response.ok) {
        const savedCV = await response.json();
        if (showToast) {
          toast.success(isEditing ? 'CV updated successfully!' : 'CV created successfully!');
        }
        
        if (!isEditing) {
          navigate(`/cv/edit/${savedCV.id}`);
        }
        return savedCV;
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save CV');
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error('Error saving CV');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const updateCvData = (section, data) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handlePreview = () => {
    setIsPreviewMode(true);
  };

  const handleBackToEdit = () => {
    setIsPreviewMode(false);
  };

  const handlePublish = async () => {
    const savedCV = await saveCV(false);
    if (savedCV) {
      navigate(`/cv/preview/${savedCV.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CV...</p>
        </div>
      </div>
    );
  }

  if (isPreviewMode) {
    return (
      <CVPreview 
        cvData={cvData} 
        onBack={handleBackToEdit}
        onSave={saveCV}
        onPublish={handlePublish}
        saving={saving}
      />
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit CV' : 'Create New CV'}
          </h1>
          <p className="text-gray-600">
            Build your professional CV step by step
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Steps</h3>
              <nav className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentStep === index
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                        currentStep === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      {step.title}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handlePreview}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Preview CV
                </button>
                <button
                  onClick={() => saveCV()}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Step Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Step {currentStep + 1} of {steps.length}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {Math.round(((currentStep + 1) / steps.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                <CurrentStepComponent
                  data={cvData}
                  updateData={updateCvData}
                />
              </div>

              {/* Navigation */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;