import React, { useState } from 'react';

const SkillsForm = ({ data, updateData }) => {
  const [skills, setSkills] = useState(() => {
    const skillsData = data?.skills;
    return Array.isArray(skillsData) ? skillsData : [];
  });
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate', category: 'Technical' });

  const updateSkills = (newSkills) => {
    setSkills(newSkills);
    updateData('skills', newSkills);
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skill = {
        id: Date.now(),
        ...newSkill,
        name: newSkill.name.trim()
      };
      updateSkills([...skills, skill]);
      setNewSkill({ name: '', level: 'Intermediate', category: 'Technical' });
    }
  };

  const removeSkill = (id) => {
    updateSkills(skills.filter(skill => skill.id !== id));
  };

  const updateSkill = (id, field, value) => {
    updateSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const skillCategories = ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Frameworks', 'Other'];

  const suggestedSkills = {
    'Technical': [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML/CSS', 
      'Git', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'TypeScript', 'Vue.js'
    ],
    'Soft Skills': [
      'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 
      'Project Management', 'Critical Thinking', 'Adaptability', 'Time Management'
    ],
    'Languages': [
      'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Portuguese'
    ],
    'Tools': [
      'Visual Studio Code', 'IntelliJ IDEA', 'Photoshop', 'Figma', 'Slack', 
      'Jira', 'Trello', 'Microsoft Office', 'Google Workspace'
    ]
  };

  const addSuggestedSkill = (skillName, category) => {
    const skill = {
      id: Date.now(),
      name: skillName,
      level: 'Intermediate',
      category: category
    };
    updateSkills([...skills, skill]);
  };

  const getSkillsByCategory = () => {
    const categorized = {};
    skills.forEach(skill => {
      if (!categorized[skill.category]) {
        categorized[skill.category] = [];
      }
      categorized[skill.category].push(skill);
    });
    return categorized;
  };

  const skillsByCategory = getSkillsByCategory();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
        <p className="text-sm text-gray-500">Add your technical and soft skills</p>
      </div>

      {/* Add New Skill */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">Add New Skill</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Enter skill name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
          </div>
          <div>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {skillCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={addSkill}
              disabled={!newSkill.name.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Skill
            </button>
          </div>
        </div>
      </div>

      {/* Current Skills */}
      {Object.keys(skillsByCategory).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">{category}</h4>
              <div className="space-y-3">
                {categorySkills.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {skillLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                      <select
                        value={skill.category}
                        onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {skillCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="ml-3 text-red-600 hover:text-red-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No skills added yet</h3>
          <p className="mt-1 text-sm text-gray-500">Start by adding your first skill above.</p>
        </div>
      )}

      {/* Suggested Skills */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Suggested Skills</h4>
        {Object.entries(suggestedSkills).map(([category, categorySkills]) => (
          <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">{category}</h5>
            <div className="flex flex-wrap gap-2">
              {categorySkills
                .filter(skillName => !skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase()))
                .map(skillName => (
                <button
                  key={skillName}
                  onClick={() => addSuggestedSkill(skillName, category)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {skillName}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-purple-700">
              <strong>Tip:</strong> Include both technical and soft skills. Be honest about your skill levels - 
              it's better to be accurate than to overstate your abilities. Focus on skills relevant to your target role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;