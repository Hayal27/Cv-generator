import React, { useState } from 'react';

const EducationForm = ({ data, updateData }) => {
  const [education, setEducation] = useState(() => {
    const edu = data?.education;
    return Array.isArray(edu) ? edu : [];
  });

  const updateEducation = (newEducation) => {
    setEducation(newEducation);
    updateData('education', newEducation);
  };

  const addEducation = () => {
    const newEducationItem = {
      id: Date.now(),
      degree: '',
      fieldOfStudy: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false,
      gpa: '',
      achievements: ['']
    };
    updateEducation([...education, newEducationItem]);
  };

  const removeEducation = (id) => {
    updateEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducationItem = (id, field, value) => {
    updateEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addAchievement = (eduId) => {
    updateEducation(education.map(edu => 
      edu.id === eduId 
        ? { ...edu, achievements: [...edu.achievements, ''] }
        : edu
    ));
  };

  const removeAchievement = (eduId, achievementIndex) => {
    updateEducation(education.map(edu => 
      edu.id === eduId 
        ? { 
            ...edu, 
            achievements: edu.achievements.filter((_, index) => index !== achievementIndex)
          }
        : edu
    ));
  };

  const updateAchievement = (eduId, achievementIndex, value) => {
    updateEducation(education.map(edu => 
      edu.id === eduId 
        ? { 
            ...edu, 
            achievements: edu.achievements.map((achievement, index) => 
              index === achievementIndex ? value : achievement
            )
          }
        : edu
    ));
  };

  const degreeOptions = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree (PhD)',
    'Professional Degree',
    'Certificate',
    'Diploma'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Education</h3>
          <p className="text-sm text-gray-500">Add your educational background</p>
        </div>
        <button
          onClick={addEducation}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No education added</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your educational background.</p>
          <div className="mt-6">
            <button
              onClick={addEducation}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Education
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {education.map((educationItem, index) => (
            <div key={educationItem.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Education #{index + 1}
                </h4>
                <button
                  onClick={() => removeEducation(educationItem.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3m6 0h-6" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree *
                  </label>
                  <select
                    value={educationItem.degree}
                    onChange={(e) => updateEducationItem(educationItem.id, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select degree</option>
                    {degreeOptions.map(degree => (
                      <option key={degree} value={degree}>{degree}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    value={educationItem.fieldOfStudy}
                    onChange={(e) => updateEducationItem(educationItem.id, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={educationItem.institution}
                    onChange={(e) => updateEducationItem(educationItem.id, 'institution', e.target.value)}
                    placeholder="e.g., Stanford University"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={educationItem.location}
                    onChange={(e) => updateEducationItem(educationItem.id, 'location', e.target.value)}
                    placeholder="e.g., Stanford, CA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={educationItem.startDate}
                    onChange={(e) => updateEducationItem(educationItem.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={educationItem.endDate}
                    onChange={(e) => updateEducationItem(educationItem.id, 'endDate', e.target.value)}
                    disabled={educationItem.isCurrentlyStudying}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={educationItem.isCurrentlyStudying}
                        onChange={(e) => updateEducationItem(educationItem.id, 'isCurrentlyStudying', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-600">Currently studying</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={educationItem.gpa}
                    onChange={(e) => updateEducationItem(educationItem.id, 'gpa', e.target.value)}
                    placeholder="e.g., 3.8/4.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Achievements & Activities
                  </label>
                  <button
                    onClick={() => addAchievement(educationItem.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Achievement
                  </button>
                </div>
                <div className="space-y-2">
                  {educationItem.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex items-center space-x-2">
                      <span className="text-gray-400">•</span>
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(educationItem.id, achievementIndex, e.target.value)}
                        placeholder="e.g., Dean's List, Magna Cum Laude, Student Council President"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {educationItem.achievements.length > 1 && (
                        <button
                          onClick={() => removeAchievement(educationItem.id, achievementIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Tip:</strong> List your education in reverse chronological order. Include relevant coursework, 
              honors, and activities that demonstrate your skills and leadership abilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationForm;