import React, { useState } from 'react';

const ExperienceForm = ({ data, updateData }) => {
  const [experiences, setExperiences] = useState(() => {
    // Ensure we always have an array
    const exp = data?.experience;
    return Array.isArray(exp) ? exp : [];
  });

  const updateExperiences = (newExperiences) => {
    setExperiences(newExperiences);
    updateData('experience', newExperiences);
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: '',
      achievements: ['']
    };
    updateExperiences([...experiences, newExperience]);
  };

  const removeExperience = (id) => {
    updateExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id, field, value) => {
    updateExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addAchievement = (expId) => {
    updateExperiences(experiences.map(exp => 
      exp.id === expId 
        ? { ...exp, achievements: [...(Array.isArray(exp.achievements) ? exp.achievements : ['']), ''] }
        : exp
    ));
  };

  const removeAchievement = (expId, achievementIndex) => {
    updateExperiences(experiences.map(exp => 
      exp.id === expId 
        ? { 
            ...exp, 
            achievements: Array.isArray(exp.achievements) 
              ? exp.achievements.filter((_, index) => index !== achievementIndex)
              : ['']
          }
        : exp
    ));
  };

  const updateAchievement = (expId, achievementIndex, value) => {
    updateExperiences(experiences.map(exp => 
      exp.id === expId 
        ? { 
            ...exp, 
            achievements: Array.isArray(exp.achievements)
              ? exp.achievements.map((achievement, index) => 
                  index === achievementIndex ? value : achievement
                )
              : [value]
          }
        : exp
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
          <p className="text-sm text-gray-500">Add your professional work experience</p>
        </div>
        <button
          onClick={addExperience}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No work experience added</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first work experience.</p>
          <div className="mt-6">
            <button
              onClick={addExperience}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Experience
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <div key={experience.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Experience #{index + 1}
                </h4>
                <button
                  onClick={() => removeExperience(experience.id)}
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
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={experience.jobTitle}
                    onChange={(e) => updateExperience(experience.id, 'jobTitle', e.target.value)}
                    placeholder="e.g., Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="e.g., Google Inc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={experience.location}
                  onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
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
                    value={experience.endDate}
                    onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                    disabled={experience.isCurrentJob}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={experience.isCurrentJob}
                        onChange={(e) => updateExperience(experience.id, 'isCurrentJob', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-600">I currently work here</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                  rows={3}
                  placeholder="Brief description of your role and responsibilities..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Key Achievements
                  </label>
                  <button
                    onClick={() => addAchievement(experience.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Achievement
                  </button>
                </div>
                <div className="space-y-2">
                  {(Array.isArray(experience.achievements) ? experience.achievements : ['']).map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex items-center space-x-2">
                      <span className="text-gray-400">•</span>
                      <input
                        type="text"
                        value={achievement || ''}
                        onChange={(e) => updateAchievement(experience.id, achievementIndex, e.target.value)}
                        placeholder="e.g., Increased team productivity by 25%"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {(Array.isArray(experience.achievements) ? experience.achievements : ['']).length > 1 && (
                        <button
                          onClick={() => removeAchievement(experience.id, achievementIndex)}
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> List your experiences in reverse chronological order (most recent first). 
              Focus on achievements and quantifiable results rather than just job duties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;