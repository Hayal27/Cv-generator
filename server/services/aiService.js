const axios = require('axios');

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const API_KEY = process.env.HUGGINGFACE_API_KEY;

// Common skills database for different job roles
const SKILL_DATABASE = {
  'software engineer': ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker'],
  'data scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Jupyter', 'Statistics'],
  'product manager': ['Agile', 'Scrum', 'Analytics', 'User Research', 'Roadmapping', 'Stakeholder Management'],
  'designer': ['Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'User Experience', 'Visual Design'],
  'marketing': ['Google Analytics', 'SEO', 'Content Marketing', 'Social Media', 'Email Marketing', 'A/B Testing']
};

// Helper function to make Hugging Face API calls
const callHuggingFaceAPI = async (modelName, payload, retries = 3) => {
  const url = `${HUGGINGFACE_API_URL}/${modelName}`;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 503 && i < retries - 1) {
        // Model is loading, wait and retry
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};

// Enhance text using Flan-T5 model
const enhanceText = async (text, type = 'general') => {
  try {
    if (!API_KEY) {
      // Fallback enhancement without API
      return enhanceTextFallback(text, type);
    }

    const prompts = {
      summary: `Rewrite this professional summary to be more compelling and impactful: "${text}"`,
      experience: `Improve this work experience description to highlight achievements and impact: "${text}"`,
      achievement: `Rewrite this achievement to be more quantifiable and impressive: "${text}"`,
      general: `Improve this text to be more professional and engaging: "${text}"`
    };

    const prompt = prompts[type] || prompts.general;
    
    const result = await callHuggingFaceAPI('google/flan-t5-large', {
      inputs: prompt,
      parameters: {
        max_length: 200,
        temperature: 0.7,
        do_sample: true
      }
    });

    return result[0]?.generated_text || enhanceTextFallback(text, type);
  } catch (error) {
    console.error('AI text enhancement error:', error);
    return enhanceTextFallback(text, type);
  }
};

// Fallback text enhancement without API
const enhanceTextFallback = (text, type) => {
  const enhancements = {
    summary: (text) => text.replace(/\b(I am|I have|I can)\b/g, match => 
      match.replace('I am', 'Experienced').replace('I have', 'Possessing').replace('I can', 'Capable of')
    ),
    experience: (text) => text.replace(/\b(did|made|worked on)\b/g, match =>
      match.replace('did', 'executed').replace('made', 'developed').replace('worked on', 'collaborated on')
    ),
    achievement: (text) => text.replace(/\b(good|great|nice)\b/g, 'exceptional'),
    general: (text) => text.replace(/\b(very|really|quite)\b/g, '').trim()
  };

  return enhancements[type] ? enhancements[type](text) : text;
};

// Suggest skills based on job title
const suggestSkills = async (jobTitle, currentSkills = [], industry = '') => {
  try {
    const jobTitleLower = jobTitle.toLowerCase();
    
    // Find matching skills from database
    let suggestedSkills = [];
    
    for (const [role, skills] of Object.entries(SKILL_DATABASE)) {
      if (jobTitleLower.includes(role) || role.includes(jobTitleLower)) {
        suggestedSkills = [...suggestedSkills, ...skills];
      }
    }

    // Remove duplicates and current skills
    suggestedSkills = [...new Set(suggestedSkills)]
      .filter(skill => !currentSkills.some(current => 
        current.toLowerCase() === skill.toLowerCase()
      ));

    // If we have API access, enhance suggestions
    if (API_KEY) {
      try {
        const prompt = `Suggest 10 relevant skills for a ${jobTitle} position in ${industry || 'technology'} industry:`;
        
        const result = await callHuggingFaceAPI('microsoft/DialoGPT-medium', {
          inputs: prompt,
          parameters: {
            max_length: 100,
            temperature: 0.8
          }
        });

        // Parse AI suggestions and merge with database suggestions
        if (result[0]?.generated_text) {
          const aiSuggestions = result[0].generated_text
            .split(/[,\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && s.length < 30);
          
          suggestedSkills = [...new Set([...suggestedSkills, ...aiSuggestions])];
        }
      } catch (aiError) {
        console.error('AI skill suggestion error:', aiError);
      }
    }

    return suggestedSkills.slice(0, 15); // Return top 15 suggestions
  } catch (error) {
    console.error('Skill suggestion error:', error);
    return SKILL_DATABASE[jobTitle.toLowerCase()] || [];
  }
};

// Calculate job match score using sentence similarity
const calculateJobMatch = async (cvText, jobDescription) => {
  try {
    if (!API_KEY) {
      return calculateJobMatchFallback(cvText, jobDescription);
    }

    // Use sentence-transformers for semantic similarity
    const result = await callHuggingFaceAPI('sentence-transformers/all-MiniLM-L6-v2', {
      inputs: {
        source_sentence: cvText,
        sentences: [jobDescription]
      }
    });

    const score = result[0] || 0;
    const matchedKeywords = extractMatchedKeywords(cvText, jobDescription);
    const missingKeywords = extractMissingKeywords(cvText, jobDescription);

    return {
      score: Math.round(score * 100),
      matchedKeywords,
      missingKeywords,
      recommendations: generateRecommendations(score, missingKeywords)
    };
  } catch (error) {
    console.error('Job match calculation error:', error);
    return calculateJobMatchFallback(cvText, jobDescription);
  }
};

// Fallback job match calculation
const calculateJobMatchFallback = (cvText, jobDescription) => {
  const cvWords = new Set(cvText.toLowerCase().split(/\W+/));
  const jobWords = new Set(jobDescription.toLowerCase().split(/\W+/));
  
  const intersection = new Set([...cvWords].filter(x => jobWords.has(x)));
  const union = new Set([...cvWords, ...jobWords]);
  
  const score = Math.round((intersection.size / union.size) * 100);
  
  return {
    score,
    matchedKeywords: Array.from(intersection).slice(0, 10),
    missingKeywords: Array.from(jobWords).filter(word => 
      !cvWords.has(word) && word.length > 3
    ).slice(0, 10),
    recommendations: generateRecommendations(score / 100, [])
  };
};

// Extract matched keywords between CV and job description
const extractMatchedKeywords = (cvText, jobDescription) => {
  const cvWords = new Set(cvText.toLowerCase().split(/\W+/));
  const jobWords = jobDescription.toLowerCase().split(/\W+/);
  
  return jobWords
    .filter(word => word.length > 3 && cvWords.has(word))
    .slice(0, 15);
};

// Extract missing keywords from job description
const extractMissingKeywords = (cvText, jobDescription) => {
  const cvWords = new Set(cvText.toLowerCase().split(/\W+/));
  const jobWords = jobDescription.toLowerCase().split(/\W+/);
  
  return jobWords
    .filter(word => word.length > 3 && !cvWords.has(word))
    .slice(0, 15);
};

// Generate recommendations based on match score
const generateRecommendations = (score, missingKeywords) => {
  const recommendations = [];
  
  if (score < 0.3) {
    recommendations.push('Consider tailoring your CV more closely to this job description');
    recommendations.push('Add more relevant keywords and skills');
  } else if (score < 0.6) {
    recommendations.push('Good match! Consider adding a few more relevant details');
  } else {
    recommendations.push('Excellent match for this position!');
  }
  
  if (missingKeywords.length > 0) {
    recommendations.push(`Consider adding these keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  
  return recommendations;
};

// Improve grammar using AI
const improveGrammar = async (text) => {
  try {
    if (!API_KEY) {
      return { improvedText: text, corrections: [] };
    }

    const result = await callHuggingFaceAPI('grammarly/coedit-large', {
      inputs: `Fix grammar: ${text}`,
      parameters: {
        max_length: text.length + 50,
        temperature: 0.3
      }
    });

    const improvedText = result[0]?.generated_text || text;
    
    return {
      improvedText,
      corrections: findCorrections(text, improvedText)
    };
  } catch (error) {
    console.error('Grammar improvement error:', error);
    return { improvedText: text, corrections: [] };
  }
};

// Find differences between original and improved text
const findCorrections = (original, improved) => {
  const corrections = [];
  const originalWords = original.split(' ');
  const improvedWords = improved.split(' ');
  
  for (let i = 0; i < Math.max(originalWords.length, improvedWords.length); i++) {
    if (originalWords[i] !== improvedWords[i]) {
      corrections.push({
        original: originalWords[i] || '',
        corrected: improvedWords[i] || '',
        position: i
      });
    }
  }
  
  return corrections.slice(0, 10); // Return first 10 corrections
};

module.exports = {
  enhanceText,
  suggestSkills,
  calculateJobMatch,
  improveGrammar
};