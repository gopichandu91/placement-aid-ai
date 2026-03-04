// Placement prediction algorithm (client-side scoring)
export interface PredictionInput {
  cgpa: number;
  internships: number;
  projects: number;
  certifications: number;
  codingSkill: "Beginner" | "Intermediate" | "Advanced";
  communicationRating: number;
  backlogs: boolean;
}

export interface PredictionResult {
  probability: number;
  classification: "High" | "Medium" | "Low";
  suggestions: string[];
}

export function predictPlacement(input: PredictionInput): PredictionResult {
  let score = 0;

  // CGPA (max 30 points)
  score += Math.min((input.cgpa / 10) * 30, 30);

  // Internships (max 15 points)
  score += Math.min(input.internships * 5, 15);

  // Projects (max 15 points)
  score += Math.min(input.projects * 3, 15);

  // Certifications (max 10 points)
  score += Math.min(input.certifications * 2.5, 10);

  // Coding skill (max 15 points)
  const codingMap = { Beginner: 3, Intermediate: 9, Advanced: 15 };
  score += codingMap[input.codingSkill];

  // Communication (max 10 points)
  score += input.communicationRating;

  // Backlogs penalty
  if (input.backlogs) score -= 15;

  const probability = Math.max(0, Math.min(100, score));

  const classification: "High" | "Medium" | "Low" =
    probability >= 70 ? "High" : probability >= 40 ? "Medium" : "Low";

  const suggestions: string[] = [];
  if (input.cgpa < 7) suggestions.push("Focus on improving your CGPA above 7.0 for better chances");
  if (input.internships < 2) suggestions.push("Aim for at least 2 internships to strengthen your profile");
  if (input.projects < 3) suggestions.push("Build more projects to showcase your practical skills");
  if (input.certifications < 2) suggestions.push("Get certified in in-demand technologies");
  if (input.codingSkill === "Beginner") suggestions.push("Practice coding daily on platforms like LeetCode or HackerRank");
  if (input.communicationRating < 7) suggestions.push("Improve communication skills through mock interviews and presentations");
  if (input.backlogs) suggestions.push("Clear all backlogs as soon as possible — this is a major red flag");
  if (suggestions.length === 0) suggestions.push("Your profile looks strong! Keep up the great work and prepare for interviews.");

  return { probability, classification, suggestions };
}

// Resume analysis
export interface ResumeAnalysisResult {
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}

const JOB_ROLE_SKILLS: Record<string, string[]> = {
  "Software Developer": ["javascript", "typescript", "react", "node", "python", "java", "git", "sql", "html", "css", "api", "rest", "agile", "testing", "docker", "aws", "algorithms", "data structures", "oop", "ci/cd"],
  "Data Scientist": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "sql", "statistics", "r", "tableau", "data visualization", "nlp", "scikit-learn", "jupyter", "big data", "spark", "hadoop", "regression", "classification"],
  "Machine Learning Engineer": ["python", "tensorflow", "pytorch", "machine learning", "deep learning", "mlops", "docker", "kubernetes", "aws", "model deployment", "feature engineering", "ci/cd", "sql", "numpy", "pandas", "scikit-learn", "cloud", "api", "git", "monitoring"],
  "Web Developer": ["html", "css", "javascript", "react", "angular", "vue", "node", "typescript", "responsive", "bootstrap", "tailwind", "git", "api", "rest", "graphql", "webpack", "sass", "figma", "ui/ux", "accessibility"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible", "jenkins", "ci/cd", "linux", "bash", "python", "monitoring", "prometheus", "grafana", "git", "networking", "security", "nginx", "microservices"],
  "QA Engineer": ["selenium", "cypress", "testing", "automation", "manual testing", "api testing", "postman", "jira", "performance testing", "ci/cd", "git", "agile", "javascript", "python", "sql", "regression", "bug tracking", "test cases", "quality assurance", "playwright"],
  "UI/UX Designer": ["figma", "sketch", "adobe xd", "user research", "wireframing", "prototyping", "design systems", "accessibility", "responsive", "interaction design", "typography", "color theory", "usability testing", "html", "css", "ui/ux", "information architecture", "user flows", "personas", "visual design"],
  "Product Manager": ["product strategy", "agile", "scrum", "user stories", "roadmap", "analytics", "sql", "stakeholder management", "a/b testing", "jira", "data-driven", "market research", "competitive analysis", "prioritization", "okr", "kpi", "communication", "leadership", "presentation", "documentation"],
};

export function analyzeResume(text: string, jobRole: string): ResumeAnalysisResult {
  const lowerText = text.toLowerCase();
  const skills = JOB_ROLE_SKILLS[jobRole] || JOB_ROLE_SKILLS["Software Developer"];

  const matchedSkills = skills.filter((skill) => lowerText.includes(skill));
  const missingSkills = skills.filter((skill) => !lowerText.includes(skill));

  const atsScore = Math.round((matchedSkills.length / skills.length) * 100);

  const suggestions: string[] = [];
  if (missingSkills.length > 0) {
    suggestions.push(`Add these key skills to your resume: ${missingSkills.slice(0, 5).join(", ")}`);
  }
  if (!lowerText.includes("experience")) suggestions.push("Add a clear 'Experience' section");
  if (!lowerText.includes("education")) suggestions.push("Include your 'Education' details");
  if (!lowerText.includes("project")) suggestions.push("Highlight your projects with descriptions");
  if (text.length < 300) suggestions.push("Your resume seems too short — aim for at least 1 full page");
  if (suggestions.length === 0) suggestions.push("Great resume! Consider tailoring it further for each application.");

  return { atsScore, matchedSkills, missingSkills, suggestions };
}
