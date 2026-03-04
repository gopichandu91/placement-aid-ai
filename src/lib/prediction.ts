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
}

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

export function analyzeResume(text: string, jobRole: string): ResumeAnalysisResult {
  const lowerText = text.toLowerCase();
  const skills = JOB_ROLE_SKILLS[jobRole] || JOB_ROLE_SKILLS["Software Engineer"];

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
