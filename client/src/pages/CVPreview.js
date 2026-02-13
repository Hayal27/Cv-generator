import React from 'react';
import { useParams } from 'react-router-dom';

const CVPreview = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            CV Preview
          </h1>
          <p className="text-gray-600 mb-8">
            CV Preview component is under development. This will include:
          </p>
          
          <div className="max-w-2xl mx-auto text-left">
            <ul className="space-y-2 text-gray-700">
              <li>• Full CV preview with selected template</li>
              <li>• Export options (PDF, DOCX)</li>
              <li>• Print functionality</li>
              <li>• Share options</li>
              <li>• Edit button to go back to builder</li>
              <li>• AI enhancement suggestions</li>
              <li>• Job matching analysis</li>
            </ul>
          </div>
          
          <div className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-blue-800 text-sm">
                📄 CV ID: {id}
                <br />
                This will show the formatted CV with the selected template and allow 
                users to export or make final adjustments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;