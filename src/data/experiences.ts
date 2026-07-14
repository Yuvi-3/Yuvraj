export interface EducationEntry {
  institution: string;
  institutionLink?: string;
  degree: string;
  dateRange: string;
  location: string;
  details: string[];
}

export interface WorkEntry {
  company: string;
  companyLink?: string;
  role: string;
  supervisor?: string;
  dateRange: string;
  location: string;
  description?: string;
  bullets: string[];
}

export interface ExperienceSection {
  type: "education" | "work" | "other";
}

export const tldrText =
  'Below are my formal work experiences and educational qualifications. I also contribute to several open-source projects, and I consider that as an "experience" too (see /opensource). Programming can be learnt without any formal degrees; hence, my skills/abilities are not limited to my courses.';

export const education: EducationEntry[] = [
  {
    institution: "IIT Jodhpur",
    institutionLink: "https://iitj.ac.in/Executive-Programs/en/B.Sc-B.S-in-Applied-AI-and-Data-Science",
    degree: "BS in Artificial Intelligence",
    dateRange: "2025 - Present",
    location: "Jodhpur, India",
    details: [
      "Pursuing a Bachelor of Science in Artificial Intelligence at the Indian Institute of Technology Jodhpur.",
      "Core areas: Machine Learning, Deep Learning, Natural Language Processing, Computer Vision, and Reinforcement Learning.",
      "Coursework includes Mathematics foundations, Data Structures & Algorithms, and AI systems design.",
    ],
  },
  {
    institution: "Online Learning & Certifications",
    institutionLink: "#",
    degree: "Continuous Learning in CS, ML, and Quantitative Finance",
    dateRange: "2022 - Present",
    location: "Remote",
    details: [
      "Completed coursework in algorithms, data structures, operating systems, and databases.",
      "Studied machine learning through Stanford CS229, fast.ai, and various MOOCs.",
      "Quantitative finance self-study through Paul Wilmott, Mark Joshi, and CFA-level material.",
      "Active participant in competitive programming and Kaggle competitions.",
    ],
  },
];

export const work: WorkEntry[] = [
  {
    company: "Independent Projects",
    companyLink: "#",
    role: "AI & Quantitative Finance Researcher / Developer",
    dateRange: "2023 - Present",
    location: "Remote",
    description:
      "Working on independent research and development projects at the intersection of AI and quantitative finance.",
    bullets: [
      "Building quantitative trading strategies and backtesting frameworks.",
      "Developing ML pipelines for financial data analysis and prediction.",
      "Creating educational content and tutorials on AI and quantitative finance.",
      "Contributing to open-source AI developer tools and research utilities.",
    ],
  },
];

export const otherWork: WorkEntry[] = [
  {
    company: "CS50 (Harvard)",
    companyLink: "https://cs50.harvard.edu",
    role: "Complete Coursework",
    dateRange: "2023 - 2024",
    location: "Remote",
    bullets: [
      "Completed Harvard's CS50: Introduction to Computer Science.",
      "Covered C, Python, SQL, and web development fundamentals.",
    ],
  },
  {
    company: "MIT MicroMasters in Statistics and Data Science",
    companyLink: "https://micromasters.mit.edu/ds",
    role: "Currently Pursuing",
    dateRange: "2024 - Present",
    location: "Remote",
    bullets: [
      "Enrolled in MIT's MicroMasters program in Statistics and Data Science.",
      "Studying probability, statistics, data analysis, and machine learning fundamentals.",
    ],
  },
  {
    company: "Kaggle",
    companyLink: "https://kaggle.com",
    role: "Competition Participant & Contributor",
    dateRange: "2023 - Present",
    location: "Remote",
    bullets: [
      "Active participant in Kaggle competitions focused on ML and data science.",
      "Built models for tabular data, NLP, and computer vision challenges.",
    ],
  },
  {
    company: "Hyperframes",
    companyLink: "https://github.com/heygen-com/hyperframes",
    role: "Open Source Contributor",
    dateRange: "2024 - Present",
    location: "Remote",
    bullets: [
      "Contributing to Hyperframes, an open-source AI-powered framework.",
      "Working on improving developer experience and tooling.",
    ],
  },
  {
    company: "Kyoto University",
    companyLink: "https://www.kyoto-u.ac.jp",
    role: "Hybrid Apprenticeship",
    dateRange: "2024 - 2025",
    location: "Kyoto, Japan (Hybrid)",
    bullets: [
      "Participated in a hybrid apprenticeship program at Kyoto University.",
      "Worked on research and projects bridging AI and traditional academic disciplines.",
    ],
  },
  {
    company: "Harvard CS50 — Servers Everywhere",
    companyLink: "https://cs50.harvard.edu",
    role: "Volunteer",
    dateRange: "2024 - Present",
    location: "Remote",
    bullets: [
      "Volunteered for Harvard's CS50 Servers Everywhere initiative.",
      "Helped set up and manage server infrastructure for educational purposes.",
    ],
  },
  {
    company: "SkillCraft Technologies",
    companyLink: "https://skillcrafttech.com/",
    role: "Intern — AI & Software Development",
    dateRange: "2024 - 2024",
    location: "India",
    description:
      "Worked on AI-driven solutions and software development projects, gaining hands-on experience in building production-grade applications.",
    bullets: [
      "Developed and deployed machine learning models for real-world use cases.",
      "Built scalable software solutions using modern web technologies.",
      "Collaborated with cross-functional teams on product features and improvements.",
      "Gained experience in agile development practices and code review workflows.",
    ],
  },
];