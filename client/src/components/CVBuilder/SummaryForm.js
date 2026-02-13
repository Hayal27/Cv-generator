                import React, { useState } from 'react';

const SummaryForm = ({ data, updateData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (value) => {
    updateData('summary', value);
  };

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          personalInfo: data.personalInfo,
          experience: data.experience,
          skills: data.skills
        })
      });

      if (response.ok) {
        const result = await response.json();
        handleChange(result.summary);
      } else {
        console.error('Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const summaryExamples = [
    "Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-quality solutions that improve user experience and business outcomes.",
    "Results-driven marketing professional with expertise in digital marketing, content strategy, and brand management. Successfully increased brand awareness by 40% and generated $2M+ in revenue through innovative campaigns and data-driven strategies.",
    "Dedicated healthcare professional with 8+ years of experience in patient care and clinical operations. Skilled in electronic health records, patient education, and interdisciplinary collaboration to ensure optimal patient outcomes."
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <button
            onClick={generateSummary}
            disabled={isGenerating}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Generate
              </>
            )}
          </button>
        </div>
        <textarea
          value={data.summary}
          onChange={(e) => handleChange(e.target.value)}
          rows={6}
          placeholder="Write a compelling professional summary that highlights your key strengths, experience, and career objectives..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-sm text-gray-500 mt-2">
          {data.summary.length}/500 characters • 2-3 sentences recommended
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Writing Tips</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Start with your years of experience and key expertise
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Highlight your most relevant skills and achievements
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Include quantifiable results when possible
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Keep it concise and focused on value you bring
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Example Summaries</h3>
        <div className="space-y-3">
          {summaryExamples.map((example, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">{example}</p>
              <button
                onClick={() => handleChange(example)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Use this example
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Pro Tip:</strong> Your professional summary is often the first thing recruiters read. 
              Make it count by clearly stating what makes you unique and valuable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;