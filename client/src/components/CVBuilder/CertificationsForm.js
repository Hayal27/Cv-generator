import React, { useState } from 'react';

const CertificationsForm = ({ data, updateData }) => {
  const [certifications, setCertifications] = useState(() => {
    const certsData = data?.certifications;
    return Array.isArray(certsData) ? certsData : [];
  });

  const updateCertifications = (newCertifications) => {
    setCertifications(newCertifications);
    updateData('certifications', newCertifications);
  };

  const addCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      neverExpires: false
    };
    updateCertifications([...certifications, newCertification]);
  };

  const removeCertification = (id) => {
    updateCertifications(certifications.filter(cert => cert.id !== id));
  };

  const updateCertification = (id, field, value) => {
    updateCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const popularCertifications = [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
    { name: 'Google Cloud Professional Cloud Architect', issuer: 'Google Cloud' },
    { name: 'Microsoft Azure Fundamentals', issuer: 'Microsoft' },
    { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Cloud Native Computing Foundation' },
    { name: 'PMP - Project Management Professional', issuer: 'Project Management Institute' },
    { name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance' },
    { name: 'CompTIA Security+', issuer: 'CompTIA' },
    { name: 'Cisco Certified Network Associate (CCNA)', issuer: 'Cisco' },
    { name: 'Certified Information Systems Security Professional (CISSP)', issuer: 'ISC2' },
    { name: 'Google Analytics Individual Qualification', issuer: 'Google' }
  ];

  const addPopularCertification = (certName, issuer) => {
    const newCertification = {
      id: Date.now(),
      name: certName,
      issuer: issuer,
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      neverExpires: false
    };
    updateCertifications([...certifications, newCertification]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
          <p className="text-sm text-gray-500">Add your professional certifications and licenses</p>
        </div>
        <button
          onClick={addCertification}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No certifications added</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first certification.</p>
          <div className="mt-6">
            <button
              onClick={addCertification}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Certification
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {certifications.map((certification, index) => (
            <div key={certification.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Certification #{index + 1}
                </h4>
                <button
                  onClick={() => removeCertification(certification.id)}
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
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      value={certification.name}
                      onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                      placeholder="e.g., AWS Certified Solutions Architect"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      value={certification.issuer}
                      onChange={(e) => updateCertification(certification.id, 'issuer', e.target.value)}
                      placeholder="e.g., Amazon Web Services"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Date *
                    </label>
                    <input
                      type="month"
                      value={certification.issueDate}
                      onChange={(e) => updateCertification(certification.id, 'issueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="month"
                      value={certification.expiryDate}
                      onChange={(e) => updateCertification(certification.id, 'expiryDate', e.target.value)}
                      disabled={certification.neverExpires}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={certification.neverExpires}
                          onChange={(e) => updateCertification(certification.id, 'neverExpires', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-600">Never expires</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      value={certification.credentialId}
                      onChange={(e) => updateCertification(certification.id, 'credentialId', e.target.value)}
                      placeholder="e.g., ABC123456789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credential URL
                    </label>
                    <input
                      type="url"
                      value={certification.credentialUrl}
                      onChange={(e) => updateCertification(certification.id, 'credentialUrl', e.target.value)}
                      placeholder="https://verify.certification.com/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popular Certifications */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Popular Certifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularCertifications
            .filter(cert => !certifications.some(c => c.name.toLowerCase() === cert.name.toLowerCase()))
            .map((cert, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">{cert.name}</h5>
                  <p className="text-xs text-gray-500">{cert.issuer}</p>
                </div>
                <button
                  onClick={() => addPopularCertification(cert.name, cert.issuer)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              <strong>Tip:</strong> Include relevant certifications that demonstrate your expertise. 
              Add credential IDs and verification URLs when available to help employers verify your certifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationsForm;