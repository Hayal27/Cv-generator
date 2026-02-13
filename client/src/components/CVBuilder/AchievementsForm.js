import React, { useState } from 'react';

const AchievementsForm = ({ data, updateData }) => {
  const [achievements, setAchievements] = useState(() => {
    const achievementsData = data?.achievements;
    return Array.isArray(achievementsData) ? achievementsData : [];
  });

  const updateAchievements = (newAchievements) => {
    setAchievements(newAchievements);
    updateData('achievements', newAchievements);
  };

  const addAchievement = () => {
    const newAchievement = {
      id: Date.now(),
      title: '',
      description: '',
      date: '',
      category: 'Professional',
      organization: ''
    };
    updateAchievements([...achievements, newAchievement]);
  };

  const removeAchievement = (id) => {
    updateAchievements(achievements.filter(achievement => achievement.id !== id));
  };

  const updateAchievement = (id, field, value) => {
    updateAchievements(achievements.map(achievement => 
      achievement.id === id ? { ...achievement, [field]: value } : achievement
    ));
  };

  const achievementCategories = [
    'Professional',
    'Academic',
    'Awards',
    'Publications',
    'Speaking',
    'Volunteer',
    'Sports',
    'Other'
  ];

  const achievementExamples = [
    {
      category: 'Professional',
      examples: [
        'Employee of the Month',
        'Top Sales Performer',
        'Led successful product launch',
        'Increased team productivity by 30%',
        'Reduced operational costs by $50K'
      ]
    },
    {
      category: 'Academic',
      examples: [
        'Dean\'s List',
        'Magna Cum Laude',
        'Valedictorian',
        'Research Grant Recipient',
        'Academic Scholarship'
      ]
    },
    {
      category: 'Awards',
      examples: [
        'Innovation Award',
        'Excellence in Customer Service',
        'Leadership Award',
        'Community Service Award',
        'Industry Recognition Award'
      ]
    },
    {
      category: 'Publications',
      examples: [
        'Published research paper',
        'Technical blog articles',
        'Industry white paper',
        'Book chapter contribution',
        'Patent application'
      ]
    }
  ];

  const addExampleAchievement = (title, category) => {
    const newAchievement = {
      id: Date.now(),
      title: title,
      description: '',
      date: '',
      category: category,
      organization: ''
    };
    updateAchievements([...achievements, newAchievement]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
          <p className="text-sm text-gray-500">Highlight your notable accomplishments and recognitions</p>
        </div>
        <button
          onClick={addAchievement}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Achievement
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No achievements added</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first achievement.</p>
          <div className="mt-6">
            <button
              onClick={addAchievement}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Achievement
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {achievements.map((achievement, index) => (
            <div key={achievement.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Achievement #{index + 1}
                </h4>
                <button
                  onClick={() => removeAchievement(achievement.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3m6 0h-6" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievement Title *
                    </label>
                    <input
                      type="text"
                      value={achievement.title}
                      onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                      placeholder="e.g., Employee of the Year"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={achievement.category}
                      onChange={(e) => updateAchievement(achievement.id, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {achievementCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization/Institution
                    </label>
                    <input
                      type="text"
                      value={achievement.organization}
                      onChange={(e) => updateAchievement(achievement.id, 'organization', e.target.value)}
                      placeholder="e.g., Google Inc., Stanford University"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="month"
                      value={achievement.date}
                      onChange={(e) => updateAchievement(achievement.id, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={achievement.description}
                    onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                    rows={3}
                    placeholder="Describe the achievement, its significance, and any quantifiable impact..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Examples */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Achievement Ideas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievementExamples.map((categoryGroup, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">{categoryGroup.category}</h5>
              <div className="space-y-2">
                {categoryGroup.examples
                  .filter(example => !achievements.some(a => a.title.toLowerCase() === example.toLowerCase()))
                  .slice(0, 3)
                  .map((example, exampleIndex) => (
                  <div key={exampleIndex} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{example}</span>
                    <button
                      onClick={() => addExampleAchievement(example, categoryGroup.category)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Tip:</strong> Focus on achievements that demonstrate your impact and value. 
              Include quantifiable results when possible (e.g., "Increased sales by 25%" rather than "Good at sales").
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsForm;