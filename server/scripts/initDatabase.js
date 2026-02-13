const { sequelize } = require('../config/database');
const { Template } = require('../models');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL database');
    
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');
    
    // Check if templates exist
    const templateCount = await Template.count();
    
    if (templateCount === 0) {
      console.log('📝 Creating new professional templates...');
    } else {
      console.log('✅ Templates already exist in database');
      console.log('🎉 Database initialization completed successfully');
      return;
    }
      
      // Create default templates
      const defaultTemplates = [
        {
          name: 'Classic Professional',
          description: 'A timeless, clean design perfect for traditional industries and corporate roles',
          category: 'professional',
          htmlTemplate: `
            <div class="cv-container">
              <header class="cv-header">
                {{#if personalInfo.profileImage}}
                <div class="profile-section">
                  <img src="{{personalInfo.profileImage}}" alt="Profile" class="profile-image">
                  <div class="header-content">
                    <h1 class="name">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
                    <div class="contact-info">
                      <div class="contact-item">📧 {{personalInfo.email}}</div>
                      <div class="contact-item">📱 {{personalInfo.phone}}</div>
                      <div class="contact-item">📍 {{personalInfo.city}}, {{personalInfo.country}}</div>
                      {{#if personalInfo.linkedIn}}<div class="contact-item">🔗 LinkedIn</div>{{/if}}
                    </div>
                  </div>
                </div>
                {{else}}
                <div class="header-content-center">
                  <h1 class="name">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
                  <div class="contact-info">
                    <div class="contact-item">{{personalInfo.email}}</div>
                    <div class="contact-item">{{personalInfo.phone}}</div>
                    <div class="contact-item">{{personalInfo.city}}, {{personalInfo.country}}</div>
                    {{#if personalInfo.linkedIn}}<div class="contact-item">LinkedIn Profile</div>{{/if}}
                  </div>
                </div>
                {{/if}}
              </header>
              
              {{#if summary}}
              <section class="cv-section">
                <h2>Professional Summary</h2>
                <p class="summary-text">{{summary}}</p>
              </section>
              {{/if}}
              
              {{#if experience.length}}
              <section class="cv-section">
                <h2>Professional Experience</h2>
                {{#each experience}}
                <div class="experience-item">
                  <div class="job-header">
                    <h3>{{jobTitle}}</h3>
                    <span class="company">{{company}}</span>
                  </div>
                  <div class="job-meta">
                    <span class="date">{{startDate}} - {{#if isCurrentJob}}Present{{else}}{{endDate}}{{/if}}</span>
                    {{#if location}}<span class="location">{{location}}</span>{{/if}}
                  </div>
                  {{#if description}}<p class="description">{{description}}</p>{{/if}}
                  {{#if achievements.length}}
                  <ul class="achievements">
                    {{#each achievements}}
                    <li>{{this}}</li>
                    {{/each}}
                  </ul>
                  {{/if}}
                </div>
                {{/each}}
              </section>
              {{/if}}
              
              {{#if education.length}}
              <section class="cv-section">
                <h2>Education</h2>
                {{#each education}}
                <div class="education-item">
                  <div class="edu-header">
                    <h3>{{degree}} in {{fieldOfStudy}}</h3>
                    <span class="date">{{startDate}} - {{#if isCurrentlyStudying}}Present{{else}}{{endDate}}{{/if}}</span>
                  </div>
                  <div class="institution">{{institution}}{{#if location}}, {{location}}{{/if}}</div>
                  {{#if gpa}}<div class="gpa">GPA: {{gpa}}</div>{{/if}}
                </div>
                {{/each}}
              </section>
              {{/if}}
              
              {{#if skills.length}}
              <section class="cv-section">
                <h2>Core Competencies</h2>
                <div class="skills-container">
                  {{#each skills}}
                  <div class="skill-category">
                    <h4>{{category}}</h4>
                    <div class="skill-item">
                      <span class="skill-name">{{name}}</span>
                      <div class="skill-level-bar">
                        <div class="skill-progress {{level}}"></div>
                      </div>
                    </div>
                  </div>
                  {{/each}}
                </div>
              </section>
              {{/if}}
              
              {{#if projects.length}}
              <section class="cv-section">
                <h2>Key Projects</h2>
                {{#each projects}}
                <div class="project-item">
                  <h3>{{name}}</h3>
                  <p class="description">{{description}}</p>
                  {{#if technologies.length}}
                  <div class="technologies">
                    <strong>Technologies:</strong> {{#each technologies}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
                  </div>
                  {{/if}}
                </div>
                {{/each}}
              </section>
              {{/if}}
            </div>
          `,
          cssStyles: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            .cv-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 25mm;
              font-family: 'Georgia', 'Times New Roman', serif;
              line-height: 1.6;
              color: #2c3e50;
              background: white;
            }
            
            .cv-header {
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #34495e;
            }
            
            .profile-section {
              display: flex;
              align-items: center;
              gap: 20px;
            }
            
            .profile-image {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              object-fit: cover;
              border: 3px solid #34495e;
            }
            
            .header-content-center {
              text-align: center;
            }
            
            .name {
              font-size: 2.2em;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 10px;
              letter-spacing: 1px;
            }
            
            .contact-info {
              display: flex;
              gap: 15px;
              flex-wrap: wrap;
              justify-content: center;
            }
            
            .profile-section .contact-info {
              justify-content: flex-start;
              flex-direction: column;
              gap: 5px;
            }
            
            .contact-item {
              color: #7f8c8d;
              font-size: 0.9em;
              font-weight: 500;
            }
            
            .cv-section {
              margin-bottom: 25px;
            }
            
            .cv-section h2 {
              color: #2c3e50;
              font-size: 1.3em;
              font-weight: bold;
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 1px solid #bdc3c7;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .summary-text {
              text-align: justify;
              font-style: italic;
              color: #34495e;
              font-size: 1.05em;
            }
            
            .experience-item, .education-item, .project-item {
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px dotted #ecf0f1;
            }
            
            .experience-item:last-child, .education-item:last-child, .project-item:last-child {
              border-bottom: none;
            }
            
            .job-header, .edu-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 5px;
            }
            
            .job-header h3, .edu-header h3, .project-item h3 {
              color: #2c3e50;
              font-size: 1.1em;
              font-weight: bold;
            }
            
            .company {
              color: #e74c3c;
              font-weight: 600;
              font-style: italic;
            }
            
            .job-meta {
              display: flex;
              gap: 15px;
              margin-bottom: 10px;
              color: #7f8c8d;
              font-size: 0.9em;
            }
            
            .date {
              font-weight: 600;
            }
            
            .institution {
              color: #3498db;
              font-weight: 600;
              margin-bottom: 5px;
            }
            
            .description {
              margin-bottom: 10px;
              text-align: justify;
              color: #34495e;
            }
            
            .achievements {
              list-style: none;
              padding-left: 0;
            }
            
            .achievements li {
              position: relative;
              padding-left: 20px;
              margin-bottom: 5px;
              color: #34495e;
            }
            
            .achievements li:before {
              content: "▸";
              position: absolute;
              left: 0;
              color: #e74c3c;
              font-weight: bold;
            }
            
            .skills-container {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 15px;
            }
            
            .skill-category h4 {
              color: #2c3e50;
              margin-bottom: 8px;
              font-size: 1em;
              font-weight: 600;
            }
            
            .skill-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
            }
            
            .skill-name {
              font-weight: 500;
              color: #34495e;
            }
            
            .skill-level-bar {
              width: 100px;
              height: 6px;
              background: #ecf0f1;
              border-radius: 3px;
              overflow: hidden;
            }
            
            .skill-progress {
              height: 100%;
              background: linear-gradient(90deg, #3498db, #2980b9);
              border-radius: 3px;
            }
            
            .skill-progress.Beginner { width: 25%; }
            .skill-progress.Intermediate { width: 50%; }
            .skill-progress.Advanced { width: 75%; }
            .skill-progress.Expert { width: 100%; }
            
            .technologies {
              margin-top: 8px;
              font-size: 0.9em;
              color: #7f8c8d;
              font-style: italic;
            }
            
            .gpa {
              color: #27ae60;
              font-weight: 600;
              font-size: 0.9em;
            }
            
            @media print {
              .cv-container {
                padding: 15mm;
                box-shadow: none;
              }
              
              .cv-section {
                break-inside: avoid;
              }
            }
          `,
          isActive: true
        },
        {
          name: 'Modern',
          description: 'A modern and stylish CV template with contemporary design',
          category: 'modern',
          htmlTemplate: `
            <div class="cv-container modern">
              <div class="sidebar">
                <div class="profile-section">
                  <h1 class="name">{{firstName}}<br>{{lastName}}</h1>
                  <div class="contact-info">
                    <div class="contact-item">📧 {{email}}</div>
                    <div class="contact-item">📱 {{phone}}</div>
                    <div class="contact-item">📍 {{city}}, {{country}}</div>
                  </div>
                </div>
                
                {{#if skills.length}}
                <div class="sidebar-section">
                  <h2>Skills</h2>
                  {{#each skills}}
                  <div class="skill-item">
                    <div class="skill-name">{{name}}</div>
                    <div class="skill-level-bar">
                      <div class="skill-progress {{level}}"></div>
                    </div>
                  </div>
                  {{/each}}
                </div>
                {{/if}}
              </div>
              
              <div class="main-content">
                {{#if summary}}
                <section class="section">
                  <h2>About Me</h2>
                  <p>{{summary}}</p>
                </section>
                {{/if}}
                
                {{#if experience.length}}
                <section class="section">
                  <h2>Experience</h2>
                  {{#each experience}}
                  <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                      <h3>{{jobTitle}}</h3>
                      <h4>{{company}}</h4>
                      <div class="date">{{startDate}} - {{#if isCurrentJob}}Present{{else}}{{endDate}}{{/if}}</div>
                      <p>{{description}}</p>
                    </div>
                  </div>
                  {{/each}}
                </section>
                {{/if}}
                
                {{#if education.length}}
                <section class="section">
                  <h2>Education</h2>
                  {{#each education}}
                  <div class="education-item">
                    <h3>{{degree}} in {{fieldOfStudy}}</h3>
                    <div class="institution">{{institution}}</div>
                    <div class="date">{{startDate}} - {{#if isCurrentlyStudying}}Present{{else}}{{endDate}}{{/if}}</div>
                  </div>
                  {{/each}}
                </section>
                {{/if}}
              </div>
            </div>
          `,
          cssStyles: `
            .cv-container.modern {
              display: flex;
              max-width: 1000px;
              margin: 0 auto;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              min-height: 100vh;
            }
            
            .sidebar {
              width: 300px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 30px;
            }
            
            .profile-section {
              text-align: center;
              margin-bottom: 40px;
            }
            
            .name {
              font-size: 2em;
              margin: 0 0 20px 0;
              font-weight: 300;
              line-height: 1.2;
            }
            
            .contact-info {
              text-align: left;
            }
            
            .contact-item {
              margin-bottom: 10px;
              font-size: 0.9em;
            }
            
            .sidebar-section {
              margin-bottom: 30px;
            }
            
            .sidebar-section h2 {
              font-size: 1.2em;
              margin-bottom: 20px;
              font-weight: 500;
            }
            
            .skill-item {
              margin-bottom: 15px;
            }
            
            .skill-name {
              font-size: 0.9em;
              margin-bottom: 5px;
            }
            
            .skill-level-bar {
              height: 4px;
              background: rgba(255,255,255,0.3);
              border-radius: 2px;
              overflow: hidden;
            }
            
            .skill-progress {
              height: 100%;
              background: white;
              border-radius: 2px;
            }
            
            .skill-progress.Beginner { width: 25%; }
            .skill-progress.Intermediate { width: 50%; }
            .skill-progress.Advanced { width: 75%; }
            .skill-progress.Expert { width: 100%; }
            
            .main-content {
              flex: 1;
              padding: 40px;
              background: white;
            }
            
            .section {
              margin-bottom: 40px;
            }
            
            .section h2 {
              color: #333;
              font-size: 1.5em;
              margin-bottom: 25px;
              position: relative;
              padding-bottom: 10px;
            }
            
            .section h2:after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 50px;
              height: 3px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            
            .timeline-item {
              position: relative;
              padding-left: 30px;
              margin-bottom: 30px;
            }
            
            .timeline-marker {
              position: absolute;
              left: 0;
              top: 5px;
              width: 12px;
              height: 12px;
              background: #667eea;
              border-radius: 50%;
            }
            
            .timeline-marker:before {
              content: '';
              position: absolute;
              left: 5px;
              top: 12px;
              width: 2px;
              height: 60px;
              background: #e0e0e0;
            }
            
            .timeline-content h3 {
              color: #333;
              margin: 0 0 5px 0;
              font-size: 1.1em;
            }
            
            .timeline-content h4 {
              color: #667eea;
              margin: 0 0 5px 0;
              font-weight: 500;
            }
            
            .date {
              color: #666;
              font-size: 0.9em;
              margin-bottom: 10px;
            }
            
            .education-item {
              margin-bottom: 25px;
            }
            
            .education-item h3 {
              color: #333;
              margin: 0 0 5px 0;
            }
            
            .institution {
              color: #667eea;
              font-weight: 500;
              margin-bottom: 5px;
            }
          `,
          isActive: true
        },
        {
          name: 'Executive',
          description: 'A sophisticated template designed for senior executives and C-level positions',
          category: 'professional',
          htmlTemplate: `
            <div class="cv-container executive">
              <div class="header-section">
                <div class="header-left">
                  {{#if personalInfo.profileImage}}
                  <img src="{{personalInfo.profileImage}}" alt="Profile" class="executive-photo">
                  {{/if}}
                  <div class="name-section">
                    <h1 class="executive-name">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
                    <p class="executive-title">Senior Executive</p>
                  </div>
                </div>
                <div class="header-right">
                  <div class="contact-grid">
                    <div class="contact-item">
                      <span class="contact-label">Email</span>
                      <span class="contact-value">{{personalInfo.email}}</span>
                    </div>
                    <div class="contact-item">
                      <span class="contact-label">Phone</span>
                      <span class="contact-value">{{personalInfo.phone}}</span>
                    </div>
                    <div class="contact-item">
                      <span class="contact-label">Location</span>
                      <span class="contact-value">{{personalInfo.city}}, {{personalInfo.country}}</span>
                    </div>
                    {{#if personalInfo.linkedIn}}
                    <div class="contact-item">
                      <span class="contact-label">LinkedIn</span>
                      <span class="contact-value">Available</span>
                    </div>
                    {{/if}}
                  </div>
                </div>
              </div>
              
              {{#if summary}}
              <section class="executive-section">
                <h2 class="section-title">Executive Summary</h2>
                <div class="section-content">
                  <p class="executive-summary">{{summary}}</p>
                </div>
              </section>
              {{/if}}
              
              {{#if experience.length}}
              <section class="executive-section">
                <h2 class="section-title">Professional Experience</h2>
                <div class="section-content">
                  {{#each experience}}
                  <div class="experience-block">
                    <div class="experience-header">
                      <div class="position-company">
                        <h3 class="position">{{jobTitle}}</h3>
                        <h4 class="company">{{company}}</h4>
                      </div>
                      <div class="tenure">
                        <span class="dates">{{startDate}} - {{#if isCurrentJob}}Present{{else}}{{endDate}}{{/if}}</span>
                        {{#if location}}<span class="location">{{location}}</span>{{/if}}
                      </div>
                    </div>
                    {{#if description}}<p class="role-description">{{description}}</p>{{/if}}
                    {{#if achievements.length}}
                    <div class="achievements-section">
                      <h5>Key Achievements:</h5>
                      <ul class="achievement-list">
                        {{#each achievements}}
                        <li>{{this}}</li>
                        {{/each}}
                      </ul>
                    </div>
                    {{/if}}
                  </div>
                  {{/each}}
                </div>
              </section>
              {{/if}}
              
              <div class="two-column-section">
                {{#if education.length}}
                <section class="column-section">
                  <h2 class="section-title">Education</h2>
                  <div class="section-content">
                    {{#each education}}
                    <div class="education-block">
                      <h3 class="degree">{{degree}}</h3>
                      <p class="field">{{fieldOfStudy}}</p>
                      <p class="institution">{{institution}}</p>
                      <p class="edu-dates">{{startDate}} - {{#if isCurrentlyStudying}}Present{{else}}{{endDate}}{{/if}}</p>
                    </div>
                    {{/each}}
                  </div>
                </section>
                {{/if}}
                
                {{#if skills.length}}
                <section class="column-section">
                  <h2 class="section-title">Core Competencies</h2>
                  <div class="section-content">
                    <div class="skills-executive">
                      {{#each skills}}
                      <div class="skill-group">
                        <h4 class="skill-category">{{category}}</h4>
                        <span class="skill-name">{{name}}</span>
                      </div>
                      {{/each}}
                    </div>
                  </div>
                </section>
                {{/if}}
              </div>
            </div>
          `,
          cssStyles: `
            .cv-container.executive {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.5;
              color: #2c3e50;
              background: white;
            }
            
            .header-section {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 25px;
              border-bottom: 3px solid #1a365d;
            }
            
            .header-left {
              display: flex;
              align-items: center;
              gap: 20px;
            }
            
            .executive-photo {
              width: 80px;
              height: 80px;
              border-radius: 8px;
              object-fit: cover;
              border: 2px solid #1a365d;
            }
            
            .executive-name {
              font-size: 2.5em;
              font-weight: 300;
              color: #1a365d;
              margin: 0;
              letter-spacing: -1px;
            }
            
            .executive-title {
              font-size: 1.1em;
              color: #718096;
              margin: 5px 0 0 0;
              font-weight: 500;
            }
            
            .contact-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              min-width: 300px;
            }
            
            .contact-item {
              display: flex;
              flex-direction: column;
            }
            
            .contact-label {
              font-size: 0.8em;
              color: #718096;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 600;
            }
            
            .contact-value {
              font-size: 0.95em;
              color: #2d3748;
              font-weight: 500;
            }
            
            .executive-section {
              margin-bottom: 35px;
            }
            
            .section-title {
              font-size: 1.4em;
              color: #1a365d;
              font-weight: 600;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 1px;
              position: relative;
            }
            
            .section-title:after {
              content: '';
              position: absolute;
              bottom: -5px;
              left: 0;
              width: 60px;
              height: 2px;
              background: #3182ce;
            }
            
            .executive-summary {
              font-size: 1.1em;
              line-height: 1.7;
              color: #4a5568;
              text-align: justify;
              font-style: italic;
            }
            
            .experience-block {
              margin-bottom: 30px;
              padding-bottom: 25px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .experience-block:last-child {
              border-bottom: none;
            }
            
            .experience-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 15px;
            }
            
            .position {
              font-size: 1.3em;
              color: #1a365d;
              font-weight: 600;
              margin: 0 0 5px 0;
            }
            
            .company {
              font-size: 1.1em;
              color: #3182ce;
              font-weight: 500;
              margin: 0;
            }
            
            .tenure {
              text-align: right;
              color: #718096;
            }
            
            .dates {
              display: block;
              font-weight: 600;
              font-size: 0.95em;
            }
            
            .location {
              display: block;
              font-size: 0.9em;
              margin-top: 2px;
            }
            
            .role-description {
              color: #4a5568;
              margin-bottom: 15px;
              text-align: justify;
            }
            
            .achievements-section h5 {
              color: #2d3748;
              font-size: 1em;
              margin-bottom: 10px;
              font-weight: 600;
            }
            
            .achievement-list {
              list-style: none;
              padding: 0;
            }
            
            .achievement-list li {
              position: relative;
              padding-left: 20px;
              margin-bottom: 8px;
              color: #4a5568;
            }
            
            .achievement-list li:before {
              content: "●";
              position: absolute;
              left: 0;
              color: #3182ce;
              font-weight: bold;
            }
            
            .two-column-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
            }
            
            .column-section .section-content {
              padding-right: 20px;
            }
            
            .education-block {
              margin-bottom: 20px;
            }
            
            .degree {
              font-size: 1.1em;
              color: #1a365d;
              font-weight: 600;
              margin: 0 0 5px 0;
            }
            
            .field {
              color: #3182ce;
              font-weight: 500;
              margin: 0 0 5px 0;
            }
            
            .institution {
              color: #4a5568;
              margin: 0 0 5px 0;
            }
            
            .edu-dates {
              color: #718096;
              font-size: 0.9em;
              margin: 0;
            }
            
            .skills-executive {
              display: grid;
              grid-template-columns: 1fr;
              gap: 15px;
            }
            
            .skill-group {
              padding: 12px;
              background: #f7fafc;
              border-left: 4px solid #3182ce;
            }
            
            .skill-category {
              font-size: 0.9em;
              color: #1a365d;
              font-weight: 600;
              margin: 0 0 5px 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .skill-name {
              color: #4a5568;
              font-weight: 500;
            }
            
            @media print {
              .cv-container.executive {
                padding: 15mm;
              }
            }
          `,
          isActive: true
        },
        {
          name: 'Creative Designer',
          description: 'A vibrant and creative template perfect for designers, artists, and creative professionals',
          category: 'creative',
          htmlTemplate: `
            <div class="cv-container creative">
              <div class="creative-header">
                <div class="header-background"></div>
                <div class="header-content">
                  {{#if personalInfo.profileImage}}
                  <div class="profile-circle">
                    <img src="{{personalInfo.profileImage}}" alt="Profile" class="creative-photo">
                  </div>
                  {{/if}}
                  <h1 class="creative-name">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
                  <p class="creative-tagline">Creative Professional</p>
                  <div class="contact-creative">
                    <span>{{personalInfo.email}}</span>
                    <span>{{personalInfo.phone}}</span>
                    <span>{{personalInfo.city}}, {{personalInfo.country}}</span>
                  </div>
                </div>
              </div>
              
              <div class="creative-body">
                {{#if summary}}
                <section class="creative-section">
                  <div class="section-header">
                    <h2>About Me</h2>
                    <div class="section-line"></div>
                  </div>
                  <p class="creative-summary">{{summary}}</p>
                </section>
                {{/if}}
                
                {{#if experience.length}}
                <section class="creative-section">
                  <div class="section-header">
                    <h2>Experience</h2>
                    <div class="section-line"></div>
                  </div>
                  <div class="experience-creative">
                    {{#each experience}}
                    <div class="exp-card">
                      <div class="exp-header">
                        <h3>{{jobTitle}}</h3>
                        <span class="exp-period">{{startDate}} - {{#if isCurrentJob}}Now{{else}}{{endDate}}{{/if}}</span>
                      </div>
                      <h4 class="exp-company">{{company}}</h4>
                      {{#if description}}<p class="exp-desc">{{description}}</p>{{/if}}
                    </div>
                    {{/each}}
                  </div>
                </section>
                {{/if}}
                
                <div class="creative-grid">
                  {{#if skills.length}}
                  <section class="creative-section">
                    <div class="section-header">
                      <h2>Skills</h2>
                      <div class="section-line"></div>
                    </div>
                    <div class="skills-creative">
                      {{#each skills}}
                      <div class="skill-bubble">
                        <span class="skill-text">{{name}}</span>
                        <div class="skill-level-creative {{level}}"></div>
                      </div>
                      {{/each}}
                    </div>
                  </section>
                  {{/if}}
                  
                  {{#if education.length}}
                  <section class="creative-section">
                    <div class="section-header">
                      <h2>Education</h2>
                      <div class="section-line"></div>
                    </div>
                    {{#each education}}
                    <div class="edu-creative">
                      <h3>{{degree}}</h3>
                      <p class="edu-field">{{fieldOfStudy}}</p>
                      <p class="edu-school">{{institution}}</p>
                      <span class="edu-year">{{startDate}} - {{#if isCurrentlyStudying}}Present{{else}}{{endDate}}{{/if}}</span>
                    </div>
                    {{/each}}
                  </section>
                  {{/if}}
                </div>
              </div>
            </div>
          `,
          cssStyles: `
            .cv-container.creative {
              max-width: 210mm;
              margin: 0 auto;
              font-family: 'Poppins', 'Arial', sans-serif;
              background: white;
              overflow: hidden;
            }
            
            .creative-header {
              position: relative;
              height: 250px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              text-align: center;
            }
            
            .header-background {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
              clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
            }
            
            .header-content {
              position: relative;
              z-index: 2;
            }
            
            .profile-circle {
              width: 120px;
              height: 120px;
              border-radius: 50%;
              margin: 0 auto 20px;
              border: 4px solid white;
              overflow: hidden;
              box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            }
            
            .creative-photo {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .creative-name {
              font-size: 2.5em;
              font-weight: 300;
              margin: 0 0 10px 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .creative-tagline {
              font-size: 1.2em;
              margin: 0 0 20px 0;
              opacity: 0.9;
              font-weight: 300;
            }
            
            .contact-creative {
              display: flex;
              gap: 20px;
              justify-content: center;
              flex-wrap: wrap;
              font-size: 0.9em;
              opacity: 0.9;
            }
            
            .creative-body {
              padding: 40px;
            }
            
            .creative-section {
              margin-bottom: 40px;
            }
            
            .section-header {
              display: flex;
              align-items: center;
              margin-bottom: 25px;
            }
            
            .section-header h2 {
              font-size: 1.8em;
              color: #4a5568;
              font-weight: 600;
              margin: 0 20px 0 0;
            }
            
            .section-line {
              flex: 1;
              height: 3px;
              background: linear-gradient(90deg, #667eea, #764ba2);
              border-radius: 2px;
            }
            
            .creative-summary {
              font-size: 1.1em;
              line-height: 1.8;
              color: #4a5568;
              text-align: justify;
              font-style: italic;
            }
            
            .experience-creative {
              display: grid;
              gap: 25px;
            }
            
            .exp-card {
              background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
              padding: 25px;
              border-radius: 15px;
              border-left: 5px solid #667eea;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
            }
            
            .exp-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 10px;
            }
            
            .exp-card h3 {
              color: #2d3748;
              font-size: 1.3em;
              font-weight: 600;
              margin: 0;
            }
            
            .exp-period {
              color: #667eea;
              font-weight: 500;
              font-size: 0.9em;
            }
            
            .exp-company {
              color: #4a5568;
              font-size: 1.1em;
              font-weight: 500;
              margin: 0 0 15px 0;
            }
            
            .exp-desc {
              color: #4a5568;
              line-height: 1.6;
              margin: 0;
            }
            
            .creative-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
            }
            
            .skills-creative {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 15px;
            }
            
            .skill-bubble {
              background: white;
              padding: 15px;
              border-radius: 20px;
              text-align: center;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              border: 2px solid #f7fafc;
              transition: transform 0.3s ease;
            }
            
            .skill-bubble:hover {
              transform: translateY(-2px);
            }
            
            .skill-text {
              display: block;
              color: #2d3748;
              font-weight: 500;
              margin-bottom: 10px;
            }
            
            .skill-level-creative {
              height: 4px;
              border-radius: 2px;
              background: #e2e8f0;
              position: relative;
              overflow: hidden;
            }
            
            .skill-level-creative:after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              background: linear-gradient(90deg, #667eea, #764ba2);
              border-radius: 2px;
            }
            
            .skill-level-creative.Beginner:after { width: 25%; }
            .skill-level-creative.Intermediate:after { width: 50%; }
            .skill-level-creative.Advanced:after { width: 75%; }
            .skill-level-creative.Expert:after { width: 100%; }
            
            .edu-creative {
              background: white;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              border-left: 4px solid #764ba2;
            }
            
            .edu-creative h3 {
              color: #2d3748;
              font-size: 1.2em;
              font-weight: 600;
              margin: 0 0 5px 0;
            }
            
            .edu-field {
              color: #667eea;
              font-weight: 500;
              margin: 0 0 5px 0;
            }
            
            .edu-school {
              color: #4a5568;
              margin: 0 0 10px 0;
            }
            
            .edu-year {
              color: #718096;
              font-size: 0.9em;
              font-weight: 500;
            }
            
            @media print {
              .cv-container.creative {
                box-shadow: none;
              }
              
              .skill-bubble:hover {
                transform: none;
              }
            }
          `,
          isActive: true
        },
        {
          name: 'Tech Minimalist',
          description: 'A clean, minimal design perfect for developers, engineers, and tech professionals',
          category: 'modern',
          htmlTemplate: `
            <div class="cv-container tech">
              <header class="tech-header">
                <div class="header-main">
                  {{#if personalInfo.profileImage}}
                  <img src="{{personalInfo.profileImage}}" alt="Profile" class="tech-avatar">
                  {{/if}}
                  <div class="header-info">
                    <h1 class="tech-name">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
                    <p class="tech-role">Software Professional</p>
                    <div class="tech-contact">
                      <span class="contact-item">{{personalInfo.email}}</span>
                      <span class="contact-item">{{personalInfo.phone}}</span>
                      <span class="contact-item">{{personalInfo.city}}, {{personalInfo.country}}</span>
                    </div>
                  </div>
                </div>
              </header>
              
              <main class="tech-main">
                {{#if summary}}
                <section class="tech-section">
                  <h2 class="tech-section-title">// About</h2>
                  <div class="tech-content">
                    <p class="tech-summary">{{summary}}</p>
                  </div>
                </section>
                {{/if}}
                
                {{#if experience.length}}
                <section class="tech-section">
                  <h2 class="tech-section-title">// Experience</h2>
                  <div class="tech-content">
                    {{#each experience}}
                    <div class="tech-job">
                      <div class="job-header">
                        <div class="job-title-company">
                          <h3 class="job-title">{{jobTitle}}</h3>
                          <span class="job-company">@ {{company}}</span>
                        </div>
                        <span class="job-duration">{{startDate}} - {{#if isCurrentJob}}present{{else}}{{endDate}}{{/if}}</span>
                      </div>
                      {{#if description}}
                      <p class="job-description">{{description}}</p>
                      {{/if}}
                      {{#if achievements.length}}
                      <ul class="job-achievements">
                        {{#each achievements}}
                        <li>{{this}}</li>
                        {{/each}}
                      </ul>
                      {{/if}}
                    </div>
                    {{/each}}
                  </div>
                </section>
                {{/if}}
                
                <div class="tech-grid">
                  {{#if skills.length}}
                  <section class="tech-section">
                    <h2 class="tech-section-title">// Skills</h2>
                    <div class="tech-content">
                      <div class="tech-skills">
                        {{#each skills}}
                        <div class="skill-group">
                          <h4 class="skill-category">{{category}}</h4>
                          <div class="skill-tags">
                            <span class="skill-tag">{{name}}</span>
                          </div>
                        </div>
                        {{/each}}
                      </div>
                    </div>
                  </section>
                  {{/if}}
                  
                  {{#if projects.length}}
                  <section class="tech-section">
                    <h2 class="tech-section-title">// Projects</h2>
                    <div class="tech-content">
                      {{#each projects}}
                      <div class="tech-project">
                        <h3 class="project-name">{{name}}</h3>
                        <p class="project-description">{{description}}</p>
                        {{#if technologies.length}}
                        <div class="project-tech">
                          {{#each technologies}}
                          <span class="tech-tag">{{this}}</span>
                          {{/each}}
                        </div>
                        {{/if}}
                      </div>
                      {{/each}}
                    </div>
                  </section>
                  {{/if}}
                </div>
                
                {{#if education.length}}
                <section class="tech-section">
                  <h2 class="tech-section-title">// Education</h2>
                  <div class="tech-content">
                    {{#each education}}
                    <div class="tech-education">
                      <h3 class="edu-degree">{{degree}} in {{fieldOfStudy}}</h3>
                      <p class="edu-school">{{institution}}</p>
                      <span class="edu-year">{{startDate}} - {{#if isCurrentlyStudying}}present{{else}}{{endDate}}{{/if}}</span>
                    </div>
                    {{/each}}
                  </div>
                </section>
                {{/if}}
              </main>
            </div>
          `,
          cssStyles: `
            .cv-container.tech {
              max-width: 210mm;
              margin: 0 auto;
              padding: 30px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              background: #fafafa;
              color: #2d3748;
              line-height: 1.6;
            }
            
            .tech-header {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              margin-bottom: 30px;
              border-left: 4px solid #00d9ff;
            }
            
            .header-main {
              display: flex;
              align-items: center;
              gap: 25px;
            }
            
            .tech-avatar {
              width: 80px;
              height: 80px;
              border-radius: 8px;
              object-fit: cover;
              border: 2px solid #e2e8f0;
            }
            
            .tech-name {
              font-size: 2.2em;
              font-weight: 700;
              color: #1a202c;
              margin: 0 0 5px 0;
              font-family: 'Arial', sans-serif;
            }
            
            .tech-role {
              color: #00d9ff;
              font-size: 1.1em;
              font-weight: 600;
              margin: 0 0 15px 0;
            }
            
            .tech-contact {
              display: flex;
              gap: 20px;
              flex-wrap: wrap;
            }
            
            .contact-item {
              color: #4a5568;
              font-size: 0.9em;
              background: #f7fafc;
              padding: 4px 8px;
              border-radius: 4px;
            }
            
            .tech-main {
              display: flex;
              flex-direction: column;
              gap: 30px;
            }
            
            .tech-section {
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .tech-section-title {
              background: #1a202c;
              color: #00d9ff;
              padding: 15px 25px;
              margin: 0;
              font-size: 1.2em;
              font-weight: 600;
              font-family: 'Monaco', monospace;
            }
            
            .tech-content {
              padding: 25px;
            }
            
            .tech-summary {
              font-size: 1.05em;
              color: #4a5568;
              line-height: 1.7;
              font-family: 'Arial', sans-serif;
            }
            
            .tech-job {
              margin-bottom: 30px;
              padding-bottom: 25px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .tech-job:last-child {
              border-bottom: none;
              margin-bottom: 0;
            }
            
            .job-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 15px;
            }
            
            .job-title {
              font-size: 1.3em;
              color: #1a202c;
              font-weight: 600;
              margin: 0;
              font-family: 'Arial', sans-serif;
            }
            
            .job-company {
              color: #00d9ff;
              font-weight: 600;
              font-size: 1.1em;
            }
            
            .job-duration {
              color: #718096;
              font-size: 0.9em;
              background: #f7fafc;
              padding: 4px 8px;
              border-radius: 4px;
            }
            
            .job-description {
              color: #4a5568;
              margin-bottom: 15px;
              font-family: 'Arial', sans-serif;
            }
            
            .job-achievements {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            
            .job-achievements li {
              position: relative;
              padding-left: 20px;
              margin-bottom: 8px;
              color: #4a5568;
              font-family: 'Arial', sans-serif;
            }
            
            .job-achievements li:before {
              content: ">";
              position: absolute;
              left: 0;
              color: #00d9ff;
              font-weight: bold;
            }
            
            .tech-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
            }
            
            .tech-skills {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            
            .skill-group {
              border-left: 3px solid #00d9ff;
              padding-left: 15px;
            }
            
            .skill-category {
              color: #1a202c;
              font-size: 1em;
              font-weight: 600;
              margin: 0 0 8px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .skill-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            
            .skill-tag, .tech-tag {
              background: #e6fffa;
              color: #00695c;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.85em;
              font-weight: 500;
              border: 1px solid #b2dfdb;
            }
            
            .tech-project {
              margin-bottom: 25px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .tech-project:last-child {
              border-bottom: none;
              margin-bottom: 0;
            }
            
            .project-name {
              color: #1a202c;
              font-size: 1.2em;
              font-weight: 600;
              margin: 0 0 10px 0;
              font-family: 'Arial', sans-serif;
            }
            
            .project-description {
              color: #4a5568;
              margin-bottom: 12px;
              font-family: 'Arial', sans-serif;
            }
            
            .project-tech {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
            }
            
            .tech-education {
              margin-bottom: 20px;
            }
            
            .edu-degree {
              color: #1a202c;
              font-size: 1.2em;
              font-weight: 600;
              margin: 0 0 5px 0;
              font-family: 'Arial', sans-serif;
            }
            
            .edu-school {
              color: #00d9ff;
              font-weight: 500;
              margin: 0 0 5px 0;
            }
            
            .edu-year {
              color: #718096;
              font-size: 0.9em;
              background: #f7fafc;
              padding: 2px 6px;
              border-radius: 3px;
            }
            
            @media print {
              .cv-container.tech {
                background: white;
                box-shadow: none;
              }
              
              .tech-section {
                box-shadow: none;
                border: 1px solid #e2e8f0;
              }
            }
          `,
          isActive: true
        }
      ];
      
      await Template.bulkCreate(defaultTemplates);
      console.log('✅ Default templates created successfully');
    
    console.log('🎉 Database initialization completed successfully');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };