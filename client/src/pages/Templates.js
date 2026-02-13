import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Star, Users } from 'lucide-react';

const Templates = () => {
  const { isAuthenticated } = useAuth();

  // Mock template data - in real app this would come from API
  const templates = [
    {
      id: 1,
      name: 'Professional',
      description: 'Clean and professional design perfect for corporate roles',
      category: 'professional',
      previewImage: '/api/placeholder/300/400',
      usageCount: 1250,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Modern',
      description: 'Contemporary design with subtle colors and modern typography',
      category: 'modern',
      previewImage: '/api/placeholder/300/400',
      usageCount: 980,
      rating: 4.7
    },
    {
      id: 3,
      name: 'Creative',
      description: 'Eye-catching design for creative professionals and designers',
      category: 'creative',
      previewImage: '/api/placeholder/300/400',
      usageCount: 750,
      rating: 4.6
    },
    {
      id: 4,
      name: 'Classic',
      description: 'Traditional layout that works well for any industry',
      category: 'classic',
      previewImage: '/api/placeholder/300/400',
      usageCount: 2100,
      rating: 4.9
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'professional', name: 'Professional', count: 1 },
    { id: 'modern', name: 'Modern', count: 1 },
    { id: 'creative', name: 'Creative', count: 1 },
    { id: 'classic', name: 'Classic', count: 1 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect CV Template
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from our professionally designed templates to create a CV that stands out.
            All templates are ATS-friendly and optimized for modern hiring practices.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {templates.map((template) => (
            <div key={template.id} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{template.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{template.usageCount.toLocaleString()} users</span>
                  </div>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {template.category}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <button className="w-full btn-outline text-sm">
                    Preview
                  </button>
                  {isAuthenticated ? (
                    <Link
                      to={`/cv/new?template=${template.id}`}
                      className="w-full btn-primary text-sm text-center block"
                    >
                      Use This Template
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="w-full btn-primary text-sm text-center block"
                    >
                      Sign Up to Use
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-primary-900 rounded-lg text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Create Your Professional CV?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Choose any template and customize it with your information. 
            Our AI-powered tools will help you create the perfect CV.
          </p>
          {isAuthenticated ? (
            <Link
              to="/cv/new"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Creating
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;