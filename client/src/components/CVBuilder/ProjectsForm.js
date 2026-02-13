import React, { useState } from 'react';

const ProjectsForm = ({ data, updateData }) => {
  const [projects, setProjects] = useState(() => {
    const projectsData = data?.projects;
    return Array.isArray(projectsData) ? projectsData : [];
  });

  const updateProjects = (newProjects) => {
    setProjects(newProjects);
    updateData('projects', newProjects);
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      isOngoing: false,
      projectUrl: '',
      githubUrl: '',
      highlights: ['']
    };
    updateProjects([...projects, newProject]);
  };

  const removeProject = (id) => {
    updateProjects(projects.filter(project => project.id !== id));
  };

  const updateProject = (id, field, value) => {
    updateProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const addTechnology = (projectId, technology) => {
    if (technology.trim()) {
      updateProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, technologies: [...project.technologies, technology.trim()] }
          : project
      ));
    }
  };

  const removeTechnology = (projectId, techIndex) => {
    updateProjects(projects.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            technologies: project.technologies.filter((_, index) => index !== techIndex)
          }
        : project
    ));
  };

  const addHighlight = (projectId) => {
    updateProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, highlights: [...project.highlights, ''] }
        : project
    ));
  };

  const removeHighlight = (projectId, highlightIndex) => {
    updateProjects(projects.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            highlights: project.highlights.filter((_, index) => index !== highlightIndex)
          }
        : project
    ));
  };

  const updateHighlight = (projectId, highlightIndex, value) => {
    updateProjects(projects.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            highlights: project.highlights.map((highlight, index) => 
              index === highlightIndex ? value : highlight
            )
          }
        : project
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Projects</h3>
          <p className="text-sm text-gray-500">Showcase your personal and professional projects</p>
        </div>
        <button
          onClick={addProject}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects added</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first project.</p>
          <div className="mt-6">
            <button
              onClick={addProject}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Project #{index + 1}
                </h4>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3m6 0h-6" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="e.g., E-commerce Website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    rows={3}
                    placeholder="Brief description of the project, its purpose, and your role..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={project.startDate}
                      onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={project.endDate}
                      onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                      disabled={project.isOngoing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={project.isOngoing}
                          onChange={(e) => updateProject(project.id, 'isOngoing', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-600">Ongoing project</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project URL
                    </label>
                    <input
                      type="url"
                      value={project.projectUrl}
                      onChange={(e) => updateProject(project.id, 'projectUrl', e.target.value)}
                      placeholder="https://yourproject.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={project.githubUrl}
                      onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies Used
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechnology(project.id, techIndex)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Add technology (e.g., React, Node.js)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTechnology(project.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        addTechnology(project.id, input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Key Highlights
                    </label>
                    <button
                      onClick={() => addHighlight(project.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Highlight
                    </button>
                  </div>
                  <div className="space-y-2">
                    {project.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-center space-x-2">
                        <span className="text-gray-400">•</span>
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => updateHighlight(project.id, highlightIndex, e.target.value)}
                          placeholder="e.g., Implemented user authentication system"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {project.highlights.length > 1 && (
                          <button
                            onClick={() => removeHighlight(project.id, highlightIndex)}
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
            </div>
          ))}
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-indigo-700">
              <strong>Tip:</strong> Include both personal and professional projects. Focus on projects that 
              demonstrate skills relevant to your target role. Include links to live demos and source code when possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsForm;