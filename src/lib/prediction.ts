// Placement prediction algorithm (client-side scoring)

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface UserSkillInput {
  skill: string;
  level: SkillLevel;
}

export interface PredictionInput {
  cgpa: number;
  internships: number;
  projects: number;
  certifications: number;
  codingSkill: "Beginner" | "Intermediate" | "Advanced";
  communicationRating: number;
  backlogs: boolean;
  userSkills?: UserSkillInput[];
  targetRoles?: string[];
}

export interface PredictionResult {
  probability: number;
  classification: "High" | "Medium" | "Low";
  suggestions: string[];
}

export interface EnhancedPredictionResult extends PredictionResult {
  reason: string;
  skillStrengths: string[];
  skillsToImprove: string[];
  breakdown: {
    skillMatchScore: number;
    skillLevelScore: number;
    educationScore: number;
    experienceScore: number;
    otherScore: number;
  };
}

const LEVEL_WEIGHT: Record<SkillLevel, number> = {
  Beginner: 0.3,
  Intermediate: 0.65,
  Advanced: 0.9,
  Expert: 1.0,
};

// Map user skill names to role skill keywords (lowercased fuzzy)
function skillMatchesRoleKeyword(userSkill: string, roleKeyword: string): boolean {
  const u = userSkill.toLowerCase();
  const r = roleKeyword.toLowerCase();
  if (u === r) return true;
  if (u.includes(r) || r.includes(u)) return true;
  // Check synonym mapping
  const synonymEntries: [string, string[]][] = [
    ["python", ["python3", "py"]],
    ["javascript", ["js", "ecmascript"]],
    ["typescript", ["ts"]],
    ["machine learning", ["ml"]],
    ["deep learning", ["dl", "neural networks"]],
    ["react", ["reactjs", "react.js"]],
    ["node.js", ["nodejs", "node"]],
    ["c++", ["cpp"]],
    ["c#", ["csharp"]],
    ["postgresql", ["postgres"]],
    ["mongodb", ["mongo"]],
    ["tensorflow", ["tf"]],
    ["pytorch", ["torch"]],
    ["scikit-learn", ["sklearn"]],
    ["amazon web services", ["aws"]],
    ["google cloud platform", ["gcp"]],
    ["kubernetes", ["k8s"]],
    ["power bi", ["powerbi"]],
    ["natural language processing", ["nlp"]],
    ["rest apis", ["rest", "restful"]],
    ["ci/cd", ["cicd", "continuous integration"]],
  ];
  for (const [canonical, synonyms] of synonymEntries) {
    const allForms = [canonical, ...synonyms];
    const uMatches = allForms.some((f) => f === u || u.includes(f) || f.includes(u));
    const rMatches = allForms.some((f) => f === r || r.includes(f) || f.includes(r));
    if (uMatches && rMatches) return true;
  }
  return false;
}

export function predictPlacement(input: PredictionInput): EnhancedPredictionResult {
  const skills = input.userSkills || [];
  const roles = input.targetRoles || [];

  // --- 1. Skill Match Score (40% weight) ---
  // Compare user skills against target role required skills from JOB_ROLE_SKILLS
  let skillMatchRatio = 0;
  let matchedSkillNames: string[] = [];
  let missingSkillNames: string[] = [];

  if (roles.length > 0 && skills.length > 0) {
    const allRoleSkills = new Set<string>();
    for (const role of roles) {
      const roleSkills = JOB_ROLE_SKILLS[role] || [];
      roleSkills.forEach((s) => allRoleSkills.add(s));
    }
    const roleSkillArray = Array.from(allRoleSkills);
    const matched = roleSkillArray.filter((rs) =>
      skills.some((us) => skillMatchesRoleKeyword(us.skill, rs))
    );
    const missing = roleSkillArray.filter((rs) =>
      !skills.some((us) => skillMatchesRoleKeyword(us.skill, rs))
    );
    skillMatchRatio = roleSkillArray.length > 0 ? matched.length / roleSkillArray.length : 0;
    matchedSkillNames = matched.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
    missingSkillNames = missing.slice(0, 8).map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  } else if (skills.length > 0) {
    // No target roles — give partial credit based on skill count
    skillMatchRatio = Math.min(skills.length / 10, 1);
    matchedSkillNames = skills.map((s) => s.skill);
  }
  const skillMatchScore = skillMatchRatio * 100;

  // --- 2. Skill Level Score (25% weight) ---
  let skillLevelScore = 0;
  if (skills.length > 0) {
    const avgLevel = skills.reduce((sum, s) => sum + LEVEL_WEIGHT[s.level], 0) / skills.length;
    skillLevelScore = avgLevel * 100;
  }
  const skillStrengths = skills
    .filter((s) => s.level === "Advanced" || s.level === "Intermediate")
    .map((s) => `${s.skill} (${s.level})`);

  // --- 3. Education Score (15% weight) ---
  const cgpaNorm = Math.min((input.cgpa / 10) * 100, 100);
  const backlogPenalty = input.backlogs ? 30 : 0;
  const educationScore = Math.max(0, cgpaNorm - backlogPenalty);

  // --- 4. Experience Score (10% weight) ---
  const internshipScore = Math.min(input.internships * 20, 100);
  const projectScore = Math.min(input.projects * 15, 100);
  const certScore = Math.min(input.certifications * 20, 100);
  const experienceScore = (internshipScore * 0.4 + projectScore * 0.35 + certScore * 0.25);

  // --- 5. Other Score (10% weight) ---
  const codingMap = { Beginner: 25, Intermediate: 60, Advanced: 100 };
  const commScore = (input.communicationRating / 10) * 100;
  const otherScore = (codingMap[input.codingSkill] * 0.6 + commScore * 0.4);

  // --- Weighted total ---
  const rawProbability =
    skillMatchScore * 0.40 +
    skillLevelScore * 0.25 +
    educationScore * 0.15 +
    experienceScore * 0.10 +
    otherScore * 0.10;

  const probability = Math.max(0, Math.min(100, rawProbability));
  const classification: "High" | "Medium" | "Low" =
    probability >= 70 ? "High" : probability >= 40 ? "Medium" : "Low";

  // --- Suggestions ---
  const suggestions: string[] = [];
  if (input.cgpa < 7) suggestions.push("Focus on improving your CGPA above 7.0 for better chances.");
  if (input.internships < 2) suggestions.push("Aim for at least 2 internships to strengthen your profile.");
  if (input.projects < 3) suggestions.push("Build more projects to showcase practical skills.");
  if (input.certifications < 2) suggestions.push("Get certified in in-demand technologies.");
  if (input.codingSkill === "Beginner") suggestions.push("Practice coding daily on LeetCode or HackerRank.");
  if (input.communicationRating < 7) suggestions.push("Improve communication through mock interviews.");
  if (input.backlogs) suggestions.push("Clear all backlogs ASAP — this is a major red flag.");
  if (missingSkillNames.length > 0) {
    suggestions.push(`Learn these key skills: ${missingSkillNames.slice(0, 5).join(", ")}.`);
  }
  if (skills.filter((s) => s.level === "Beginner").length > 2) {
    suggestions.push("Level up your beginner skills to intermediate — this significantly boosts your profile.");
  }
  if (skills.length === 0) {
    suggestions.push("Add your skills to get a more accurate and personalized prediction.");
  }
  if (suggestions.length === 0) suggestions.push("Your profile looks strong! Keep up the great work.");

  // --- Human-like reason ---
  let reason = "";
  if (roles.length > 0) {
    const topRole = roles[0];
    if (probability >= 70) {
      reason = `Your skills align strongly with the ${topRole} role. ${matchedSkillNames.length > 0 ? `Your proficiency in ${matchedSkillNames.slice(0, 3).join(", ")} gives you a competitive edge.` : ""}`;
    } else if (probability >= 40) {
      reason = `You have a decent foundation for ${topRole}, but there's room to grow. ${missingSkillNames.length > 0 ? `Consider building expertise in ${missingSkillNames.slice(0, 3).join(", ")}.` : ""}`;
    } else {
      reason = `Your current profile has limited overlap with ${topRole} requirements. ${missingSkillNames.length > 0 ? `Focus on learning ${missingSkillNames.slice(0, 3).join(", ")} to improve your chances.` : ""}`;
    }
  } else {
    reason = probability >= 70
      ? "Your academic profile and experience suggest strong placement potential."
      : probability >= 40
        ? "You have a moderate profile. Gaining more skills and experience will help."
        : "Consider building more skills, projects, and internship experience.";
  }

  return {
    probability,
    classification,
    suggestions,
    reason,
    skillStrengths,
    skillsToImprove: missingSkillNames,
    breakdown: {
      skillMatchScore,
      skillLevelScore,
      educationScore,
      experienceScore,
      otherScore,
    },
  };
}

// Resume analysis
export interface ResumeAnalysisResult {
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  roleFitExplanation: string;
  breakdown: {
    skillScore: number;
    projectScore: number;
    toolsScore: number;
    educationScore: number;
  };
}

// Synonym / alias mapping for fuzzy matching
const SYNONYMS: Record<string, string[]> = {
  "python": ["python3", "py", "python programming"],
  "javascript": ["js", "ecmascript", "es6", "es2015", "vanilla js"],
  "typescript": ["ts", "type script"],
  "machine learning": ["ml", "ml models", "ml algorithms", "machine-learning", "predictive modeling", "supervised learning", "unsupervised learning"],
  "deep learning": ["dl", "deep-learning", "neural networks", "neural network", "ann", "deep neural"],
  "artificial intelligence": ["ai", "a.i.", "artificial intel"],
  "natural language processing": ["nlp", "text mining", "text analysis", "language processing"],
  "react": ["reactjs", "react.js", "react js", "react framework"],
  "node": ["nodejs", "node.js", "node js", "node server"],
  "express": ["expressjs", "express.js", "express framework"],
  "vue": ["vuejs", "vue.js", "vue framework"],
  "angular": ["angularjs", "angular.js", "angular framework"],
  "next.js": ["nextjs", "next js", "next framework"],
  "mongodb": ["mongo", "mongo db", "nosql"],
  "postgresql": ["postgres", "psql", "postgre"],
  "docker": ["containerization", "containers", "dockerfile", "docker compose", "docker-compose"],
  "kubernetes": ["k8s", "kube", "container orchestration"],
  "amazon web services": ["aws", "amazon cloud"],
  "google cloud platform": ["gcp", "google cloud"],
  "microsoft azure": ["azure", "azure cloud"],
  "continuous integration": ["ci/cd", "ci", "cd", "cicd", "continuous deployment", "continuous delivery"],
  "tensorflow": ["tf", "tensor flow", "tensor-flow"],
  "pytorch": ["torch", "py torch"],
  "scikit-learn": ["sklearn", "scikit learn", "sci-kit learn"],
  "data visualization": ["data viz", "visualization", "visualisation", "data charts", "plotting"],
  "rest": ["rest api", "restful", "rest apis", "restful api"],
  "graphql": ["graph ql", "graphql api"],
  "sql": ["structured query language", "mysql", "sqlite", "sql queries", "sql database"],
  "html": ["html5", "hypertext markup"],
  "css": ["css3", "stylesheet", "stylesheets", "cascading style"],
  "git": ["github", "gitlab", "bitbucket", "version control", "git version"],
  "agile": ["scrum", "kanban", "sprint", "agile methodology", "agile development"],
  "object oriented programming": ["oop", "object-oriented", "object oriented"],
  "api": ["apis", "web api", "web service", "web services", "api development"],
  "testing": ["unit testing", "test", "tests", "tdd", "bdd", "test automation"],
  "responsive": ["responsive design", "mobile-first", "mobile first", "responsive web"],
  "figma": ["figma design", "figma tool"],
  "power bi": ["powerbi", "power-bi", "power business intelligence"],
  "tableau": ["tableau desktop", "tableau server", "tableau visualization"],
  "excel": ["microsoft excel", "spreadsheet", "spreadsheets", "ms excel"],
  "c++": ["cpp", "c plus plus", "cplusplus"],
  "c#": ["csharp", "c sharp", "c-sharp"],
  "data analysis": ["data analytics", "analytics", "data analyst"],
  "statistics": ["statistical analysis", "statistical", "stat", "stats"],
  "pandas": ["pandas library", "pd"],
  "numpy": ["np", "numerical python"],
  "r": ["r programming", "r language", "rstudio"],
  "spring": ["spring framework", "spring mvc"],
  "spring boot": ["springboot", "spring-boot"],
  "django": ["django framework", "django python"],
  "flask": ["flask framework", "flask python"],
  "microservices": ["micro services", "micro-services", "microservice architecture"],
  "cloud": ["cloud computing", "cloud services", "cloud infrastructure"],
  "linux": ["unix", "ubuntu", "centos", "debian", "fedora", "redhat"],
  "bash": ["shell", "shell scripting", "bash scripting", "command line"],
  "data structures": ["dsa", "data structure", "algorithms and data structures"],
  "algorithms": ["algorithm", "algo", "algorithmic"],
};

// Project-related keywords (expanded)
const PROJECT_KEYWORDS = [
  "project", "projects", "built", "developed", "created", "implemented",
  "designed", "architected", "deployed", "launched", "contributed",
  "maintained", "refactored", "optimized", "automated", "integrated",
  "capstone", "thesis", "portfolio", "side project", "hackathon",
  "open source", "freelance", "startup", "engineered", "constructed",
  "led", "managed", "delivered", "shipped", "published",
  "collaborated", "spearheaded", "initiated", "established",
];

// Education-related keywords (expanded)
const EDUCATION_KEYWORDS = [
  "education", "bachelor", "master", "degree", "b.tech", "b.e.", "m.tech",
  "m.s.", "m.sc", "b.sc", "ph.d", "phd", "diploma", "university",
  "college", "institute", "computer science", "engineering", "information technology",
  "data science", "mathematics", "statistics", "coursework", "gpa", "cgpa",
  "certification", "certified", "certificate", "academic", "scholar",
  "graduate", "undergraduate", "postgraduate", "research", "dissertation",
  "b.a.", "m.a.", "mba", "bca", "mca",
];

// Tools & technologies keywords (expanded)
const TOOLS_KEYWORDS = [
  "linux", "windows", "macos", "terminal", "command line", "bash", "shell",
  "vs code", "vscode", "intellij", "eclipse", "postman", "swagger",
  "jira", "confluence", "slack", "notion", "trello", "asana",
  "heroku", "netlify", "vercel", "firebase", "supabase",
  "nginx", "apache", "redis", "rabbitmq", "kafka",
  "jenkins", "github actions", "gitlab ci", "circleci",
  "prometheus", "grafana", "datadog", "splunk",
  "figma", "sketch", "adobe", "photoshop", "illustrator",
  "jupyter", "colab", "anaconda", "pip", "npm", "yarn",
  "aws", "azure", "gcp", "terraform", "ansible",
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

// --- Advanced matching helpers ---

/** Bidirectional synonym lookup: find all forms of a skill */
function getAllForms(skill: string): string[] {
  const lower = skill.toLowerCase();
  const forms = new Set<string>([lower]);

  // Direct synonym entry
  if (SYNONYMS[lower]) {
    SYNONYMS[lower].forEach((s) => forms.add(s));
  }
  // Reverse lookup: if this skill is a synonym value, add the canonical + siblings
  for (const [canonical, syns] of Object.entries(SYNONYMS)) {
    if (canonical === lower || syns.some((s) => s === lower)) {
      forms.add(canonical);
      syns.forEach((s) => forms.add(s));
    }
  }
  return Array.from(forms);
}

function textContainsWord(text: string, word: string): boolean {
  if (word.length <= 3) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[\\s,;:/()\\[\\]|•\\-])${escaped}(?:$|[\\s,;:/()\\[\\]|•\\-])`, "i");
    return regex.test(text);
  }
  return text.includes(word);
}

/** Check if text matches a skill using all synonym forms */
function matchesSkill(text: string, skill: string): boolean {
  const forms = getAllForms(skill);
  return forms.some((form) => textContainsWord(text, form));
}

/** TF-IDF inspired relevance: count how many times a skill appears (frequency) */
function skillFrequency(text: string, skill: string): number {
  const forms = getAllForms(skill);
  let count = 0;
  for (const form of forms) {
    if (form.length <= 3) {
      const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(?:^|[\\s,;:/()\\[\\]|•\\-])${escaped}(?:$|[\\s,;:/()\\[\\]|•\\-])`, "gi");
      const matches = text.match(regex);
      if (matches) count += matches.length;
    } else {
      const regex = new RegExp(form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      const matches = text.match(regex);
      if (matches) count += matches.length;
    }
  }
  return count;
}

/** Context similarity: check if skill appears near action verbs (stronger signal) */
function skillInContext(text: string, skill: string): boolean {
  const forms = getAllForms(skill);
  const contextWords = ["experience", "proficient", "worked", "built", "developed", "expert", "skilled", "knowledge", "familiar", "used", "using", "implemented", "applied", "hands-on", "years"];
  for (const form of forms) {
    const idx = text.indexOf(form);
    if (idx === -1) continue;
    // Check 80-char window around the match
    const start = Math.max(0, idx - 80);
    const end = Math.min(text.length, idx + form.length + 80);
    const window = text.slice(start, end);
    if (contextWords.some((cw) => window.includes(cw))) return true;
  }
  return false;
}

function countKeywordMatches(text: string, keywords: string[]): number {
  return keywords.filter((kw) => textContainsWord(text, kw.toLowerCase())).length;
}

export function analyzeResume(text: string, jobRole: string): ResumeAnalysisResult {
  const lowerText = text.toLowerCase();
  const skills = JOB_ROLE_SKILLS[jobRole] || JOB_ROLE_SKILLS["Software Engineer"];

  // --- 1. Core Skills Score (50%) with TF-IDF frequency boost ---
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  let weightedSkillScore = 0;

  for (const skill of skills) {
    const isMatched = matchesSkill(lowerText, skill);
    if (isMatched) {
      matchedSkills.push(skill);
      // Base match = 1.0, frequency boost up to +0.5, context boost +0.3
      const freq = skillFrequency(lowerText, skill);
      const freqBoost = Math.min(freq / 5, 0.5); // cap at 0.5 extra
      const contextBoost = skillInContext(lowerText, skill) ? 0.3 : 0;
      weightedSkillScore += 1.0 + freqBoost + contextBoost;
    } else {
      missingSkills.push(skill);
    }
  }

  // Normalize: max possible is skills.length * 1.8 (1.0 + 0.5 + 0.3)
  const maxPossible = skills.length * 1.8;
  const skillScore = skills.length > 0 ? Math.round((weightedSkillScore / maxPossible) * 100) : 0;

  // --- 2. Tools & Technologies Score (20%) ---
  const toolMatches = countKeywordMatches(lowerText, TOOLS_KEYWORDS);
  const toolsScore = Math.min(100, Math.round((toolMatches / 6) * 100));

  // --- 3. Project Experience Score (20%) ---
  const projectMatches = countKeywordMatches(lowerText, PROJECT_KEYWORDS);
  const projectScore = Math.min(100, Math.round((projectMatches / 6) * 100));

  // --- 4. Education Score (10%) ---
  const eduMatches = countKeywordMatches(lowerText, EDUCATION_KEYWORDS);
  const educationScore = Math.min(100, Math.round((eduMatches / 5) * 100));

  // --- Weighted total: 50/20/20/10 ---
  const rawScore =
    skillScore * 0.50 +
    toolsScore * 0.20 +
    projectScore * 0.20 +
    educationScore * 0.10;

  // --- Normalization for realistic scoring ---
  let atsScore = Math.round(rawScore);

  // Baseline boost for resumes with meaningful content
  if (text.length > 300 && atsScore < 15) {
    const contentBonus = Math.min(15, Math.round((projectMatches + toolMatches + eduMatches) * 2));
    atsScore = Math.max(atsScore, 10 + contentBonus);
  }

  // Boost if many skills matched but frequency was low (prevents unfairly low scores)
  const matchRatio = skills.length > 0 ? matchedSkills.length / skills.length : 0;
  if (matchRatio > 0.4 && atsScore < 40) {
    atsScore = Math.max(atsScore, Math.round(matchRatio * 60));
  }

  atsScore = Math.max(0, Math.min(100, atsScore));

  // --- Role Fit Explanation ---
  let roleFitExplanation = "";
  const topMatched = matchedSkills.slice(0, 4).map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  const topMissing = missingSkills.slice(0, 3).map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  if (atsScore >= 70) {
    roleFitExplanation = `Your resume is a strong match for the ${jobRole} role. ${topMatched.length > 0 ? `Key strengths include ${topMatched.join(", ")}.` : ""} ${topMissing.length > 0 ? `To strengthen further, consider adding ${topMissing.join(", ")}.` : "Keep refining your experience descriptions for maximum impact."}`;
  } else if (atsScore >= 40) {
    roleFitExplanation = `Your resume shows moderate alignment with ${jobRole}. ${topMatched.length > 0 ? `You demonstrate relevant skills in ${topMatched.join(", ")}. ` : ""}${topMissing.length > 0 ? `However, key gaps exist in ${topMissing.join(", ")} — addressing these would significantly improve your match.` : "Consider adding more domain-specific keywords."}`;
  } else {
    roleFitExplanation = `Your resume currently has limited overlap with ${jobRole} requirements. ${topMissing.length > 0 ? `Core skills like ${topMissing.join(", ")} are missing. ` : ""}Focus on building foundational skills for this role and include relevant projects and certifications.`;
  }

  // --- Suggestions ---
  const suggestions: string[] = [];
  if (missingSkills.length > 0) {
    suggestions.push(`Add these key skills to your resume: ${missingSkills.slice(0, 5).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}`);
  }
  if (matchedSkills.length > 0 && matchedSkills.some((s) => skillFrequency(lowerText, s) <= 1)) {
    suggestions.push("Mention your key skills in multiple contexts (projects, experience, summary) to improve ATS visibility");
  }
  if (projectMatches < 4) suggestions.push("Add more project descriptions with action verbs like 'built', 'developed', 'deployed', 'engineered'");
  if (eduMatches < 3) suggestions.push("Include education details with degree, university, relevant coursework, and certifications");
  if (!lowerText.includes("experience") && !lowerText.includes("work")) suggestions.push("Add a clear 'Experience' or 'Work History' section");
  if (text.length < 500) suggestions.push("Your resume seems too short — aim for at least 1 full page of detailed content");
  if (matchRatio < 0.3) suggestions.push(`Focus on learning core skills for ${jobRole} to improve your match significantly`);
  if (matchRatio > 0.5 && atsScore < 60) suggestions.push("Your skills are relevant but need more context — describe how you used each skill in real projects");
  if (suggestions.length === 0) suggestions.push("Great resume! Consider tailoring it further for each specific application.");

  return {
    atsScore,
    matchedSkills,
    missingSkills,
    suggestions,
    roleFitExplanation,
    breakdown: {
      skillScore,
      projectScore,
      toolsScore,
      educationScore,
    },
  };
}
