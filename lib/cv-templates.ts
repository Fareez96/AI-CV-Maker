export const CV_TEMPLATES = {
  chronological: {
    name: "Chronological",
    description: "Best for steady career progression. Most ATS-friendly.",
    format: `[YOUR NAME]
[EMAIL] | [PHONE] | [LOCATION] | [LINKEDIN]

PROFESSIONAL SUMMARY
[2-3 lines summarizing your value proposition and key achievements]

KEY SKILLS
[List 10-15 relevant technical and soft skills in 2-3 lines]

PROFESSIONAL EXPERIENCE

[Job Title] | [Company Name] | [Location] | [Start Date] - [End Date]
• [Achievement with metric/number]
• [Achievement with metric/number]
• [Achievement with metric/number]
• [Key responsibility you excelled at]

[Previous Job Title] | [Previous Company] | [Location] | [Start Date] - [End Date]
• [Achievement with metric/number]
• [Achievement with metric/number]

EDUCATION
[Degree] in [Field] | [University Name] | [Graduation Year]
[Relevant coursework, honors, or GPA if 3.5+]

CERTIFICATIONS & ACHIEVEMENTS
• [Certification Name] - [Issuing Organization] - [Year]
• [Award or Recognition] - [Details]`,
  },

  functional: {
    name: "Functional",
    description: "Best for career changers. Highlights skills over experience.",
    format: `[YOUR NAME]
[EMAIL] | [PHONE] | [LOCATION] | [LINKEDIN]

PROFESSIONAL SUMMARY
[3-4 lines highlighting your core competencies and career objective]

CORE COMPETENCIES
[Organize skills into 4-5 categories with 3-4 skills each]
• Category 1: Skill A, Skill B, Skill C
• Category 2: Skill X, Skill Y, Skill Z

KEY ACHIEVEMENTS
• [Quantifiable achievement across any role]
• [Quantifiable achievement across any role]
• [Quantifiable achievement across any role]
• [Quantifiable achievement across any role]

PROFESSIONAL EXPERIENCE

[Job Title] | [Company] | [Start Date] - [End Date]
[Company industry and brief context]

[Previous Job Title] | [Previous Company] | [Start Date] - [End Date]

EDUCATION
[Degree] in [Field] | [University] | [Graduation Year]

ADDITIONAL INFORMATION
Languages: [Languages]
Certifications: [Certifications]`,
  },

  hybrid: {
    name: "Hybrid",
    description: "Best for most candidates. Combines skills and experience.",
    format: `[YOUR NAME]
[EMAIL] | [PHONE] | [LOCATION] | [LINKEDIN]

PROFESSIONAL SUMMARY
[3 lines: who you are, key achievements, what you bring]

CORE COMPETENCIES & SKILLS
[7-10 most relevant skills for the target role]

PROFESSIONAL EXPERIENCE

[Job Title] | [Company Name] | [City, State] | [Start Month Year] - [End Month Year]
• Spearheaded [initiative] resulting in [X% improvement/growth/savings]
• Designed and implemented [project] impacting [quantifiable result]
• Led [responsibility] delivering [specific outcome]

[Previous Job Title] | [Previous Company] | [City, State] | [Start Month Year] - [End Month Year]
• [Key achievement with numbers]
• [Key responsibility]

EDUCATION
[Degree Type] in [Field of Study] | [University/College Name] | [Year]
[Additional details: honors, GPA if 3.5+, relevant projects]

PROFESSIONAL DEVELOPMENT
[Relevant courses, bootcamps, or trainings]

CERTIFICATIONS
[Industry-recognized certifications]

PROJECTS (Optional)
[Project Name] | [Brief description with link if applicable]`,
  },

  minimal: {
    name: "Minimal",
    description: "Clean and simple. ATS-optimized with minimal formatting.",
    format: `[YOUR NAME]
[EMAIL] | [PHONE] | [LINKEDIN] | [LOCATION]

PROFESSIONAL SUMMARY
[2-3 sentences describing your background, expertise, and career goal]

SKILLS
[15-20 relevant keywords separated by commas, organized by category]

EXPERIENCE

[Job Title]
[Company Name] | [Location] | [Month Year] - [Month Year]
- [Achievement with measurable result]
- [Achievement with measurable result]
- [Responsibility you performed well]
- [Another key accomplishment]

[Previous Job Title]
[Previous Company] | [Location] | [Month Year] - [Month Year]
- [Key achievement]
- [Key responsibility]

EDUCATION
[Degree] | [Major/Field of Study]
[University/School Name] | [Graduation Year]

CERTIFICATIONS
[Certification Name] - [Organization] - [Year]`,
  },
};

export type TemplateKey = keyof typeof CV_TEMPLATES;
