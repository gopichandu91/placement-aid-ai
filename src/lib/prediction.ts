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
  score += Math.min((input.cgpa / 10) * 30, 30);
  score += Math.min(input.internships * 5, 15);
  score += Math.min(input.projects * 3, 15);
  score += Math.min(input.certifications * 2.5, 10);
  const codingMap = { Beginner: 3, Intermediate: 9, Advanced: 15 };
  score += codingMap[input.codingSkill];
  score += input.communicationRating;
  if (input.backlogs) score -= 15;

  const probability = Math.max(0, Math.min(100, score));
  const classification: "High" | "Medium" | "Low" =
    probability >= 70 ? "High" : probability >= 40 ? "Medium" : "Low";

  const suggestions: string[] = [];
  if (input.cgpa < 7) suggestions.push("Focus on improving your CGPA above 7.0 for better chances");
  if (input.internships < 2) suggestions.push("Aim for at least 2 internships to strengthen your profile");
  if (input.projects < 3) suggestions.push("Build more projects to showcase practical skills");
  if (input.certifications < 2) suggestions.push("Get certified in in-demand technologies");
  if (input.codingSkill === "Beginner") suggestions.push("Practice coding daily on LeetCode or HackerRank");
  if (input.communicationRating < 7) suggestions.push("Improve communication through mock interviews");
  if (input.backlogs) suggestions.push("Clear all backlogs ASAP — this is a major red flag");
  if (suggestions.length === 0) suggestions.push("Your profile looks strong! Keep up the great work.");

  return { probability, classification, suggestions };
}

// Resume analysis
export interface ResumeAnalysisResult {
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  breakdown: {
    skillScore: number;
    projectScore: number;
    toolsScore: number;
    educationScore: number;
  };
}

// Synonym / alias mapping for fuzzy matching
const SYNONYMS: Record<string, string[]> = {
  "python": ["python3", "py"],
  "javascript": ["js", "ecmascript", "es6", "es2015"],
  "typescript": ["ts"],
  "machine learning": ["ml", "ml models", "ml algorithms", "machine-learning"],
  "deep learning": ["dl", "deep-learning", "neural networks", "neural network", "ann"],
  "artificial intelligence": ["ai", "a.i."],
  "natural language processing": ["nlp", "text mining", "text analysis"],
  "react": ["reactjs", "react.js", "react js"],
  "node": ["nodejs", "node.js", "node js"],
  "express": ["expressjs", "express.js"],
  "vue": ["vuejs", "vue.js"],
  "angular": ["angularjs", "angular.js"],
  "next.js": ["nextjs", "next js"],
  "mongodb": ["mongo"],
  "postgresql": ["postgres", "psql"],
  "docker": ["containerization", "containers", "dockerfile"],
  "kubernetes": ["k8s"],
  "amazon web services": ["aws"],
  "google cloud platform": ["gcp"],
  "continuous integration": ["ci/cd", "ci", "cd", "cicd"],
  "tensorflow": ["tf", "tensor flow"],
  "pytorch": ["torch"],
  "scikit-learn": ["sklearn", "scikit learn"],
  "data visualization": ["data viz", "visualization", "visualisation"],
  "rest": ["rest api", "restful", "rest apis"],
  "graphql": ["graph ql"],
  "sql": ["structured query language", "mysql", "postgresql", "postgres", "sqlite"],
  "html": ["html5"],
  "css": ["css3", "stylesheet", "stylesheets"],
  "git": ["github", "gitlab", "bitbucket", "version control"],
  "agile": ["scrum", "kanban", "sprint"],
  "object oriented programming": ["oop", "object-oriented"],
  "api": ["apis", "web api", "web service", "web services"],
  "testing": ["unit testing", "test", "tests", "tdd", "bdd"],
  "responsive": ["responsive design", "mobile-first", "mobile first"],
  "figma": ["figma design"],
  "power bi": ["powerbi", "power-bi"],
  "tableau": ["tableau desktop", "tableau server"],
  "excel": ["microsoft excel", "spreadsheet", "spreadsheets"],
  "c++": ["cpp", "c plus plus"],
  "c#": ["csharp", "c sharp"],
};

// Project-related keywords
const PROJECT_KEYWORDS = [
  "project", "projects", "built", "developed", "created", "implemented",
  "designed", "architected", "deployed", "launched", "contributed",
  "maintained", "refactored", "optimized", "automated", "integrated",
  "capstone", "thesis", "portfolio", "side project", "hackathon",
  "open source", "freelance", "startup",
];

// Education-related keywords
const EDUCATION_KEYWORDS = [
  "education", "bachelor", "master", "degree", "b.tech", "b.e.", "m.tech",
  "m.s.", "m.sc", "b.sc", "ph.d", "phd", "diploma", "university",
  "college", "institute", "computer science", "engineering", "information technology",
  "data science", "mathematics", "statistics", "coursework", "gpa", "cgpa",
  "certification", "certified", "certificate", "academic",
];

// Tools & technologies keywords (general)
const TOOLS_KEYWORDS = [
  "linux", "windows", "macos", "terminal", "command line", "bash", "shell",
  "vs code", "vscode", "intellij", "eclipse", "postman", "swagger",
  "jira", "confluence", "slack", "notion", "trello", "asana",
  "heroku", "netlify", "vercel", "firebase", "supabase",
  "nginx", "apache", "redis", "rabbitmq", "kafka",
  "jenkins", "github actions", "gitlab ci", "circleci",
  "prometheus", "grafana", "datadog", "splunk",
  "figma", "sketch", "adobe", "photoshop", "illustrator",
];

// Comprehensive skill keywords for all 32 roles
const JOB_ROLE_SKILLS: Record<string, string[]> = {
  "Data Scientist": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "sql", "statistics", "r", "tableau", "data visualization", "nlp", "scikit-learn", "jupyter", "big data", "spark", "regression", "classification", "power bi"],
  "Machine Learning Engineer": ["python", "tensorflow", "pytorch", "machine learning", "deep learning", "mlops", "docker", "kubernetes", "aws", "model deployment", "feature engineering", "ci/cd", "sql", "numpy", "pandas", "scikit-learn", "cloud", "api", "git", "monitoring"],
  "AI Engineer": ["python", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch", "transformers", "llm", "prompt engineering", "langchain", "openai", "hugging face", "rag", "fine-tuning", "api", "docker", "cloud", "gpu", "neural networks", "generative ai"],
  "Deep Learning Engineer": ["pytorch", "tensorflow", "cnn", "rnn", "transformers", "gpu", "cuda", "python", "neural networks", "optimization", "backpropagation", "gans", "autoencoders", "batch normalization", "dropout", "attention mechanism", "bert", "resnet", "yolo", "computer vision"],
  "NLP Engineer": ["python", "nlp", "transformers", "bert", "gpt", "spacy", "nltk", "hugging face", "text classification", "sentiment analysis", "ner", "tokenization", "word embeddings", "seq2seq", "attention", "language model", "chatbot", "information extraction", "question answering", "summarization"],
  "Data Analyst": ["sql", "excel", "python", "tableau", "power bi", "data visualization", "statistics", "pandas", "reporting", "dashboard", "etl", "data cleaning", "google analytics", "a/b testing", "regression", "pivot tables", "vlookup", "kpi", "metrics", "data storytelling"],
  "Business Analyst": ["sql", "excel", "requirements", "process mapping", "bpmn", "agile", "scrum", "stakeholder", "documentation", "user stories", "wireframing", "jira", "confluence", "data analysis", "power bi", "tableau", "use cases", "gap analysis", "roi", "communication"],
  "Software Engineer": ["javascript", "typescript", "react", "node", "python", "java", "git", "sql", "html", "css", "api", "rest", "agile", "testing", "docker", "aws", "algorithms", "data structures", "oop", "ci/cd"],
  "Backend Developer": ["node", "python", "java", "express", "django", "spring", "postgresql", "mongodb", "redis", "rest", "graphql", "docker", "authentication", "jwt", "oauth", "microservices", "sql", "api", "git", "aws"],
  "Frontend Developer": ["html", "css", "javascript", "typescript", "react", "vue", "angular", "responsive", "tailwind", "sass", "webpack", "vite", "state management", "redux", "next.js", "accessibility", "performance", "git", "figma", "ui/ux"],
  "Full Stack Developer": ["react", "node", "javascript", "typescript", "html", "css", "sql", "mongodb", "rest", "graphql", "docker", "git", "authentication", "next.js", "express", "tailwind", "aws", "ci/cd", "testing", "agile"],
  "React Developer": ["react", "javascript", "typescript", "redux", "hooks", "next.js", "tailwind", "css", "html", "state management", "react query", "testing", "jest", "git", "api", "responsive", "performance", "webpack", "vite", "component"],
  "Django Developer": ["python", "django", "rest framework", "postgresql", "celery", "redis", "docker", "html", "css", "javascript", "orm", "authentication", "api", "git", "testing", "deployment", "nginx", "gunicorn", "sql", "templates"],
  "Python Developer": ["python", "flask", "fastapi", "django", "sqlalchemy", "pytest", "oop", "design patterns", "api", "docker", "git", "sql", "automation", "scripting", "pandas", "requests", "asyncio", "poetry", "virtual environment", "pip"],
  "Java Developer": ["java", "spring", "spring boot", "hibernate", "jpa", "maven", "gradle", "junit", "sql", "microservices", "rest", "docker", "git", "oop", "design patterns", "multithreading", "collections", "kafka", "aws", "ci/cd"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible", "jenkins", "ci/cd", "linux", "bash", "python", "monitoring", "prometheus", "grafana", "git", "networking", "security", "nginx", "microservices"],
  "Cloud Engineer": ["aws", "azure", "gcp", "terraform", "cloudformation", "networking", "vpc", "lambda", "serverless", "iam", "s3", "ec2", "kubernetes", "docker", "monitoring", "cloudwatch", "dns", "load balancer", "security", "compliance"],
  "Cybersecurity Analyst": ["network security", "firewall", "ids", "ips", "siem", "splunk", "vulnerability", "incident response", "linux", "wireshark", "nmap", "encryption", "compliance", "gdpr", "iso 27001", "risk assessment", "penetration testing", "malware", "forensics", "authentication"],
  "Ethical Hacker": ["penetration testing", "kali linux", "burp suite", "owasp", "metasploit", "nmap", "wireshark", "sql injection", "xss", "vulnerability", "python", "networking", "exploitation", "social engineering", "web application security", "reverse engineering", "ctf", "bug bounty", "reconnaissance", "privilege escalation"],
  "Blockchain Developer": ["solidity", "ethereum", "web3", "smart contracts", "defi", "nft", "hardhat", "truffle", "javascript", "react", "cryptography", "consensus", "ipfs", "token", "metamask", "erc20", "erc721", "gas optimization", "dapp", "audit"],
  "Mobile App Developer": ["react native", "flutter", "dart", "javascript", "ios", "android", "rest api", "state management", "redux", "provider", "firebase", "push notifications", "app store", "ui/ux", "responsive", "navigation", "authentication", "sqlite", "git", "testing"],
  "Android Developer": ["kotlin", "java", "android sdk", "jetpack compose", "room", "retrofit", "mvvm", "coroutines", "firebase", "gradle", "xml", "material design", "navigation", "lifecycle", "dependency injection", "hilt", "dagger", "google play", "git", "testing"],
  "iOS Developer": ["swift", "swiftui", "uikit", "core data", "combine", "xcode", "cocoapods", "spm", "mvvm", "networking", "urlsession", "alamofire", "push notifications", "app store", "auto layout", "storyboard", "git", "testing", "accessibility", "instruments"],
  "UI/UX Designer": ["figma", "sketch", "adobe xd", "user research", "wireframing", "prototyping", "design systems", "accessibility", "responsive", "interaction design", "typography", "color theory", "usability testing", "html", "css", "ui/ux", "information architecture", "user flows", "personas", "visual design"],
  "Product Manager": ["product strategy", "agile", "scrum", "user stories", "roadmap", "analytics", "sql", "stakeholder management", "a/b testing", "jira", "data-driven", "market research", "competitive analysis", "prioritization", "okr", "kpi", "communication", "leadership", "presentation", "documentation"],
  "QA Engineer": ["selenium", "cypress", "testing", "automation", "manual testing", "api testing", "postman", "jira", "performance testing", "ci/cd", "git", "agile", "javascript", "python", "sql", "regression", "bug tracking", "test cases", "quality assurance", "playwright"],
  "Automation Tester": ["selenium", "cypress", "playwright", "java", "python", "testng", "junit", "cucumber", "bdd", "ci/cd", "jenkins", "github actions", "api testing", "postman", "rest assured", "xpath", "css selectors", "page object model", "reporting", "git"],
  "Game Developer": ["unity", "unreal engine", "c#", "c++", "game physics", "3d modeling", "blender", "shader", "opengl", "vulkan", "game design", "animation", "ai", "pathfinding", "multiplayer", "networking", "optimization", "level design", "audio", "git"],
  "Embedded Systems Engineer": ["c", "c++", "microcontroller", "arm", "stm32", "rtos", "freertos", "spi", "i2c", "uart", "can", "pcb", "debugging", "jtag", "oscilloscope", "assembly", "firmware", "gpio", "interrupt", "dma"],
  "IoT Engineer": ["embedded c", "mqtt", "coap", "aws iot", "azure iot", "raspberry pi", "arduino", "sensor", "python", "edge computing", "bluetooth", "wifi", "lora", "zigbee", "gateway", "firmware", "cloud", "data processing", "security", "api"],
  "Robotics Engineer": ["ros", "c++", "python", "computer vision", "opencv", "control systems", "pid", "kinematics", "lidar", "imu", "servo", "gazebo", "simulation", "slam", "path planning", "sensor fusion", "actuators", "embedded", "matlab", "deep learning"],
  "AR/VR Developer": ["unity", "unreal", "c#", "c++", "arcore", "arkit", "openxr", "3d math", "spatial audio", "oculus", "meta quest", "shader", "vr", "ar", "mixed reality", "xr", "hand tracking", "ray casting", "optimization", "ui/ux"],
};

function matchesSkill(text: string, skill: string): boolean {
  const lower = skill.toLowerCase();
  // Direct match
  if (textContainsWord(text, lower)) return true;
  // Check synonyms
  const synonymList = SYNONYMS[lower];
  if (synonymList) {
    return synonymList.some((syn) => textContainsWord(text, syn));
  }
  // Check if this skill appears as a synonym value for another key
  for (const [, syns] of Object.entries(SYNONYMS)) {
    if (syns.includes(lower) && textContainsWord(text, lower)) return true;
  }
  return false;
}

function textContainsWord(text: string, word: string): boolean {
  // For short terms (<=3 chars), use word boundary matching to avoid false positives
  if (word.length <= 3) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[\\s,;:/()\\[\\]|•\\-])${escaped}(?:$|[\\s,;:/()\\[\\]|•\\-])`, "i");
    return regex.test(text);
  }
  return text.includes(word);
}

function countKeywordMatches(text: string, keywords: string[]): number {
  return keywords.filter((kw) => text.includes(kw.toLowerCase())).length;
}

export function analyzeResume(text: string, jobRole: string): ResumeAnalysisResult {
  const lowerText = text.toLowerCase();
  const skills = JOB_ROLE_SKILLS[jobRole] || JOB_ROLE_SKILLS["Software Engineer"];

  const matchedSkills = skills.filter((skill) => matchesSkill(lowerText, skill));
  const missingSkills = skills.filter((skill) => !matchesSkill(lowerText, skill));

  // Weighted scoring: Skills 50%, Projects 25%, Tools 15%, Education 10%
  const skillRatio = skills.length > 0 ? matchedSkills.length / skills.length : 0;
  const skillScore = Math.round(skillRatio * 100);

  const projectMatches = countKeywordMatches(lowerText, PROJECT_KEYWORDS);
  const projectScore = Math.min(100, Math.round((projectMatches / 5) * 100));

  const toolMatches = countKeywordMatches(lowerText, TOOLS_KEYWORDS);
  const toolsScore = Math.min(100, Math.round((toolMatches / 5) * 100));

  const eduMatches = countKeywordMatches(lowerText, EDUCATION_KEYWORDS);
  const educationScore = Math.min(100, Math.round((eduMatches / 4) * 100));

  const rawScore =
    skillScore * 0.5 +
    projectScore * 0.25 +
    toolsScore * 0.15 +
    educationScore * 0.10;

  // Normalize: ensure minimum baseline if resume has meaningful content
  let atsScore = Math.round(rawScore);
  if (text.length > 200 && atsScore < 10) {
    atsScore = Math.max(atsScore, 10 + Math.min(projectMatches * 3, 15));
  }
  atsScore = Math.max(0, Math.min(100, atsScore));

  const suggestions: string[] = [];
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 5).join(", ");
    suggestions.push(`Add these key skills to your resume: ${topMissing}`);
  }
  if (projectMatches < 3) suggestions.push("Add more project descriptions with action verbs like 'built', 'developed', 'deployed'");
  if (eduMatches < 2) suggestions.push("Include your education details with degree, university, and relevant coursework");
  if (!lowerText.includes("experience") && !lowerText.includes("work")) suggestions.push("Add a clear 'Experience' or 'Work History' section");
  if (text.length < 500) suggestions.push("Your resume seems too short — aim for at least 1 full page of content");
  if (skillRatio < 0.3) suggestions.push(`Focus on learning core skills for ${jobRole} to improve your match significantly`);
  if (suggestions.length === 0) suggestions.push("Great resume! Consider tailoring it further for each specific application.");

  return {
    atsScore,
    matchedSkills,
    missingSkills,
    suggestions,
    breakdown: {
      skillScore,
      projectScore,
      toolsScore,
      educationScore,
    },
  };
}
