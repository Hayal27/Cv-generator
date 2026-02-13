import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, FileText, Edit, Trash2, Download, Eye } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async (page = 1) => {
    try {
      const response = await axios.get(`/api/cv/my-cvs?page=${page}&limit=10`);
      setCvs(response.data.cvs);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (cvId) => {
    if (!window.confirm('Are you sure you want to delete this CV?')) {
      return;
    }

    try {
      await axios.delete(`/api/cv/${cvId}`);
      toast.success('CV deleted successfully');
      fetchCVs(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete CV');
    }
  };

  const handleExportCV = async (cvId, format) => {
    try {
      const response = await axios.post(`/api/cv/${cvId}/export/${format}`, {}, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cv.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`CV exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to export CV as ${format.toUpperCase()}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your CVs and create new ones to land your dream job.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total CVs</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.totalItems || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Download className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Views</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            to="/cv/new"
            className="btn-primary inline-flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New CV
          </Link>
          <Link
            to="/templates"
            className="btn-outline inline-flex items-center justify-center"
          >
            <FileText className="h-5 w-5 mr-2" />
            Browse Templates
          </Link>
        </div>

        {/* CVs List */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Your CVs</h2>
          </div>
          <div className="card-content">
            {cvs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No CVs yet</h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first professional CV.
                </p>
                <Link
                  to="/cv/new"
                  className="btn-primary inline-flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First CV
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CV Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cvs.map((cv) => (
                      <tr key={cv.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {cv.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {cv.personalInfo?.firstName} {cv.personalInfo?.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cv.template?.name || 'Default'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(cv.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/cv/preview/${cv.id}`}
                              className="text-primary-600 hover:text-primary-900"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/cv/edit/${cv.id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleExportCV(cv.id, 'pdf')}
                              className="text-green-600 hover:text-green-900"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCV(cv.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchCVs(page)}
                  className={`px-3 py-2 text-sm rounded-md ${
                    page === pagination.currentPage
                      ? 'bg-primary-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;