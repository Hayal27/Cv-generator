const puppeteer = require('puppeteer');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

// Generate PDF using Puppeteer
const generatePDF = async (cv) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Generate HTML content
    const htmlContent = generateHTMLContent(cv);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Generate DOCX using docx library
const generateDOCX = async (cv) => {
  try {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString + '-01');
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const formatDateRange = (startDate, endDate, isCurrent = false) => {
      const start = formatDate(startDate);
      const end = isCurrent ? 'Present' : formatDate(endDate);
      return `${start} - ${end}`;
    };

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header with name
          new Paragraph({
            text: `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`,
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 }
          }),
          
          // Contact information
          new Paragraph({
            children: [
              new TextRun({ text: `Email: ${cv.personalInfo.email}`, break: 1 }),
              new TextRun({ text: `Phone: ${cv.personalInfo.phone || 'N/A'}`, break: 1 }),
              new TextRun({ text: `LinkedIn: ${cv.personalInfo.linkedIn || 'N/A'}`, break: 1 }),
              ...(cv.personalInfo.city || cv.personalInfo.country ? [
                new TextRun({ text: `Location: ${[cv.personalInfo.city, cv.personalInfo.country].filter(Boolean).join(', ')}`, break: 1 })
              ] : [])
            ],
            spacing: { after: 300 }
          }),
          
          // Summary
          ...(cv.summary ? [
            new Paragraph({
              text: 'Professional Summary',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 }
            }),
            new Paragraph({
              text: cv.summary,
              spacing: { after: 300 }
            })
          ] : []),
          
          // Experience
          ...(cv.experience && cv.experience.length > 0 ? [
            new Paragraph({
              text: 'Work Experience',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 }
            }),
            ...cv.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({ text: exp.jobTitle, bold: true }),
                  new TextRun({ text: ` at ${exp.company}` }),
                  new TextRun({ text: ` (${formatDateRange(exp.startDate, exp.endDate, exp.isCurrentJob)})`, italics: true })
                ],
                spacing: { before: 100, after: 50 }
              }),
              ...(exp.location ? [new Paragraph({
                text: `Location: ${exp.location}`,
                spacing: { after: 50 }
              })] : []),
              ...(exp.description ? [new Paragraph({
                text: exp.description,
                spacing: { after: 100 }
              })] : []),
              ...(exp.achievements && exp.achievements.length > 0 && exp.achievements[0] ? 
                exp.achievements.filter(achievement => achievement.trim()).map(achievement => 
                  new Paragraph({
                    children: [
                      new TextRun({ text: '• ' }),
                      new TextRun({ text: achievement })
                    ],
                    spacing: { after: 50 }
                  })
                ) : []
              ),
              new Paragraph({ text: '', spacing: { after: 200 } })
            ])
          ] : []),

          // Projects
          ...(cv.projects && cv.projects.length > 0 ? [
            new Paragraph({
              text: 'Projects',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 }
            }),
            ...cv.projects.flatMap(project => [
              new Paragraph({
                children: [
                  new TextRun({ text: project.name, bold: true }),
                  new TextRun({ text: ` (${formatDateRange(project.startDate, project.endDate, project.isOngoing)})`, italics: true })
                ],
                spacing: { before: 100, after: 50 }
              }),
              new Paragraph({
                text: project.description,
                spacing: { after: 100 }
              }),
              ...(project.technologies && project.technologies.length > 0 ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Technologies: ', bold: true }),
                    new TextRun({ text: project.technologies.join(', ') })
                  ],
                  spacing: { after: 100 }
                })
              ] : []),
              ...(project.highlights && project.highlights.length > 0 && project.highlights[0] ? 
                project.highlights.filter(highlight => highlight.trim()).map(highlight => 
                  new Paragraph({
                    children: [
                      new TextRun({ text: '• ' }),
                      new TextRun({ text: highlight })
                    ],
                    spacing: { after: 50 }
                  })
                ) : []
              ),
              new Paragraph({ text: '', spacing: { after: 200 } })
            ])
          ] : []),
          
          // Education
          ...(cv.education && cv.education.length > 0 ? [
            new Paragraph({
              text: 'Education',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 }
            }),
            ...cv.education.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({ text: edu.degree, bold: true }),
                  new TextRun({ text: ` in ${edu.fieldOfStudy}` }),
                  new TextRun({ text: ` from ${edu.institution}`, break: 1 }),
                  new TextRun({ text: formatDateRange(edu.startDate, edu.endDate, edu.isCurrentlyStudying), italics: true }),
                  ...(edu.gpa ? [new TextRun({ text: ` | GPA: ${edu.gpa}` })] : [])
                ],
                spacing: { before: 100, after: 200 }
              })
            ])
          ] : []),
          
          // Skills
          ...(cv.skills && cv.skills.length > 0 ? [
            new Paragraph({
              text: 'Skills',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 }
            }),
            ...Object.entries(
              cv.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.name);
                return acc;
              }, {})
            ).map(([category, skillNames]) => 
              new Paragraph({
                children: [
                  new TextRun({ text: `${category}: `, bold: true }),
                  new TextRun({ text: skillNames.join(', ') })
                ],
                spacing: { after: 100 }
              })
            )
          ] : []),

          // Certifications
          ...(cv.certifications && cv.certifications.length > 0 ? [
            new Paragraph({
              text: 'Certifications',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 }
            }),
            ...cv.certifications.flatMap(cert => [
              new Paragraph({
                children: [
                  new TextRun({ text: cert.name, bold: true }),
                  new TextRun({ text: ` - ${cert.issuer}` }),
                  new TextRun({ text: ` (${formatDate(cert.issueDate)})`, italics: true })
                ],
                spacing: { before: 100, after: 100 }
              })
            ])
          ] : []),

          // Achievements
          ...(cv.achievements && cv.achievements.length > 0 ? [
            new Paragraph({
              text: 'Achievements',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 }
            }),
            ...cv.achievements.flatMap(achievement => [
              new Paragraph({
                children: [
                  new TextRun({ text: achievement.title, bold: true }),
                  ...(achievement.organization ? [new TextRun({ text: ` - ${achievement.organization}` })] : []),
                  ...(achievement.date ? [new TextRun({ text: ` (${formatDate(achievement.date)})`, italics: true })] : [])
                ],
                spacing: { before: 100, after: 50 }
              }),
              ...(achievement.description ? [new Paragraph({
                text: achievement.description,
                spacing: { after: 100 }
              })] : [])
            ])
          ] : [])
        ]
      }]
    });
    
    return await Packer.toBuffer(doc);
  } catch (error) {
    console.error('DOCX generation error:', error);
    throw new Error('Failed to generate DOCX');
  }
};

// Generate HTML content for PDF
const generateHTMLContent = (cv) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate, endDate, isCurrent = false) => {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  // Generate comprehensive HTML content
  let html = `
    <div class="cv-container">
      <header class="cv-header">
        <h1>${cv.personalInfo.firstName} ${cv.personalInfo.lastName}</h1>
        <div class="contact-info">
          ${cv.personalInfo.email ? `<div>📧 ${cv.personalInfo.email}</div>` : ''}
          ${cv.personalInfo.phone ? `<div>📱 ${cv.personalInfo.phone}</div>` : ''}
          ${cv.personalInfo.city || cv.personalInfo.country ? 
            `<div>📍 ${[cv.personalInfo.city, cv.personalInfo.country].filter(Boolean).join(', ')}</div>` : ''}
          ${cv.personalInfo.linkedIn ? `<div>🔗 ${cv.personalInfo.linkedIn}</div>` : ''}
        </div>
      </header>
      
      ${cv.summary ? `
        <section class="summary-section">
          <h2>Professional Summary</h2>
          <p>${cv.summary}</p>
        </section>
      ` : ''}
      
      ${cv.experience && cv.experience.length > 0 ? `
        <section class="experience-section">
          <h2>Work Experience</h2>
          ${cv.experience.map(exp => `
            <div class="experience-item">
              <div class="job-header">
                <h3>${exp.jobTitle}</h3>
                <span class="date-range">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrentJob)}</span>
              </div>
              <div class="company-info">
                <strong>${exp.company}</strong>
                ${exp.location ? ` • ${exp.location}` : ''}
              </div>
              ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
              ${exp.achievements && exp.achievements.length > 0 && exp.achievements[0] ? `
                <ul class="achievements">
                  ${exp.achievements.filter(achievement => achievement.trim()).map(achievement => 
                    `<li>${achievement}</li>`
                  ).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${cv.projects && cv.projects.length > 0 ? `
        <section class="projects-section">
          <h2>Projects</h2>
          ${cv.projects.map(project => `
            <div class="project-item">
              <div class="project-header">
                <h3>${project.name}</h3>
                <span class="date-range">${formatDateRange(project.startDate, project.endDate, project.isOngoing)}</span>
              </div>
              <p class="description">${project.description}</p>
              ${project.technologies && project.technologies.length > 0 ? `
                <div class="technologies">
                  <strong>Technologies:</strong> ${project.technologies.join(', ')}
                </div>
              ` : ''}
              ${project.highlights && project.highlights.length > 0 && project.highlights[0] ? `
                <ul class="highlights">
                  ${project.highlights.filter(highlight => highlight.trim()).map(highlight => 
                    `<li>${highlight}</li>`
                  ).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}
      
      <div class="two-column">
        <div class="left-column">
          ${cv.education && cv.education.length > 0 ? `
            <section class="education-section">
              <h2>Education</h2>
              ${cv.education.map(edu => `
                <div class="education-item">
                  <h3>${edu.degree}</h3>
                  <div class="institution">${edu.fieldOfStudy} • ${edu.institution}</div>
                  <div class="date-range">${formatDateRange(edu.startDate, edu.endDate, edu.isCurrentlyStudying)}</div>
                  ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}

          ${cv.certifications && cv.certifications.length > 0 ? `
            <section class="certifications-section">
              <h2>Certifications</h2>
              ${cv.certifications.map(cert => `
                <div class="certification-item">
                  <h3>${cert.name}</h3>
                  <div class="issuer">${cert.issuer}</div>
                  <div class="date">${formatDate(cert.issueDate)}</div>
                </div>
              `).join('')}
            </section>
          ` : ''}
        </div>

        <div class="right-column">
          ${cv.skills && cv.skills.length > 0 ? `
            <section class="skills-section">
              <h2>Skills</h2>
              ${Object.entries(
                cv.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {})
              ).map(([category, skills]) => `
                <div class="skill-category">
                  <h4>${category}</h4>
                  <div class="skill-items">
                    ${skills.map(skill => `
                      <span class="skill-item">${skill.name} (${skill.level})</span>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </section>
          ` : ''}

          ${cv.achievements && cv.achievements.length > 0 ? `
            <section class="achievements-section">
              <h2>Achievements</h2>
              ${cv.achievements.map(achievement => `
                <div class="achievement-item">
                  <h3>${achievement.title}</h3>
                  ${achievement.organization ? `<div class="organization">${achievement.organization}</div>` : ''}
                  ${achievement.date ? `<div class="date">${formatDate(achievement.date)}</div>` : ''}
                  ${achievement.description ? `<p class="description">${achievement.description}</p>` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${getDefaultCSS()}</style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;
};

// Default HTML template
const getDefaultTemplate = () => `
  <div class="cv-container">
    <header class="cv-header">
      <h1>{{firstName}} {{lastName}}</h1>
      <div class="contact-info">
        <div>{{email}}</div>
        <div>{{phone}}</div>
        <div>{{address}}</div>
        <div>{{linkedin}}</div>
      </div>
    </header>
    
    <section class="summary-section">
      <h2>Professional Summary</h2>
      <p>{{summary}}</p>
    </section>
    
    <section class="experience-section">
      <h2>Work Experience</h2>
      {{experience}}
    </section>
    
    <section class="education-section">
      <h2>Education</h2>
      {{education}}
    </section>
    
    <section class="skills-section">
      <h2>Skills</h2>
      {{skills}}
    </section>
    
    <section class="projects-section">
      <h2>Projects</h2>
      {{projects}}
    </section>
  </div>
`;

// Default CSS styles
const getDefaultCSS = () => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    font-size: 14px;
  }
  
  .cv-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .cv-header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #2c3e50;
    padding-bottom: 20px;
  }
  
  .cv-header h1 {
    font-size: 2.5em;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  .contact-info {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .contact-info div {
    font-size: 0.9em;
    color: #666;
  }
  
  section {
    margin-bottom: 25px;
    page-break-inside: avoid;
  }
  
  h2 {
    color: #2c3e50;
    border-bottom: 1px solid #bdc3c7;
    padding-bottom: 5px;
    margin-bottom: 15px;
    font-size: 1.3em;
    font-weight: bold;
  }
  
  h3 {
    color: #34495e;
    margin-bottom: 5px;
    font-size: 1.1em;
    font-weight: bold;
  }
  
  h4 {
    color: #34495e;
    margin-bottom: 8px;
    font-size: 1em;
    font-weight: bold;
  }
  
  .experience-item, .education-item, .project-item {
    margin-bottom: 20px;
    page-break-inside: avoid;
  }
  
  .job-header, .project-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
  }
  
  .date-range {
    font-size: 0.9em;
    color: #666;
    font-style: italic;
    white-space: nowrap;
  }
  
  .company-info, .institution {
    font-weight: bold;
    color: #7f8c8d;
    margin-bottom: 8px;
  }
  
  .description {
    margin-bottom: 10px;
    text-align: justify;
  }
  
  .achievements, .highlights {
    margin: 10px 0;
    padding-left: 20px;
  }
  
  .achievements li, .highlights li {
    margin-bottom: 5px;
  }
  
  .technologies {
    font-style: italic;
    color: #7f8c8d;
    margin: 8px 0;
    font-size: 0.9em;
  }
  
  .two-column {
    display: flex;
    gap: 30px;
    margin-top: 20px;
  }
  
  .left-column, .right-column {
    flex: 1;
  }
  
  .skill-category {
    margin-bottom: 15px;
  }
  
  .skill-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .skill-item {
    background: #ecf0f1;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85em;
    display: inline-block;
  }
  
  .certification-item, .achievement-item {
    margin-bottom: 15px;
    page-break-inside: avoid;
  }
  
  .issuer, .organization {
    color: #7f8c8d;
    font-weight: bold;
    font-size: 0.9em;
  }
  
  .date {
    color: #666;
    font-size: 0.85em;
    font-style: italic;
  }
  
  .gpa {
    color: #666;
    font-size: 0.9em;
  }
  
  @media print {
    body {
      font-size: 12px;
    }
    
    .cv-container {
      padding: 10px;
    }
    
    .two-column {
      display: block;
    }
    
    .left-column, .right-column {
      width: 100%;
    }
    
    section {
      page-break-inside: avoid;
    }
    
    .experience-item, .project-item {
      page-break-inside: avoid;
    }
  }
`;

module.exports = {
  generatePDF,
  generateDOCX
};