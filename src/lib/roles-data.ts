// Role definitions, skills, and learning resources — 30+ scalable roles

export const AVAILABLE_ROLES = [
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Deep Learning Engineer",
  "NLP Engineer",
  "Data Analyst",
  "Business Analyst",
  "Software Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "React Developer",
  "Django Developer",
  "Python Developer",
  "Java Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "Ethical Hacker",
  "Blockchain Developer",
  "Mobile App Developer",
  "Android Developer",
  "iOS Developer",
  "UI/UX Designer",
  "Product Manager",
  "QA Engineer",
  "Automation Tester",
  "Game Developer",
  "Embedded Systems Engineer",
  "IoT Engineer",
  "Robotics Engineer",
  "AR/VR Developer",
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
  source: "YouTube" | "Udemy" | "Coursera" | "EdX" | "FreeCodeCamp" | "NPTEL" | "Simplilearn" | "Other";
}

// Skills per role
export const ROLE_SKILLS: Record<RoleName, SkillItem[]> = {
  "Data Scientist": [
    { name: "Python", description: "Core language for data science workflows", level: "Advanced" },
    { name: "SQL", description: "Query databases for data extraction", level: "Intermediate" },
    { name: "Pandas & NumPy", description: "Data manipulation and numerical computing", level: "Advanced" },
    { name: "Machine Learning", description: "Build predictive models with scikit-learn", level: "Advanced" },
    { name: "Statistics", description: "Hypothesis testing, distributions, inference", level: "Intermediate" },
    { name: "Data Visualization", description: "matplotlib, seaborn, Tableau, Power BI", level: "Intermediate" },
    { name: "Deep Learning", description: "Neural networks with TensorFlow/PyTorch", level: "Intermediate" },
  ],
  "Machine Learning Engineer": [
    { name: "TensorFlow / PyTorch", description: "Deep learning framework proficiency", level: "Advanced" },
    { name: "Model Deployment", description: "Serve models via APIs and containers", level: "Advanced" },
    { name: "MLOps", description: "CI/CD pipelines for ML model lifecycle", level: "Intermediate" },
    { name: "Feature Engineering", description: "Transform raw data into model-ready features", level: "Intermediate" },
    { name: "Python", description: "Primary language for ML development", level: "Advanced" },
    { name: "Cloud Platforms", description: "AWS SageMaker, GCP Vertex AI, Azure ML", level: "Intermediate" },
  ],
  "AI Engineer": [
    { name: "Python", description: "Primary AI development language", level: "Advanced" },
    { name: "Deep Learning", description: "CNN, RNN, Transformers, GANs", level: "Advanced" },
    { name: "NLP", description: "Text processing, sentiment analysis, chatbots", level: "Advanced" },
    { name: "Computer Vision", description: "Image recognition and object detection", level: "Intermediate" },
    { name: "LLMs & Prompt Engineering", description: "Work with GPT, Gemini, LLaMA models", level: "Intermediate" },
    { name: "MLOps", description: "Deploy and monitor AI systems at scale", level: "Intermediate" },
  ],
  "Deep Learning Engineer": [
    { name: "PyTorch", description: "Dynamic computation graphs for research", level: "Advanced" },
    { name: "TensorFlow", description: "Production-grade deep learning framework", level: "Advanced" },
    { name: "CNNs", description: "Convolutional networks for vision tasks", level: "Advanced" },
    { name: "RNNs & Transformers", description: "Sequence modeling architectures", level: "Advanced" },
    { name: "GPU Programming", description: "CUDA and distributed training", level: "Intermediate" },
    { name: "Mathematics", description: "Linear algebra, calculus, optimization", level: "Advanced" },
  ],
  "NLP Engineer": [
    { name: "Python", description: "Core NLP development language", level: "Advanced" },
    { name: "Transformers", description: "BERT, GPT, T5 architectures", level: "Advanced" },
    { name: "SpaCy & NLTK", description: "NLP libraries for text processing", level: "Intermediate" },
    { name: "Hugging Face", description: "Model hub and training pipelines", level: "Advanced" },
    { name: "Text Classification", description: "Sentiment, intent, topic analysis", level: "Intermediate" },
    { name: "Information Extraction", description: "NER, relation extraction, QA", level: "Intermediate" },
  ],
  "Data Analyst": [
    { name: "SQL", description: "Advanced queries, joins, window functions", level: "Advanced" },
    { name: "Excel", description: "Pivot tables, VLOOKUP, data modeling", level: "Intermediate" },
    { name: "Power BI / Tableau", description: "Business intelligence dashboards", level: "Advanced" },
    { name: "Python", description: "Pandas for data analysis", level: "Intermediate" },
    { name: "Statistics", description: "Descriptive and inferential statistics", level: "Intermediate" },
    { name: "Data Storytelling", description: "Communicate insights effectively", level: "Intermediate" },
  ],
  "Business Analyst": [
    { name: "Requirements Gathering", description: "Stakeholder interviews and documentation", level: "Advanced" },
    { name: "SQL", description: "Data extraction and analysis", level: "Intermediate" },
    { name: "Excel", description: "Advanced modeling and analysis", level: "Advanced" },
    { name: "Process Mapping", description: "BPMN, flowcharts, use cases", level: "Intermediate" },
    { name: "Power BI / Tableau", description: "Dashboard creation and reporting", level: "Intermediate" },
    { name: "Agile / Scrum", description: "Sprint planning and backlog management", level: "Intermediate" },
  ],
  "Software Engineer": [
    { name: "Data Structures & Algorithms", description: "Efficient problem-solving fundamentals", level: "Advanced" },
    { name: "System Design", description: "Architect scalable systems", level: "Advanced" },
    { name: "JavaScript/TypeScript", description: "Core languages for modern software", level: "Advanced" },
    { name: "Git & Version Control", description: "Collaborate and manage code", level: "Intermediate" },
    { name: "REST APIs", description: "Design and consume web services", level: "Intermediate" },
    { name: "Testing", description: "Unit, integration, and E2E testing", level: "Intermediate" },
  ],
  "Backend Developer": [
    { name: "Node.js / Python / Java", description: "Server-side programming languages", level: "Advanced" },
    { name: "Databases", description: "PostgreSQL, MongoDB, Redis", level: "Advanced" },
    { name: "REST & GraphQL APIs", description: "API design and implementation", level: "Advanced" },
    { name: "Authentication", description: "JWT, OAuth, session management", level: "Intermediate" },
    { name: "Docker", description: "Containerization for deployment", level: "Intermediate" },
    { name: "Microservices", description: "Distributed architecture patterns", level: "Intermediate" },
  ],
  "Frontend Developer": [
    { name: "HTML & CSS", description: "Semantic markup and modern styling", level: "Advanced" },
    { name: "JavaScript/TypeScript", description: "Client-side logic and interactivity", level: "Advanced" },
    { name: "React / Vue / Angular", description: "Modern frontend frameworks", level: "Advanced" },
    { name: "Responsive Design", description: "Mobile-first, cross-browser layouts", level: "Intermediate" },
    { name: "State Management", description: "Redux, Zustand, Context API", level: "Intermediate" },
    { name: "Performance Optimization", description: "Lazy loading, code splitting, caching", level: "Intermediate" },
  ],
  "Full Stack Developer": [
    { name: "React / Next.js", description: "Frontend framework proficiency", level: "Advanced" },
    { name: "Node.js / Express", description: "Backend API development", level: "Advanced" },
    { name: "Databases", description: "SQL and NoSQL database design", level: "Intermediate" },
    { name: "Authentication", description: "OAuth, JWT, session management", level: "Intermediate" },
    { name: "DevOps Basics", description: "CI/CD, Docker, cloud deployment", level: "Intermediate" },
    { name: "TypeScript", description: "Type-safe full stack development", level: "Intermediate" },
  ],
  "React Developer": [
    { name: "React", description: "Component architecture and hooks", level: "Advanced" },
    { name: "TypeScript", description: "Type-safe React development", level: "Advanced" },
    { name: "State Management", description: "Redux, Zustand, React Query", level: "Advanced" },
    { name: "Next.js", description: "SSR, SSG, and API routes", level: "Intermediate" },
    { name: "Testing", description: "Jest, React Testing Library", level: "Intermediate" },
    { name: "Tailwind CSS", description: "Utility-first styling", level: "Intermediate" },
  ],
  "Django Developer": [
    { name: "Python", description: "Core Django programming language", level: "Advanced" },
    { name: "Django Framework", description: "MVT architecture and ORM", level: "Advanced" },
    { name: "Django REST Framework", description: "Build REST APIs", level: "Advanced" },
    { name: "PostgreSQL", description: "Database design and queries", level: "Intermediate" },
    { name: "Celery", description: "Async task processing", level: "Intermediate" },
    { name: "Docker", description: "Containerized deployment", level: "Intermediate" },
  ],
  "Python Developer": [
    { name: "Python", description: "Advanced Python programming", level: "Advanced" },
    { name: "Flask / FastAPI", description: "Web framework development", level: "Advanced" },
    { name: "OOP & Design Patterns", description: "Clean, maintainable code", level: "Intermediate" },
    { name: "Database Integration", description: "SQLAlchemy, ORMs", level: "Intermediate" },
    { name: "Testing", description: "pytest, unittest frameworks", level: "Intermediate" },
    { name: "Automation & Scripting", description: "Task automation with Python", level: "Intermediate" },
  ],
  "Java Developer": [
    { name: "Core Java", description: "OOP, collections, multithreading", level: "Advanced" },
    { name: "Spring Boot", description: "Enterprise application framework", level: "Advanced" },
    { name: "JPA / Hibernate", description: "ORM and database interactions", level: "Intermediate" },
    { name: "Microservices", description: "Distributed system architecture", level: "Intermediate" },
    { name: "Maven / Gradle", description: "Build and dependency management", level: "Intermediate" },
    { name: "JUnit", description: "Unit testing framework", level: "Intermediate" },
  ],
  "DevOps Engineer": [
    { name: "Docker", description: "Containerize applications", level: "Advanced" },
    { name: "Kubernetes", description: "Container orchestration at scale", level: "Advanced" },
    { name: "CI/CD", description: "Automate build, test, deploy pipelines", level: "Advanced" },
    { name: "AWS / Azure / GCP", description: "Cloud infrastructure management", level: "Intermediate" },
    { name: "Terraform", description: "Infrastructure as Code", level: "Intermediate" },
    { name: "Linux & Shell", description: "Command-line and scripting", level: "Intermediate" },
  ],
  "Cloud Engineer": [
    { name: "AWS / Azure / GCP", description: "Multi-cloud architecture", level: "Advanced" },
    { name: "Terraform / CloudFormation", description: "Infrastructure as Code", level: "Advanced" },
    { name: "Networking", description: "VPC, load balancers, DNS", level: "Intermediate" },
    { name: "Serverless", description: "Lambda, Cloud Functions", level: "Intermediate" },
    { name: "Monitoring", description: "CloudWatch, Datadog, Grafana", level: "Intermediate" },
    { name: "Security", description: "IAM, encryption, compliance", level: "Intermediate" },
  ],
  "Cybersecurity Analyst": [
    { name: "Network Security", description: "Firewalls, IDS/IPS, VPNs", level: "Advanced" },
    { name: "SIEM Tools", description: "Splunk, QRadar, log analysis", level: "Advanced" },
    { name: "Vulnerability Assessment", description: "Scanning and risk analysis", level: "Intermediate" },
    { name: "Incident Response", description: "Threat detection and mitigation", level: "Intermediate" },
    { name: "Linux", description: "Command-line security operations", level: "Intermediate" },
    { name: "Compliance", description: "GDPR, HIPAA, ISO 27001", level: "Beginner" },
  ],
  "Ethical Hacker": [
    { name: "Penetration Testing", description: "Web, network, and app pentesting", level: "Advanced" },
    { name: "Kali Linux", description: "Security testing distribution", level: "Advanced" },
    { name: "OWASP Top 10", description: "Common web vulnerabilities", level: "Advanced" },
    { name: "Burp Suite", description: "Web application security testing", level: "Intermediate" },
    { name: "Python Scripting", description: "Custom exploit development", level: "Intermediate" },
    { name: "Networking", description: "TCP/IP, DNS, protocols", level: "Intermediate" },
  ],
  "Blockchain Developer": [
    { name: "Solidity", description: "Ethereum smart contract language", level: "Advanced" },
    { name: "Web3.js / Ethers.js", description: "Blockchain interaction libraries", level: "Advanced" },
    { name: "Smart Contracts", description: "DeFi, NFT, DAO development", level: "Advanced" },
    { name: "Cryptography", description: "Hashing, encryption, digital signatures", level: "Intermediate" },
    { name: "Hardhat / Truffle", description: "Development and testing frameworks", level: "Intermediate" },
    { name: "DApp Architecture", description: "Decentralized application design", level: "Intermediate" },
  ],
  "Mobile App Developer": [
    { name: "React Native / Flutter", description: "Cross-platform mobile frameworks", level: "Advanced" },
    { name: "JavaScript / Dart", description: "Mobile app programming languages", level: "Advanced" },
    { name: "REST APIs", description: "Backend integration", level: "Intermediate" },
    { name: "State Management", description: "Redux, Provider, Riverpod", level: "Intermediate" },
    { name: "App Store Deployment", description: "Publishing to Play Store / App Store", level: "Intermediate" },
    { name: "UI/UX Mobile", description: "Mobile-first design patterns", level: "Intermediate" },
  ],
  "Android Developer": [
    { name: "Kotlin", description: "Modern Android development language", level: "Advanced" },
    { name: "Jetpack Compose", description: "Declarative UI toolkit", level: "Advanced" },
    { name: "Android SDK", description: "Platform APIs and lifecycle", level: "Advanced" },
    { name: "Room / SQLite", description: "Local database management", level: "Intermediate" },
    { name: "Retrofit", description: "Network requests and API calls", level: "Intermediate" },
    { name: "MVVM Architecture", description: "Clean architecture patterns", level: "Intermediate" },
  ],
  "iOS Developer": [
    { name: "Swift", description: "Modern iOS programming language", level: "Advanced" },
    { name: "SwiftUI", description: "Declarative UI framework", level: "Advanced" },
    { name: "UIKit", description: "Traditional iOS UI framework", level: "Intermediate" },
    { name: "Core Data", description: "Persistence framework", level: "Intermediate" },
    { name: "Combine", description: "Reactive programming framework", level: "Intermediate" },
    { name: "Xcode", description: "IDE and build tools", level: "Intermediate" },
  ],
  "UI/UX Designer": [
    { name: "Figma", description: "Industry-standard design tool", level: "Advanced" },
    { name: "User Research", description: "Interviews, surveys, usability testing", level: "Intermediate" },
    { name: "Wireframing", description: "Low-fidelity layout ideation", level: "Intermediate" },
    { name: "Design Systems", description: "Reusable component libraries", level: "Advanced" },
    { name: "Accessibility", description: "WCAG guidelines for inclusive design", level: "Intermediate" },
    { name: "Interaction Design", description: "Micro-interactions and motion", level: "Intermediate" },
  ],
  "Product Manager": [
    { name: "Product Strategy", description: "Vision, roadmap, go-to-market", level: "Advanced" },
    { name: "User Stories", description: "Translate requirements into tickets", level: "Intermediate" },
    { name: "Data Analytics", description: "Metrics-driven product decisions", level: "Intermediate" },
    { name: "Stakeholder Management", description: "Align engineering, design, business", level: "Intermediate" },
    { name: "A/B Testing", description: "Experiment-driven optimization", level: "Intermediate" },
    { name: "Agile / Scrum", description: "Sprint management and iteration", level: "Intermediate" },
  ],
  "QA Engineer": [
    { name: "Test Automation", description: "Selenium, Cypress, Playwright", level: "Advanced" },
    { name: "Manual Testing", description: "Exploratory and functional testing", level: "Intermediate" },
    { name: "API Testing", description: "Postman, REST Assured", level: "Intermediate" },
    { name: "Performance Testing", description: "JMeter, k6 load testing", level: "Intermediate" },
    { name: "CI/CD Integration", description: "Integrate tests into pipelines", level: "Intermediate" },
    { name: "Bug Tracking", description: "Jira, Bugzilla defect management", level: "Beginner" },
  ],
  "Automation Tester": [
    { name: "Selenium", description: "Browser automation framework", level: "Advanced" },
    { name: "Cypress / Playwright", description: "Modern E2E testing tools", level: "Advanced" },
    { name: "Java / Python", description: "Test scripting languages", level: "Intermediate" },
    { name: "TestNG / JUnit", description: "Test execution frameworks", level: "Intermediate" },
    { name: "CI/CD", description: "Jenkins, GitHub Actions pipelines", level: "Intermediate" },
    { name: "BDD", description: "Cucumber, Gherkin behavior-driven tests", level: "Intermediate" },
  ],
  "Game Developer": [
    { name: "Unity", description: "C# game engine development", level: "Advanced" },
    { name: "Unreal Engine", description: "C++ / Blueprints game development", level: "Advanced" },
    { name: "C# / C++", description: "Game programming languages", level: "Advanced" },
    { name: "Game Physics", description: "Collision detection, rigid body dynamics", level: "Intermediate" },
    { name: "3D Modeling Basics", description: "Blender, asset creation", level: "Beginner" },
    { name: "Shader Programming", description: "HLSL/GLSL visual effects", level: "Intermediate" },
  ],
  "Embedded Systems Engineer": [
    { name: "C / C++", description: "Low-level programming languages", level: "Advanced" },
    { name: "Microcontrollers", description: "ARM, AVR, STM32 platforms", level: "Advanced" },
    { name: "RTOS", description: "FreeRTOS, Zephyr real-time OS", level: "Intermediate" },
    { name: "Communication Protocols", description: "SPI, I2C, UART, CAN", level: "Intermediate" },
    { name: "PCB Design", description: "KiCad, Altium schematic design", level: "Beginner" },
    { name: "Debugging", description: "JTAG, oscilloscope, logic analyzer", level: "Intermediate" },
  ],
  "IoT Engineer": [
    { name: "Embedded C", description: "Firmware development", level: "Advanced" },
    { name: "MQTT / CoAP", description: "IoT communication protocols", level: "Advanced" },
    { name: "Cloud IoT", description: "AWS IoT, Azure IoT Hub", level: "Intermediate" },
    { name: "Sensor Integration", description: "Temperature, motion, GPS sensors", level: "Intermediate" },
    { name: "Python", description: "Prototyping and data processing", level: "Intermediate" },
    { name: "Edge Computing", description: "Process data at the edge", level: "Intermediate" },
  ],
  "Robotics Engineer": [
    { name: "ROS", description: "Robot Operating System framework", level: "Advanced" },
    { name: "C++ / Python", description: "Robotics programming languages", level: "Advanced" },
    { name: "Computer Vision", description: "OpenCV, object detection", level: "Intermediate" },
    { name: "Control Systems", description: "PID controllers, kinematics", level: "Advanced" },
    { name: "Sensors & Actuators", description: "LIDAR, IMU, servo motors", level: "Intermediate" },
    { name: "Simulation", description: "Gazebo, V-REP simulation tools", level: "Intermediate" },
  ],
  "AR/VR Developer": [
    { name: "Unity / Unreal", description: "XR development engines", level: "Advanced" },
    { name: "C# / C++", description: "XR programming languages", level: "Advanced" },
    { name: "ARCore / ARKit", description: "Mobile AR SDKs", level: "Intermediate" },
    { name: "3D Mathematics", description: "Quaternions, transforms, vectors", level: "Intermediate" },
    { name: "Spatial Audio", description: "3D audio for immersive experiences", level: "Beginner" },
    { name: "OpenXR", description: "Cross-platform XR standard", level: "Intermediate" },
  ],
};

// Learning resources per role
export const ROLE_RESOURCES: Record<RoleName, LearningResource[]> = {
  "Data Scientist": [
    { title: "Python for Data Science - Full Course", description: "Complete beginner-to-advanced Python for data analysis", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", source: "YouTube" },
    { title: "Machine Learning A-Z", description: "Hands-on ML with Python & R", url: "https://www.udemy.com/course/machinelearning/", source: "Udemy" },
    { title: "IBM Data Science Professional Certificate", description: "9-course series covering the full pipeline", url: "https://www.coursera.org/professional-certificates/ibm-data-science", source: "Coursera" },
    { title: "Statistics Fundamentals", description: "StatQuest visual stats breakdown", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9", source: "YouTube" },
  ],
  "Machine Learning Engineer": [
    { title: "Deep Learning Specialization", description: "Andrew Ng's foundational deep learning", url: "https://www.coursera.org/specializations/deep-learning", source: "Coursera" },
    { title: "PyTorch for Deep Learning", description: "Full course from freeCodeCamp", url: "https://www.youtube.com/watch?v=V_xro1bcAuI", source: "YouTube" },
    { title: "MLOps Specialization", description: "Production ML systems", url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops", source: "Coursera" },
    { title: "TensorFlow Developer Certificate", description: "Official Google TensorFlow prep", url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice", source: "Coursera" },
  ],
  "AI Engineer": [
    { title: "AI For Everyone", description: "Andrew Ng's non-technical AI intro", url: "https://www.coursera.org/learn/ai-for-everyone", source: "Coursera" },
    { title: "Generative AI Full Course", description: "LLMs, prompt engineering, fine-tuning", url: "https://www.youtube.com/watch?v=mEsleV16qdo", source: "YouTube" },
    { title: "LangChain & LLM App Development", description: "Build AI apps with LangChain", url: "https://www.udemy.com/course/langchain/", source: "Udemy" },
    { title: "Hugging Face NLP Course", description: "Transformers and NLP pipelines", url: "https://huggingface.co/course", source: "Other" },
  ],
  "Deep Learning Engineer": [
    { title: "Deep Learning Specialization", description: "CNNs, RNNs, and optimization", url: "https://www.coursera.org/specializations/deep-learning", source: "Coursera" },
    { title: "PyTorch Tutorials", description: "Official PyTorch learning path", url: "https://www.youtube.com/watch?v=c36lUUr864M", source: "YouTube" },
    { title: "MIT Deep Learning", description: "MIT's free deep learning lectures", url: "https://www.youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI", source: "YouTube" },
    { title: "Fast.ai Practical Deep Learning", description: "Top-down practical DL course", url: "https://www.fast.ai/", source: "Other" },
  ],
  "NLP Engineer": [
    { title: "Stanford CS224N: NLP with Deep Learning", description: "Stanford's NLP course", url: "https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ", source: "YouTube" },
    { title: "Hugging Face Course", description: "Transformers, tokenizers, fine-tuning", url: "https://huggingface.co/course", source: "Other" },
    { title: "NLP Specialization", description: "DeepLearning.AI NLP courses", url: "https://www.coursera.org/specializations/natural-language-processing", source: "Coursera" },
    { title: "SpaCy Advanced NLP", description: "Production NLP with SpaCy", url: "https://www.youtube.com/watch?v=dIUTsFT2MeQ", source: "YouTube" },
  ],
  "Data Analyst": [
    { title: "Google Data Analytics Certificate", description: "Professional analytics certification", url: "https://www.coursera.org/professional-certificates/google-data-analytics", source: "Coursera" },
    { title: "SQL for Data Analysis", description: "Complete SQL bootcamp", url: "https://www.udemy.com/course/the-complete-sql-bootcamp/", source: "Udemy" },
    { title: "Excel to Power BI", description: "Business intelligence dashboard creation", url: "https://www.youtube.com/watch?v=AGrl-H87pRU", source: "YouTube" },
    { title: "Data Analysis with Python", description: "FreeCodeCamp certification", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/", source: "FreeCodeCamp" },
  ],
  "Business Analyst": [
    { title: "Business Analysis Fundamentals", description: "IIBA-aligned BA course", url: "https://www.udemy.com/course/business-analysis-fundamentals/", source: "Udemy" },
    { title: "Google Data Analytics", description: "Analytics for business decisions", url: "https://www.coursera.org/professional-certificates/google-data-analytics", source: "Coursera" },
    { title: "SQL for Business Analysts", description: "Data extraction and reporting", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", source: "YouTube" },
    { title: "Business Analysis with NPTEL", description: "IIT-based analytics course", url: "https://nptel.ac.in/courses/110/106/110106141/", source: "NPTEL" },
  ],
  "Software Engineer": [
    { title: "CS50 Introduction to CS", description: "Harvard's legendary intro CS course", url: "https://www.edx.org/course/cs50s-introduction-to-computer-science", source: "EdX" },
    { title: "DSA Bootcamp", description: "Complete data structures & algorithms", url: "https://www.youtube.com/watch?v=8hly31xKli0", source: "YouTube" },
    { title: "System Design Interview Prep", description: "Comprehensive system design concepts", url: "https://www.youtube.com/c/SystemDesignInterview", source: "YouTube" },
    { title: "The Complete Web Developer Bootcamp", description: "Full-stack web development", url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/", source: "Udemy" },
  ],
  "Backend Developer": [
    { title: "Node.js Complete Guide", description: "REST APIs, GraphQL, authentication", url: "https://www.udemy.com/course/nodejs-the-complete-guide/", source: "Udemy" },
    { title: "Backend Development Roadmap", description: "Complete backend learning path", url: "https://www.youtube.com/watch?v=XBu54nfzxAQ", source: "YouTube" },
    { title: "PostgreSQL Full Course", description: "Database design and optimization", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", source: "YouTube" },
    { title: "Microservices with Node.js", description: "Building distributed systems", url: "https://www.udemy.com/course/microservices-with-node-js-and-react/", source: "Udemy" },
  ],
  "Frontend Developer": [
    { title: "The Odin Project", description: "Free full-stack web dev curriculum", url: "https://www.theodinproject.com/", source: "Other" },
    { title: "React - The Complete Guide", description: "Comprehensive React course", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", source: "Udemy" },
    { title: "CSS for JavaScript Developers", description: "Master CSS layout and animations", url: "https://www.youtube.com/watch?v=OXGznpKZ_sA", source: "YouTube" },
    { title: "Responsive Web Design", description: "FreeCodeCamp certification", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", source: "FreeCodeCamp" },
  ],
  "Full Stack Developer": [
    { title: "Full Stack Open", description: "University of Helsinki full stack course", url: "https://fullstackopen.com/en/", source: "Other" },
    { title: "MERN Stack Tutorial", description: "MongoDB, Express, React, Node", url: "https://www.youtube.com/watch?v=7CqJlxBYj-M", source: "YouTube" },
    { title: "Next.js Complete Course", description: "Full stack React framework", url: "https://www.udemy.com/course/nextjs-react-the-complete-guide/", source: "Udemy" },
    { title: "Full Stack Development with NPTEL", description: "IIT full stack course", url: "https://nptel.ac.in/courses/106/106/106106272/", source: "NPTEL" },
  ],
  "React Developer": [
    { title: "React - The Complete Guide", description: "Hooks, Redux, Next.js", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", source: "Udemy" },
    { title: "React Tutorial for Beginners", description: "Full React crash course", url: "https://www.youtube.com/watch?v=SqcY0GlETPk", source: "YouTube" },
    { title: "Next.js 14 Full Course", description: "App router, server components", url: "https://www.youtube.com/watch?v=wm5gMKuwSYk", source: "YouTube" },
    { title: "Testing React Applications", description: "Jest and React Testing Library", url: "https://www.udemy.com/course/react-testing-library/", source: "Udemy" },
  ],
  "Django Developer": [
    { title: "Django for Beginners", description: "Complete Django web framework", url: "https://www.youtube.com/watch?v=F5mRW0jo-U4", source: "YouTube" },
    { title: "Django REST Framework", description: "Build APIs with DRF", url: "https://www.udemy.com/course/django-python-advanced/", source: "Udemy" },
    { title: "Python Django - Full Course", description: "FreeCodeCamp Django tutorial", url: "https://www.youtube.com/watch?v=o0XbHvKxw7Y", source: "YouTube" },
    { title: "Django with NPTEL", description: "IIT Django development course", url: "https://nptel.ac.in/courses/106/106/106106212/", source: "NPTEL" },
  ],
  "Python Developer": [
    { title: "100 Days of Code - Python", description: "Complete Python bootcamp", url: "https://www.udemy.com/course/100-days-of-code/", source: "Udemy" },
    { title: "Python Full Course", description: "Beginner to advanced Python", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", source: "YouTube" },
    { title: "Python for Everybody", description: "University of Michigan Python course", url: "https://www.coursera.org/specializations/python", source: "Coursera" },
    { title: "FastAPI Complete Tutorial", description: "Modern Python API framework", url: "https://www.youtube.com/watch?v=0sOvCWFmrtA", source: "YouTube" },
  ],
  "Java Developer": [
    { title: "Java Programming Masterclass", description: "Complete Java from zero to hero", url: "https://www.udemy.com/course/java-the-complete-java-developer-course/", source: "Udemy" },
    { title: "Spring Boot Full Course", description: "Enterprise Java development", url: "https://www.youtube.com/watch?v=9SGDpanrc8U", source: "YouTube" },
    { title: "Java DSA", description: "Data structures in Java", url: "https://www.youtube.com/watch?v=rZ41y93P2Qo", source: "YouTube" },
    { title: "Java with NPTEL", description: "IIT Java programming course", url: "https://nptel.ac.in/courses/106/105/106105191/", source: "NPTEL" },
  ],
  "DevOps Engineer": [
    { title: "Docker & Kubernetes Practical Guide", description: "Hands-on container orchestration", url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/", source: "Udemy" },
    { title: "AWS Certified Solutions Architect", description: "Most popular cloud certification", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", source: "Udemy" },
    { title: "DevOps Full Course", description: "Complete CI/CD pipeline tutorial", url: "https://www.youtube.com/watch?v=PGyhBwLyK2U", source: "YouTube" },
    { title: "Terraform on AWS", description: "Infrastructure as Code", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", source: "YouTube" },
  ],
  "Cloud Engineer": [
    { title: "AWS Cloud Practitioner", description: "AWS fundamentals certification", url: "https://www.udemy.com/course/aws-certified-cloud-practitioner-new/", source: "Udemy" },
    { title: "Google Cloud Associate Engineer", description: "GCP certification prep", url: "https://www.coursera.org/professional-certificates/cloud-engineering-gcp", source: "Coursera" },
    { title: "Azure Fundamentals AZ-900", description: "Microsoft Azure certification", url: "https://www.youtube.com/watch?v=NKEFWlXUnSg", source: "YouTube" },
    { title: "Cloud Computing with NPTEL", description: "IIT cloud computing course", url: "https://nptel.ac.in/courses/106/105/106105167/", source: "NPTEL" },
  ],
  "Cybersecurity Analyst": [
    { title: "CompTIA Security+ Full Course", description: "Industry-standard security cert", url: "https://www.youtube.com/watch?v=O4pJeXgOJDs", source: "YouTube" },
    { title: "Google Cybersecurity Certificate", description: "Professional cybersecurity program", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", source: "Coursera" },
    { title: "Cybersecurity for Beginners", description: "Complete beginner's course", url: "https://www.simplilearn.com/learn-cyber-security-basics-skillup", source: "Simplilearn" },
    { title: "Network Security with NPTEL", description: "IIT network security course", url: "https://nptel.ac.in/courses/106/105/106105183/", source: "NPTEL" },
  ],
  "Ethical Hacker": [
    { title: "Ethical Hacking Full Course", description: "Learn ethical hacking from scratch", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", source: "YouTube" },
    { title: "CEH Certification Prep", description: "Certified Ethical Hacker course", url: "https://www.udemy.com/course/certified-ethical-hacker/", source: "Udemy" },
    { title: "Bug Bounty Hunting", description: "Real-world vulnerability hunting", url: "https://www.youtube.com/watch?v=lqVUJFGHRos", source: "YouTube" },
    { title: "Penetration Testing with Simplilearn", description: "Professional pentesting course", url: "https://www.simplilearn.com/learn-penetration-testing-skillup", source: "Simplilearn" },
  ],
  "Blockchain Developer": [
    { title: "Blockchain Full Course", description: "Solidity, Web3, smart contracts", url: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", source: "YouTube" },
    { title: "Ethereum and Solidity", description: "Complete blockchain developer course", url: "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/", source: "Udemy" },
    { title: "Blockchain Specialization", description: "University of Buffalo blockchain", url: "https://www.coursera.org/specializations/blockchain", source: "Coursera" },
    { title: "Blockchain with NPTEL", description: "IIT blockchain technology course", url: "https://nptel.ac.in/courses/106/105/106105235/", source: "NPTEL" },
  ],
  "Mobile App Developer": [
    { title: "Flutter & Dart Complete Guide", description: "Cross-platform mobile development", url: "https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/", source: "Udemy" },
    { title: "React Native Full Course", description: "Build mobile apps with React", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc", source: "YouTube" },
    { title: "Mobile App Dev Specialization", description: "Vanderbilt University course", url: "https://www.coursera.org/specializations/android-app-development", source: "Coursera" },
    { title: "Flutter Crash Course", description: "Quick start mobile development", url: "https://www.youtube.com/watch?v=VPvVD8t02U8", source: "YouTube" },
  ],
  "Android Developer": [
    { title: "Android Development with Kotlin", description: "Official Google Android course", url: "https://www.udemy.com/course/devslopes-android-kotlin/", source: "Udemy" },
    { title: "Jetpack Compose Tutorial", description: "Modern Android UI toolkit", url: "https://www.youtube.com/watch?v=cDabx3SjuOY", source: "YouTube" },
    { title: "Android Developer Nanodegree", description: "Complete Android learning path", url: "https://www.udacity.com/course/android-developer-nanodegree--nd801", source: "Other" },
    { title: "Android with NPTEL", description: "IIT Android development course", url: "https://nptel.ac.in/courses/106/106/106106156/", source: "NPTEL" },
  ],
  "iOS Developer": [
    { title: "iOS & Swift Complete Course", description: "Build iOS apps from scratch", url: "https://www.udemy.com/course/ios-13-app-development-bootcamp/", source: "Udemy" },
    { title: "SwiftUI Tutorial", description: "Apple's modern UI framework", url: "https://www.youtube.com/watch?v=F2ojC6TNwws", source: "YouTube" },
    { title: "Stanford CS193p", description: "Stanford's iOS development course", url: "https://www.youtube.com/playlist?list=PLpGHT1n4-mAtTj9oywMWoBx0dCGd51_yG", source: "YouTube" },
    { title: "iOS Development Specialization", description: "University of Toronto iOS course", url: "https://www.coursera.org/specializations/app-development", source: "Coursera" },
  ],
  "UI/UX Designer": [
    { title: "Google UX Design Certificate", description: "Complete UX design program", url: "https://www.coursera.org/professional-certificates/google-ux-design", source: "Coursera" },
    { title: "Figma UI/UX Tutorial", description: "Full Figma course for beginners", url: "https://www.youtube.com/watch?v=jwCmIBJ8Jtc", source: "YouTube" },
    { title: "Design Systems with Figma", description: "Scalable component libraries", url: "https://www.youtube.com/watch?v=EK-pHkc5EL4", source: "YouTube" },
    { title: "Interaction Design Specialization", description: "UC San Diego UX course", url: "https://www.coursera.org/specializations/interaction-design", source: "Coursera" },
  ],
  "Product Manager": [
    { title: "Digital Product Management", description: "University of Virginia PM course", url: "https://www.coursera.org/specializations/uva-darden-digital-product-management", source: "Coursera" },
    { title: "Product Management 101", description: "Complete PM guide for beginners", url: "https://www.youtube.com/watch?v=bNpx7gpSqbY", source: "YouTube" },
    { title: "Become a Product Manager", description: "Comprehensive PM course", url: "https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/", source: "Udemy" },
    { title: "PM with Simplilearn", description: "Product management certification", url: "https://www.simplilearn.com/product-management-certification-training-course", source: "Simplilearn" },
  ],
  "QA Engineer": [
    { title: "Selenium WebDriver with Java", description: "Complete test automation", url: "https://www.udemy.com/course/selenium-real-time-examplesi/", source: "Udemy" },
    { title: "Cypress E2E Testing", description: "Modern E2E testing framework", url: "https://www.youtube.com/watch?v=u8vMu7viCm8", source: "YouTube" },
    { title: "ISTQB Foundation Level", description: "QA certification prep", url: "https://www.udemy.com/course/istqb-foundation-level/", source: "Udemy" },
    { title: "API Testing with Postman", description: "Complete Postman tutorial", url: "https://www.youtube.com/watch?v=VywxIQ2ZXw4", source: "YouTube" },
  ],
  "Automation Tester": [
    { title: "Selenium Complete Course", description: "Web automation testing", url: "https://www.youtube.com/watch?v=j7VZsCCnptM", source: "YouTube" },
    { title: "Cypress Testing", description: "Modern JavaScript E2E testing", url: "https://www.udemy.com/course/cypress-io/", source: "Udemy" },
    { title: "Test Automation University", description: "Free automation courses", url: "https://testautomationu.applitools.com/", source: "Other" },
    { title: "Playwright Tutorial", description: "Microsoft's testing framework", url: "https://www.youtube.com/watch?v=wGr5rz8WGCE", source: "YouTube" },
  ],
  "Game Developer": [
    { title: "Unity Complete Course", description: "2D/3D game development with Unity", url: "https://www.udemy.com/course/unitycourse2/", source: "Udemy" },
    { title: "Unreal Engine 5 Tutorial", description: "AAA game development", url: "https://www.youtube.com/watch?v=6UlU_FsicK8", source: "YouTube" },
    { title: "Game Design Specialization", description: "Michigan State game design", url: "https://www.coursera.org/specializations/game-design", source: "Coursera" },
    { title: "Godot Engine Full Course", description: "Open-source game engine", url: "https://www.youtube.com/watch?v=S8lMTwSRoRg", source: "YouTube" },
  ],
  "Embedded Systems Engineer": [
    { title: "Embedded Systems with NPTEL", description: "IIT embedded systems course", url: "https://nptel.ac.in/courses/108/105/108105057/", source: "NPTEL" },
    { title: "ARM Microcontroller Programming", description: "Professional embedded development", url: "https://www.udemy.com/course/embedded-systems-bare-metal-programming/", source: "Udemy" },
    { title: "FreeRTOS Tutorial", description: "Real-time OS for embedded", url: "https://www.youtube.com/watch?v=F321087yYy4", source: "YouTube" },
    { title: "Embedded C Programming", description: "Complete embedded C course", url: "https://www.youtube.com/watch?v=4bM87t2NJlI", source: "YouTube" },
  ],
  "IoT Engineer": [
    { title: "IoT Specialization", description: "UC Irvine IoT course series", url: "https://www.coursera.org/specializations/internet-of-things", source: "Coursera" },
    { title: "IoT with NPTEL", description: "IIT IoT foundations course", url: "https://nptel.ac.in/courses/106/105/106105166/", source: "NPTEL" },
    { title: "Raspberry Pi IoT Projects", description: "Hands-on IoT with Pi", url: "https://www.youtube.com/watch?v=RiGJEkaFuIk", source: "YouTube" },
    { title: "AWS IoT Complete Course", description: "Cloud IoT with AWS", url: "https://www.udemy.com/course/aws-iot-with-raspberry-pi-and-python/", source: "Udemy" },
  ],
  "Robotics Engineer": [
    { title: "Modern Robotics Specialization", description: "Northwestern robotics course", url: "https://www.coursera.org/specializations/modernrobotics", source: "Coursera" },
    { title: "ROS2 Tutorial", description: "Robot Operating System 2", url: "https://www.youtube.com/watch?v=0aPbWsyENA8", source: "YouTube" },
    { title: "Robotics with NPTEL", description: "IIT robotics fundamentals", url: "https://nptel.ac.in/courses/112/105/112105249/", source: "NPTEL" },
    { title: "Arduino Robot Projects", description: "Build robots from scratch", url: "https://www.youtube.com/watch?v=1n_KjpMfVR0", source: "YouTube" },
  ],
  "AR/VR Developer": [
    { title: "Unity XR Development", description: "Build AR/VR apps with Unity", url: "https://www.udemy.com/course/unity-xr/", source: "Udemy" },
    { title: "AR Development Full Course", description: "ARCore and ARKit development", url: "https://www.youtube.com/watch?v=WzfDo2Wpxks", source: "YouTube" },
    { title: "VR Development Specialization", description: "University of London VR course", url: "https://www.coursera.org/specializations/virtual-reality", source: "Coursera" },
    { title: "Meta Quest Development", description: "Build for Meta Quest headsets", url: "https://www.youtube.com/watch?v=yxMzAw2Sg5w", source: "YouTube" },
  ],
};

export function getSourceIcon(source: LearningResource["source"]): string {
  switch (source) {
    case "YouTube": return "🎬";
    case "Udemy": return "📚";
    case "Coursera": return "🎓";
    case "EdX": return "🏛️";
    case "FreeCodeCamp": return "⚡";
    case "NPTEL": return "🇮🇳";
    case "Simplilearn": return "📘";
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
    case "NPTEL": return "bg-primary/10 text-primary";
    case "Simplilearn": return "bg-accent/10 text-accent";
    default: return "bg-muted text-muted-foreground";
  }
}
