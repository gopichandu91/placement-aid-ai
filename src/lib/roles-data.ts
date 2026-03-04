// Role definitions, skills, and learning resources

export const AVAILABLE_ROLES = [
  "Data Scientist",
  "Software Developer",
  "Machine Learning Engineer",
  "Web Developer",
  "DevOps Engineer",
  "QA Engineer",
  "UI/UX Designer",
  "Product Manager",
] as const;

export type RoleName = (typeof AVAILABLE_ROLES)[number];

export interface SkillItem {
  name: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface LearningResource {
  title: string;
  description: string;
  url: string;
  source: "YouTube" | "Udemy" | "Coursera" | "EdX" | "FreeCodeCamp" | "Other";
}

export const ROLE_SKILLS: Record<RoleName, SkillItem[]> = {
  "Data Scientist": [
    { name: "Python", description: "Core language for data science workflows", level: "Advanced" },
    { name: "SQL", description: "Query databases for data extraction and analysis", level: "Intermediate" },
    { name: "Pandas & NumPy", description: "Data manipulation and numerical computing", level: "Advanced" },
    { name: "Machine Learning", description: "Build predictive models with scikit-learn", level: "Advanced" },
    { name: "Statistics", description: "Hypothesis testing, distributions, and inference", level: "Intermediate" },
    { name: "Data Visualization", description: "Communicate insights with matplotlib, seaborn, Tableau", level: "Intermediate" },
  ],
  "Software Developer": [
    { name: "JavaScript/TypeScript", description: "Core languages for modern software", level: "Advanced" },
    { name: "Data Structures & Algorithms", description: "Efficient problem-solving fundamentals", level: "Advanced" },
    { name: "System Design", description: "Architect scalable and maintainable systems", level: "Intermediate" },
    { name: "Git & Version Control", description: "Collaborate and manage code changes", level: "Intermediate" },
    { name: "REST APIs", description: "Design and consume web services", level: "Intermediate" },
    { name: "Testing", description: "Unit, integration, and E2E testing practices", level: "Intermediate" },
  ],
  "Machine Learning Engineer": [
    { name: "TensorFlow / PyTorch", description: "Deep learning framework proficiency", level: "Advanced" },
    { name: "Model Deployment", description: "Serve models via APIs and containers", level: "Advanced" },
    { name: "MLOps", description: "CI/CD pipelines for ML model lifecycle", level: "Intermediate" },
    { name: "Feature Engineering", description: "Transform raw data into model-ready features", level: "Intermediate" },
    { name: "Python", description: "Primary language for ML development", level: "Advanced" },
    { name: "Cloud Platforms", description: "AWS SageMaker, GCP Vertex AI, Azure ML", level: "Intermediate" },
  ],
  "Web Developer": [
    { name: "HTML & CSS", description: "Foundation of web page structure and styling", level: "Advanced" },
    { name: "JavaScript", description: "Client-side interactivity and logic", level: "Advanced" },
    { name: "React", description: "Component-based UI library", level: "Advanced" },
    { name: "Node.js", description: "Server-side JavaScript runtime", level: "Intermediate" },
    { name: "Responsive Design", description: "Build for all screen sizes", level: "Intermediate" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework", level: "Intermediate" },
  ],
  "DevOps Engineer": [
    { name: "Docker", description: "Containerize applications for consistency", level: "Advanced" },
    { name: "Kubernetes", description: "Orchestrate container deployments at scale", level: "Advanced" },
    { name: "CI/CD", description: "Automate build, test, and deploy pipelines", level: "Advanced" },
    { name: "AWS / Azure / GCP", description: "Cloud infrastructure management", level: "Intermediate" },
    { name: "Terraform", description: "Infrastructure as Code provisioning", level: "Intermediate" },
    { name: "Linux & Shell", description: "Command-line proficiency and scripting", level: "Intermediate" },
  ],
  "QA Engineer": [
    { name: "Test Automation", description: "Selenium, Cypress, Playwright frameworks", level: "Advanced" },
    { name: "Manual Testing", description: "Exploratory and functional test strategies", level: "Intermediate" },
    { name: "API Testing", description: "Postman, REST Assured for backend validation", level: "Intermediate" },
    { name: "Performance Testing", description: "JMeter, k6 for load and stress testing", level: "Intermediate" },
    { name: "Bug Tracking", description: "Jira, Bugzilla for defect management", level: "Beginner" },
    { name: "CI/CD Integration", description: "Integrate tests into deployment pipelines", level: "Intermediate" },
  ],
  "UI/UX Designer": [
    { name: "Figma", description: "Industry-standard design and prototyping tool", level: "Advanced" },
    { name: "User Research", description: "Understand user needs through interviews and surveys", level: "Intermediate" },
    { name: "Wireframing", description: "Create low-fidelity layouts for rapid ideation", level: "Intermediate" },
    { name: "Design Systems", description: "Build consistent, reusable component libraries", level: "Advanced" },
    { name: "Accessibility", description: "WCAG guidelines for inclusive design", level: "Intermediate" },
    { name: "Interaction Design", description: "Micro-interactions and motion design", level: "Intermediate" },
  ],
  "Product Manager": [
    { name: "Product Strategy", description: "Define vision, roadmap, and go-to-market plans", level: "Advanced" },
    { name: "User Stories", description: "Translate requirements into actionable tickets", level: "Intermediate" },
    { name: "Data Analytics", description: "Use metrics to drive product decisions", level: "Intermediate" },
    { name: "Stakeholder Management", description: "Align engineering, design, and business teams", level: "Intermediate" },
    { name: "A/B Testing", description: "Experiment-driven product optimization", level: "Intermediate" },
    { name: "Agile / Scrum", description: "Manage sprints and iterative development", level: "Intermediate" },
  ],
};

export const ROLE_RESOURCES: Record<RoleName, LearningResource[]> = {
  "Data Scientist": [
    { title: "Python for Data Science - Full Course", description: "Complete beginner-to-advanced Python for data analysis", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", source: "YouTube" },
    { title: "Machine Learning A-Z", description: "Hands-on ML with Python & R on Udemy", url: "https://www.udemy.com/course/machinelearning/", source: "Udemy" },
    { title: "IBM Data Science Professional Certificate", description: "9-course series covering the full data science pipeline", url: "https://www.coursera.org/professional-certificates/ibm-data-science", source: "Coursera" },
    { title: "Statistics Fundamentals", description: "StatQuest playlist breaking down stats concepts visually", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9", source: "YouTube" },
  ],
  "Software Developer": [
    { title: "CS50 - Introduction to Computer Science", description: "Harvard's legendary intro CS course", url: "https://www.edx.org/course/cs50s-introduction-to-computer-science", source: "EdX" },
    { title: "JavaScript Algorithms & Data Structures", description: "FreeCodeCamp interactive certification", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", source: "FreeCodeCamp" },
    { title: "System Design Interview Prep", description: "Comprehensive system design concepts", url: "https://www.youtube.com/c/SystemDesignInterview", source: "YouTube" },
    { title: "The Complete Web Developer Bootcamp", description: "Full-stack web development on Udemy", url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/", source: "Udemy" },
  ],
  "Machine Learning Engineer": [
    { title: "Deep Learning Specialization", description: "Andrew Ng's foundational deep learning courses", url: "https://www.coursera.org/specializations/deep-learning", source: "Coursera" },
    { title: "PyTorch for Deep Learning", description: "Full course from freeCodeCamp", url: "https://www.youtube.com/watch?v=V_xro1bcAuI", source: "YouTube" },
    { title: "MLOps Specialization", description: "Production ML systems on Coursera", url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops", source: "Coursera" },
    { title: "TensorFlow Developer Certificate", description: "Official Google TensorFlow certification prep", url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice", source: "Coursera" },
  ],
  "Web Developer": [
    { title: "The Odin Project", description: "Free full-stack web development curriculum", url: "https://www.theodinproject.com/", source: "Other" },
    { title: "React - The Complete Guide", description: "Comprehensive React course on Udemy", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", source: "Udemy" },
    { title: "CSS for JavaScript Developers", description: "Master CSS layout and animations", url: "https://www.youtube.com/watch?v=OXGznpKZ_sA", source: "YouTube" },
    { title: "Responsive Web Design Certification", description: "FreeCodeCamp hands-on HTML/CSS", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", source: "FreeCodeCamp" },
  ],
  "DevOps Engineer": [
    { title: "Docker & Kubernetes: The Practical Guide", description: "Hands-on container orchestration", url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/", source: "Udemy" },
    { title: "AWS Certified Solutions Architect", description: "Prep for the most popular cloud cert", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", source: "Udemy" },
    { title: "DevOps with GitLab CI - Full Course", description: "Complete CI/CD pipeline tutorial", url: "https://www.youtube.com/watch?v=PGyhBwLyK2U", source: "YouTube" },
    { title: "Terraform on AWS", description: "Infrastructure as Code with real examples", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", source: "YouTube" },
  ],
  "QA Engineer": [
    { title: "Selenium WebDriver with Java", description: "Complete test automation course", url: "https://www.udemy.com/course/selenium-real-time-examplesi/", source: "Udemy" },
    { title: "Cypress End-to-End Testing", description: "Modern E2E testing framework", url: "https://www.youtube.com/watch?v=u8vMu7viCm8", source: "YouTube" },
    { title: "ISTQB Foundation Level", description: "Industry-standard QA certification prep", url: "https://www.udemy.com/course/istqb-foundation-level/", source: "Udemy" },
    { title: "API Testing with Postman", description: "Complete Postman tutorial for beginners", url: "https://www.youtube.com/watch?v=VywxIQ2ZXw4", source: "YouTube" },
  ],
  "UI/UX Designer": [
    { title: "Google UX Design Professional Certificate", description: "Complete UX design program by Google", url: "https://www.coursera.org/professional-certificates/google-ux-design", source: "Coursera" },
    { title: "Figma UI/UX Design Tutorial", description: "Full Figma course for beginners", url: "https://www.youtube.com/watch?v=jwCmIBJ8Jtc", source: "YouTube" },
    { title: "Design Systems with Figma", description: "Build scalable component libraries", url: "https://www.youtube.com/watch?v=EK-pHkc5EL4", source: "YouTube" },
    { title: "Interaction Design Specialization", description: "UC San Diego's UX design course series", url: "https://www.coursera.org/specializations/interaction-design", source: "Coursera" },
  ],
  "Product Manager": [
    { title: "Digital Product Management", description: "University of Virginia's PM course", url: "https://www.coursera.org/specializations/uva-darden-digital-product-management", source: "Coursera" },
    { title: "Product Management 101", description: "Complete PM guide for beginners", url: "https://www.youtube.com/watch?v=bNpx7gpSqbY", source: "YouTube" },
    { title: "Become a Product Manager", description: "Comprehensive PM course on Udemy", url: "https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/", source: "Udemy" },
    { title: "Product Analytics with SQL", description: "Data-driven product decisions", url: "https://www.youtube.com/watch?v=7S_tz1z_5bA", source: "YouTube" },
  ],
};

export function getSourceIcon(source: LearningResource["source"]): string {
  switch (source) {
    case "YouTube": return "🎬";
    case "Udemy": return "📚";
    case "Coursera": return "🎓";
    case "EdX": return "🏛️";
    case "FreeCodeCamp": return "⚡";
    default: return "🔗";
  }
}

export function getSourceColor(source: LearningResource["source"]): string {
  switch (source) {
    case "YouTube": return "bg-destructive/10 text-destructive";
    case "Udemy": return "bg-accent/10 text-accent";
    case "Coursera": return "bg-primary/10 text-primary";
    case "EdX": return "bg-success/10 text-success";
    case "FreeCodeCamp": return "bg-warning/10 text-warning";
    default: return "bg-muted text-muted-foreground";
  }
}
