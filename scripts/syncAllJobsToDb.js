import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const allPortalJobs = [
  {
    title: "Senior React / Frontend Engineer",
    slug: "senior-react-frontend-engineer-bengaluru",
    company: "Infosys Technologies",
    companySlug: "infosys-technologies",
    logoText: "INF",
    logoBg: "#0056B3",
    location: "Bengaluru",
    workplaceType: "Hybrid",
    workMode: "Hybrid",
    category: "Information Technology",
    categorySlug: "it-software",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 1400000,
    salaryMax: 2200000,
    salaryMinLpa: 14,
    salaryMaxLpa: 22,
    salary: "₹14,00,000 - ₹22,00,000 PA",
    salaryDisplay: "₹14.0 - ₹22.0 LPA",
    experience: "4 - 7 Years",
    expBracket: "Mid-Level (3-6 yrs)",
    qualification: "B.Tech / B.E. / MCA in Computer Science",
    vacancies: 5,
    featured: true,
    urgent: true,
    postedDate: "1 Day Ago",
    deadline: "15 Oct 2026",
    overview: "We are seeking an experienced Senior React Developer to spearhead modern client-facing applications, optimize web performance, and architect reusable UI component libraries for enterprise clients.",
    description: "We are seeking an experienced Senior React Developer to spearhead modern client-facing applications, optimize web performance, and architect reusable UI component libraries for enterprise clients.",
    responsibilities: [
      "Architect and build high-performance, modular React & TypeScript web applications.",
      "Collaborate with UX designers, product managers, and backend engineers to translate Figma designs into pixel-perfect code.",
      "Optimize frontend asset loading, Core Web Vitals, and state management using Redux Toolkit / Zustand.",
      "Conduct code reviews and mentor junior developers in modern frontend best practices.",
      "Implement comprehensive automated unit and integration tests using Vitest and React Testing Library."
    ],
    requirements: [
      "4+ years of hands-on experience in React.js, TypeScript, Next.js, and modern CSS/Tailwind.",
      "Deep understanding of browser rendering engines, DOM manipulation, and asynchronous workflows.",
      "Demonstrated experience with RESTful APIs, GraphQL endpoints, and WebSockets.",
      "Strong grasp of CI/CD pipelines, Git workflows, and build tools (Vite, Webpack).",
      "Excellent communication and problem-solving abilities."
    ],
    benefits: [
      "Annual Performance Bonus (Up to 15%)",
      "Comprehensive Family Medical Insurance (₹5 Lakhs)",
      "Hybrid 3-day office flexibility",
      "Internet and home office setup reimbursement",
      "Paid certifications and continuous learning sponsorship"
    ],
    skills: ["React.js", "TypeScript", "Next.js", "Tailwind CSS", "Redux Toolkit", "REST APIs", "Jest"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "Plant Production Supervisor",
    slug: "production-supervisor-haridwar-tata",
    company: "Tata Motors Limited",
    companySlug: "tata-motors",
    logoText: "TATA",
    logoBg: "#090D16",
    location: "Haridwar",
    workplaceType: "On-site",
    workMode: "On-site",
    category: "Manufacturing & Engineering",
    categorySlug: "manufacturing-engineering",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 450000,
    salaryMax: 720000,
    salaryMinLpa: 4.5,
    salaryMaxLpa: 7.2,
    salary: "₹4,50,000 - ₹7,20,000 PA",
    salaryDisplay: "₹4.5 - ₹7.2 LPA",
    experience: "3 - 6 Years",
    expBracket: "Mid-Level (3-6 yrs)",
    qualification: "Diploma / B.Tech in Mechanical or Automobile Engineering",
    vacancies: 4,
    featured: true,
    urgent: false,
    postedDate: "2 Days Ago",
    deadline: "28 Oct 2026",
    overview: "Tata Motors Haridwar Plant is hiring a seasoned Production Supervisor to oversee chassis assembly line operations, uphold 5S standards, and drive daily target outputs with zero safety compromises.",
    description: "Tata Motors Haridwar Plant is hiring a seasoned Production Supervisor to oversee chassis assembly line operations, uphold 5S standards, and drive daily target outputs with zero safety compromises.",
    responsibilities: [
      "Manage end-to-end shift operations for vehicle assembly lines ensuring output targets are met.",
      "Monitor line cycle times, minimize downtime, and resolve immediate mechanical or line bottlenecks.",
      "Enforce strict industrial safety protocols, PPE usage, and 5S cleanliness guidelines.",
      "Coordinate with Quality Assurance to resolve component defects and minimize rework percentage.",
      "Prepare daily production shift logs, manpower utilization reports, and OEE metrics in SAP."
    ],
    requirements: [
      "Diploma or B.Tech in Mechanical / Production / Automotive Engineering.",
      "3+ years in automotive or heavy machinery manufacturing plant environment.",
      "Strong understanding of Kaizen, Lean Manufacturing, Six Sigma, and Poka-Yoke techniques.",
      "Proven leadership skills in supervising shop-floor operators and contract technicians.",
      "Familiarity with SAP PP / ERP production entries."
    ],
    benefits: [
      "Company Subsidized Canteen & Transport Facility",
      "Statutory PF, ESI & Annual Gratuity",
      "Annual Performance Production Bonus",
      "Comprehensive Medical & Accident Insurance",
      "Overtime & Shift Allowances"
    ],
    skills: ["Production Planning", "Lean Manufacturing", "5S & Kaizen", "Shop Floor Management", "SAP ERP", "Safety Compliance"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "Senior QA / QC Officer (Formulations)",
    slug: "qa-qc-chemist-pharma-roorkee",
    company: "Sun Pharmaceutical Industries",
    companySlug: "sun-pharma",
    logoText: "SUN",
    logoBg: "#0056B3",
    location: "Roorkee",
    workplaceType: "On-site",
    workMode: "On-site",
    category: "Healthcare & Pharma",
    categorySlug: "pharma-healthcare",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 500000,
    salaryMax: 850000,
    salaryMinLpa: 5,
    salaryMaxLpa: 8.5,
    salary: "₹5,00,000 - ₹8,50,000 PA",
    salaryDisplay: "₹5.0 - ₹8.5 LPA",
    experience: "2 - 5 Years",
    expBracket: "Junior (1-3 yrs)",
    qualification: "M.Sc (Chemistry) / B.Pharm / M.Pharm",
    vacancies: 6,
    featured: true,
    urgent: true,
    postedDate: "Just Now",
    deadline: "10 Nov 2026",
    overview: "Looking for diligent Quality Control Chemists for our Roorkee oral solid dosage (OSD) manufacturing unit to perform chromatographic analysis, raw material testing, and documentation in strict compliance with cGMP & USFDA standards.",
    description: "Looking for diligent Quality Control Chemists for our Roorkee oral solid dosage (OSD) manufacturing unit to perform chromatographic analysis, raw material testing, and documentation in strict compliance with cGMP & USFDA standards.",
    responsibilities: [
      "Perform HPLC, GC, UV-Visible, and Dissolution testing for raw materials, in-process samples, and finished dosage forms.",
      "Maintain analytical test records, logbooks, and calibration data in compliance with 21 CFR Part 11.",
      "Participate in Out of Specification (OOS) and Out of Trend (OOT) investigations with QA teams.",
      "Execute stability study sample analysis and record temperature/humidity chamber data.",
      "Follow Good Laboratory Practices (GLP) and standard operating procedures (SOPs)."
    ],
    requirements: [
      "M.Sc in Chemistry or B.Pharm / M.Pharm from a recognized university.",
      "2 to 5 years experience in regulated OSD / Injectable pharmaceutical plants.",
      "Proficiency in operating Waters / Empower HPLC software and GC instruments.",
      "Sound knowledge of cGMP, USFDA, ICH guidelines, and pharmacopeial monographs (IP/BP/USP).",
      "Meticulous documentation and analytical precision."
    ],
    benefits: [
      "Statutory PF & ESI Coverage",
      "Free Daily Plant Transportation from Roorkee & Haridwar",
      "Annual Diwali / Performance Bonus",
      "Group Mediclaim with OPD support",
      "Subsidized Meal Facility"
    ],
    skills: ["HPLC", "Gas Chromatography", "GLP / cGMP", "Method Validation", "Stability Testing", "Analytical Chemistry"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "Senior Credit & Risk Analyst",
    slug: "credit-risk-analyst-mumbai-hdfc",
    company: "HDFC Bank",
    companySlug: "hdfc-bank",
    logoText: "HDFC",
    logoBg: "#090D16",
    location: "Mumbai",
    workplaceType: "Hybrid",
    workMode: "Hybrid",
    category: "Banking & Finance",
    categorySlug: "banking-finance",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 1100000,
    salaryMax: 1850000,
    salaryMinLpa: 11,
    salaryMaxLpa: 18.5,
    salary: "₹11,00,000 - ₹18,50,000 PA",
    salaryDisplay: "₹11.0 - ₹18.5 LPA",
    experience: "3 - 6 Years",
    expBracket: "Mid-Level (3-6 yrs)",
    qualification: "CA / MBA (Finance) / CFA",
    vacancies: 3,
    featured: false,
    urgent: false,
    postedDate: "3 Days Ago",
    deadline: "20 Oct 2026",
    overview: "HDFC Bank Corporate Lending team is hiring a Credit Risk Analyst in Mumbai to assess creditworthiness of mid-market and large corporate borrower proposals, financial modeling, and loan structuring.",
    description: "HDFC Bank Corporate Lending team is hiring a Credit Risk Analyst in Mumbai to assess creditworthiness of mid-market and large corporate borrower proposals, financial modeling, and loan structuring.",
    responsibilities: [
      "Analyze corporate financial statements, cash flow viability, balance sheets, and industry risk trends.",
      "Prepare detailed Credit Appraisal Memos (CAM) with financial sensitivity models and recommendations.",
      "Monitor sanctioned accounts for early warning indicators, covenant compliance, and debt service tracking.",
      "Liaise with relationship managers, legal teams, and independent audit agencies during loan appraisal.",
      "Present high-ticket credit proposals to the Risk Committee."
    ],
    requirements: [
      "Chartered Accountant (CA) or MBA Finance from a reputed tier-1/tier-2 institute.",
      "3+ years experience in corporate or commercial banking credit underwriting.",
      "High proficiency in financial modeling (Excel), ratio analysis, and credit score metrics.",
      "Understanding of RBI regulatory guidelines and collateral valuations.",
      "Strong analytical temperament and executive communication skills."
    ],
    benefits: [
      "Preferential Staff Loan Rates (Home & Auto Loans)",
      "Comprehensive Executive Health Insurance",
      "Performance Linked Annual Bonus (20-30%)",
      "Life & Accidental Disability Cover",
      "Retirement Superannuation Fund"
    ],
    skills: ["Credit Appraisal", "Financial Modeling", "Risk Analysis", "Balance Sheet Review", "Corporate Banking", "Excel"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "Full Stack Python / Django Engineer",
    slug: "full-stack-python-engineer-pune",
    company: "Zomato & Blinkit",
    companySlug: "zomato-technologies",
    logoText: "ZOM",
    logoBg: "#0056B3",
    location: "Pune",
    workplaceType: "Remote",
    workMode: "Remote",
    category: "Information Technology",
    categorySlug: "it-software",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 1800000,
    salaryMax: 2800000,
    salaryMinLpa: 18,
    salaryMaxLpa: 28,
    salary: "₹18,00,000 - ₹28,00,000 PA",
    salaryDisplay: "₹18.0 - ₹28.0 LPA",
    experience: "3 - 6 Years",
    expBracket: "Mid-Level (3-6 yrs)",
    qualification: "B.Tech / B.E. in Computer Science or equivalent experience",
    vacancies: 4,
    featured: true,
    urgent: true,
    postedDate: "3 Hours Ago",
    deadline: "05 Nov 2026",
    overview: "Join the core platform team at Zomato/Blinkit building high-throughput logistics dispatch systems, microservices handling millions of daily orders, and lightning-fast developer tooling.",
    description: "Join the core platform team at Zomato/Blinkit building high-throughput logistics dispatch systems, microservices handling millions of daily orders, and lightning-fast developer tooling.",
    responsibilities: [
      "Architect microservices using Python (Django / FastAPI), PostgreSQL, and Redis caching.",
      "Design fault-tolerant event streams using Apache Kafka and RabbitMQ.",
      "Build real-time tracking interfaces using React and WebSockets.",
      "Collaborate with DevOps to deploy containerized services on AWS ECS and Kubernetes.",
      "Optimize SQL query plans and caching layers for sub-100ms API response times under peak order loads."
    ],
    requirements: [
      "3+ years building high-traffic production web backend systems in Python.",
      "Strong command over Django / FastAPI, asynchronous programming (asyncio, Celery).",
      "Solid database fundamentals in PostgreSQL, indexing strategies, and connection pooling.",
      "Experience with distributed systems, Kafka, Redis, and cloud architectures (AWS).",
      "Clean code mindset, strong understanding of data structures and algorithms."
    ],
    benefits: [
      "100% Remote Flexibility with co-working stipend",
      "High Growth ESOP equity grant",
      "Annual Learning & Tech Device budget (₹1.5 Lakhs)",
      "Unlimited Sick Leaves & Wellness days",
      "Top-tier Family Medical Cover"
    ],
    skills: ["Python", "FastAPI", "Django", "PostgreSQL", "Redis", "Kafka", "AWS", "Docker"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "B2B Enterprise Sales Manager",
    slug: "b2b-enterprise-sales-manager-delhi",
    company: "Tech Mahindra",
    companySlug: "tech-mahindra",
    logoText: "TM",
    logoBg: "#0056B3",
    location: "Delhi NCR",
    workplaceType: "Hybrid",
    workMode: "Hybrid",
    category: "Sales & Marketing",
    categorySlug: "sales-marketing",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 1200000,
    salaryMax: 2000000,
    salaryMinLpa: 12,
    salaryMaxLpa: 20,
    salary: "₹12,00,000 - ₹20,00,000 PA",
    salaryDisplay: "₹12.0 - ₹20.0 LPA",
    experience: "5 - 8 Years",
    expBracket: "Mid-Level (3-6 yrs)",
    qualification: "MBA in Marketing / B.Tech + MBA",
    vacancies: 2,
    featured: false,
    urgent: false,
    postedDate: "4 Days Ago",
    deadline: "18 Oct 2026",
    overview: "Tech Mahindra is looking for a consultative B2B Sales Manager in Delhi NCR to drive IT enterprise solution sales, cloud services, and digital consulting contracts across North India.",
    description: "Tech Mahindra is looking for a consultative B2B Sales Manager in Delhi NCR to drive IT enterprise solution sales, cloud services, and digital consulting contracts across North India.",
    responsibilities: [
      "Generate new enterprise pipeline through consultative outreach, CXO networking, and industry events.",
      "Pitch IT services, cloud migration, and AI solutions to CIOs, CTOs, and Procurement Heads.",
      "Lead RFP / RFI response preparation, commercials negotiation, and contract closures.",
      "Meet and exceed quarterly revenue quotas of ₹5+ Crores with high margin retention.",
      "Coordinate with technical presales architects for customized client demos and proof-of-concepts."
    ],
    requirements: [
      "5+ years of enterprise B2B sales experience in IT Services, SaaS, or Cloud solutions.",
      "Proven track record of consistently closing deals with ticket sizes above ₹50 Lakhs.",
      "Deep understanding of the enterprise sales cycle, pipeline management in Salesforce/HubSpot.",
      "Stellar presentation, storytelling, and high-stakes negotiation skills.",
      "Willingness to travel for key client meetings across North India."
    ],
    benefits: [
      "Uncapped Commission Structure (Earning potential up to ₹10 Lakhs in incentives)",
      "Car Allowance & Fuel Reimbursement",
      "Executive Health Checkup Package",
      "Company Laptop and Mobile Allowance",
      "Fast-track leadership development program"
    ],
    skills: ["B2B Sales", "Enterprise IT Sales", "CXO Relationship", "Lead Generation", "Negotiation", "Salesforce"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "CNC Machine Operator & Programmer",
    slug: "cnc-machine-programmer-bhagwanpur",
    company: "Tata Motors Limited",
    companySlug: "tata-motors",
    logoText: "TATA",
    logoBg: "#090D16",
    location: "Bhagwanpur",
    workplaceType: "On-site",
    workMode: "On-site",
    category: "Manufacturing & Engineering",
    categorySlug: "manufacturing-engineering",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 320000,
    salaryMax: 500000,
    salaryMinLpa: 3.2,
    salaryMaxLpa: 5,
    salary: "₹3,20,000 - ₹5,00,000 PA",
    salaryDisplay: "₹3.2 - ₹5.0 LPA",
    experience: "2 - 4 Years",
    expBracket: "Junior (1-3 yrs)",
    qualification: "ITI in Machinist / Tool & Die / Diploma in Mechanical",
    vacancies: 8,
    featured: false,
    urgent: true,
    postedDate: "1 Day Ago",
    deadline: "01 Nov 2026",
    overview: "Urgently hiring certified CNC VMC programmers and operators for precision auto-component milling and turning operations at our Bhagwanpur industrial vendor park.",
    description: "Urgently hiring certified CNC VMC programmers and operators for precision auto-component milling and turning operations at our Bhagwanpur industrial vendor park.",
    responsibilities: [
      "Read technical 2D/3D engineering drawings and determine machining sequences, tools, and offsets.",
      "Write and optimize G-code and M-code programs on Fanuc / Siemens CNC controllers.",
      "Set up workpieces, zero fixtures, cutting tools, and perform trial component inspection using vernier calipers & micrometers.",
      "Monitor tool wear, replace inserts, and maintain optimal spindle speeds and feeds.",
      "Perform daily machine maintenance and maintain production records."
    ],
    requirements: [
      "ITI (Machinist / Turner / Fitter) or Diploma in Mechanical Engineering.",
      "2+ years experience operating 3-axis / 4-axis CNC VMC machines.",
      "Proficient in Fanuc or Siemens controller programming.",
      "Expert in precision measuring instruments (Micrometer, Height Gauge, Bore Gauge).",
      "Commitment to shop-floor safety and quality tolerances within ±0.01mm."
    ],
    benefits: [
      "Monthly Attendance Bonus (₹2,000)",
      "PF, ESI & Statutory Overtime Pay",
      "Free Uniforms & Safety Equipment",
      "Canteen Facility on-premises",
      "Annual Skill Upgradation Training"
    ],
    skills: ["CNC Programming", "VMC Machine", "G-Code / M-Code", "Fanuc Controller", "Precision Metrology", "Fixture Setup"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "Cloud DevOps & Kubernetes Engineer",
    slug: "cloud-devops-engineer-hyderabad",
    company: "Zoho Corporation",
    companySlug: "zoho-corporation",
    logoText: "ZOHO",
    logoBg: "#0056B3",
    location: "Hyderabad",
    workplaceType: "Hybrid",
    workMode: "Hybrid",
    category: "Information Technology",
    categorySlug: "it-software",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 1500000,
    salaryMax: 2400000,
    salaryMinLpa: 15,
    salaryMaxLpa: 24,
    salary: "₹15,00,000 - ₹24,00,000 PA",
    salaryDisplay: "₹15.0 - ₹24.0 LPA",
    experience: "4 - 8 Years",
    expBracket: "Mid-Level (3-6 yrs)",
    qualification: "B.Tech in Computer Science / IT / Electronics",
    vacancies: 3,
    featured: true,
    urgent: false,
    postedDate: "2 Days Ago",
    deadline: "30 Oct 2026",
    overview: "Zoho is expanding its core infrastructure team in Hyderabad. We are looking for a DevOps Engineer to manage large-scale Linux clusters, automate CI/CD pipelines, and maintain 99.99% cloud reliability.",
    description: "Zoho is expanding its core infrastructure team in Hyderabad. We are looking for a DevOps Engineer to manage large-scale Linux clusters, automate CI/CD pipelines, and maintain 99.99% cloud reliability.",
    responsibilities: [
      "Architect and maintain production Kubernetes (K8s) clusters across private cloud and bare-metal servers.",
      "Automate infrastructure provisioning using Terraform and Ansible.",
      "Build resilient CI/CD pipelines using GitHub Actions, Jenkins, and ArgoCD.",
      "Set up observability, logging, and alerting systems using Prometheus, Grafana, and ELK stack.",
      "Implement security hardening, automated vulnerability scans, and disaster recovery testing."
    ],
    requirements: [
      "4+ years of specialized experience in Linux system administration and DevOps practices.",
      "Strong hands-on expertise with Docker, Kubernetes, Helm charts, and ingress controllers.",
      "Proficiency in scripting with Bash and Python / Golang.",
      "Deep understanding of networking protocols (TCP/IP, DNS, BGP, Load Balancers, TLS).",
      "Experience maintaining high-availability production environments."
    ],
    benefits: [
      "100% Free organic meals (Breakfast, Lunch, Dinner)",
      "Zero Micro-management & Stable Employment",
      "Comprehensive Family Medical Insurance",
      "Annual Profit Sharing Bonus",
      "Recreation centers and fitness facilities"
    ],
    skills: ["Kubernetes", "Docker", "Terraform", "Linux", "Prometheus", "CI/CD", "Python", "Networking"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "Talent Acquisition Specialist (Tech)",
    slug: "hr-talent-acquisition-specialist-pune",
    company: "Reliance Retail & Jio",
    companySlug: "reliance-retail",
    logoText: "REL",
    logoBg: "#090D16",
    location: "Pune",
    workplaceType: "Hybrid",
    workMode: "Hybrid",
    category: "Human Resources",
    categorySlug: "hr-operations",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 700000,
    salaryMax: 1200000,
    salaryMinLpa: 7,
    salaryMaxLpa: 12,
    salary: "₹7,00,000 - ₹12,00,000 PA",
    salaryDisplay: "₹7.0 - ₹12.0 LPA",
    experience: "3 - 6 Years",
    expBracket: "Mid-Level (3-6 yrs)",
    qualification: "MBA in HR / Masters in Human Resource Management",
    vacancies: 3,
    featured: false,
    urgent: false,
    postedDate: "5 Days Ago",
    deadline: "25 Oct 2026",
    overview: "Reliance Retail Digital is looking for an energetic Talent Acquisition Specialist in Pune to spearhead engineering hiring across AI, Cloud, and E-commerce product units.",
    description: "Reliance Retail Digital is looking for an energetic Talent Acquisition Specialist in Pune to spearhead engineering hiring across AI, Cloud, and E-commerce product units.",
    responsibilities: [
      "Partner with engineering leaders to understand technical headcount needs and draft job specifications.",
      "Source passive top tech talent using LinkedIn Recruiter, GitHub, Job Portal, and referral networks.",
      "Conduct preliminary HR screenings, candidate culture assessments, and manage interview schedules.",
      "Drive salary benchmarking, offer letter rollouts, and pre-onboarding engagement to minimize offer dropouts.",
      "Track key recruitment metrics: Time to Hire, Cost per Hire, Source Mix, and Offer Acceptance Rate."
    ],
    requirements: [
      "3+ years experience as a technical recruiter in a high-growth tech product company or recruitment agency.",
      "Strong understanding of modern tech roles (Frontend, Backend, DevOps, Data Science).",
      "Proven capability to close 8-12 niche engineering positions per month.",
      "Excellent interpersonal, persuasion, and candidate negotiation skills.",
      "Experience using modern ATS (Greenhouse, Lever, Darwinbox)."
    ],
    benefits: [
      "Lucrative Quarterly Incentive on Target Closures",
      "Employee Discounts on Reliance Digital, Ajio & Trends",
      "Hybrid 2-days Work From Home",
      "Mediclaim Cover with Maternity Benefits",
      "Provident Fund and Gratuity"
    ],
    skills: ["Technical Recruiting", "Talent Sourcing", "LinkedIn Recruiter", "Salary Negotiation", "Candidate Engagement", "ATS"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "Digital Marketing & Performance Lead",
    slug: "digital-marketing-seo-lead-delhi",
    company: "Zomato & Blinkit",
    companySlug: "zomato-technologies",
    logoText: "ZOM",
    logoBg: "#0056B3",
    location: "Delhi NCR",
    workplaceType: "Hybrid",
    workMode: "Hybrid",
    category: "Sales & Marketing",
    categorySlug: "sales-marketing",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 1000000,
    salaryMax: 1600000,
    salaryMinLpa: 10,
    salaryMaxLpa: 16,
    salary: "₹10,00,000 - ₹16,00,000 PA",
    salaryDisplay: "₹10.0 - ₹16.0 LPA",
    experience: "3 - 7 Years",
    expBracket: "Mid-Level (3-6 yrs)",
    qualification: "Bachelor's / Master's degree in Marketing, Mass Comm, or Analytics",
    vacancies: 2,
    featured: true,
    urgent: false,
    postedDate: "1 Day Ago",
    deadline: "22 Oct 2026",
    overview: "Lead user acquisition campaigns, technical SEO, and conversion rate optimization (CRO) for high-growth consumer apps and landing pages.",
    description: "Lead user acquisition campaigns, technical SEO, and conversion rate optimization (CRO) for high-growth consumer apps and landing pages.",
    responsibilities: [
      "Manage performance marketing budgets across Google Ads, Meta Ads, and programmatic networks.",
      "Execute organic search strategies, keyword research, on-page optimization, and link-building programs.",
      "Analyze user funnels, Google Analytics 4, and Mixpanel events to enhance landing page conversions.",
      "Work closely with creative copywriters and video creators for ad creatives that drive sub-₹50 CAC.",
      "Conduct weekly A/B testing on ad copies, CTAs, and onboarding flows."
    ],
    requirements: [
      "3 to 7 years in growth or performance marketing in B2C or D2C high-traffic platforms.",
      "Hands-on expertise with Google Ads Manager, Meta Ads Manager, GA4, Semrush, and Ahrefs.",
      "Data-driven mindset with deep comfort in SQL / Excel pivot analysis.",
      "Strong creative instincts paired with rigorous metric discipline (ROAS, CAC, LTV).",
      "Excellent written communication and copywriting skills."
    ],
    benefits: [
      "Flexible Working Hours",
      "Generous Performance Bonus",
      "Free Meals & Snack Pantry",
      "Health & Dental Insurance",
      "Conference and course sponsorships"
    ],
    skills: ["Performance Marketing", "Google Ads", "Meta Ads", "SEO", "Google Analytics 4", "A/B Testing", "Copywriting"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "Senior Chartered Accountant (Finance & Tax)",
    slug: "senior-chartered-accountant-dehradun",
    company: "HDFC Bank",
    companySlug: "hdfc-bank",
    logoText: "HDFC",
    logoBg: "#090D16",
    location: "Dehradun",
    workplaceType: "On-site",
    workMode: "On-site",
    category: "Banking & Finance",
    categorySlug: "banking-finance",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 850000,
    salaryMax: 1400000,
    salaryMinLpa: 8.5,
    salaryMaxLpa: 14,
    salary: "₹8,50,000 - ₹14,00,000 PA",
    salaryDisplay: "₹8.5 - ₹14.0 LPA",
    experience: "2 - 5 Years",
    expBracket: "Junior (1-3 yrs)",
    qualification: "Qualified Chartered Accountant (ICAI)",
    vacancies: 2,
    featured: false,
    urgent: true,
    postedDate: "3 Days Ago",
    deadline: "30 Oct 2026",
    overview: "Handling statutory taxation, internal audits, GST compliance, and regional financial reporting for commercial banking operations in Uttarakhand.",
    description: "Handling statutory taxation, internal audits, GST compliance, and regional financial reporting for commercial banking operations in Uttarakhand.",
    responsibilities: [
      "Manage direct and indirect tax filings (GST, TDS, Corporate Advance Tax) with zero non-compliance.",
      "Coordinate with statutory auditors and RBI inspection teams for quarterly audit sign-offs.",
      "Review branch level trial balances, ledger reconciliations, and profit & loss statements.",
      "Provide tax planning advice and ensure compliance with recent Indian finance act revisions.",
      "Oversee vendor payments, asset depreciation schedules, and expense authorization."
    ],
    requirements: [
      "Qualified CA (ICAI Member).",
      "2+ years of post-qualification experience in banking, NBFC, or Big 4 audit firms.",
      "Extensive knowledge of Indian Accounting Standards (Ind AS), GST portal, and Income Tax laws.",
      "Proficiency in SAP FICO / Tally Prime and advanced MS Excel.",
      "High integrity and attention to audit details."
    ],
    benefits: [
      "Concessional Staff Loans & Banking Privileges",
      "Comprehensive Medical Cover for Family",
      "Performance Linked Annual Bonus",
      "Provident Fund and Superannuation",
      "Relocation Assistance"
    ],
    skills: ["Direct Taxation", "GST Filing", "Ind AS", "Statutory Audit", "SAP FICO", "Financial Reporting"],
    status: "active",
    applicantsCount: 0
  },
  {
    title: "Client Success & Support Lead",
    slug: "executive-customer-support-lead-chennai",
    company: "Zoho Corporation",
    companySlug: "zoho-corporation",
    logoText: "ZOHO",
    logoBg: "#0056B3",
    location: "Chennai",
    workplaceType: "On-site",
    workMode: "On-site",
    category: "Customer Support",
    categorySlug: "customer-support",
    jobType: "Full-Time",
    employmentType: "Full Time",
    salaryMin: 480000,
    salaryMax: 800000,
    salaryMinLpa: 4.8,
    salaryMaxLpa: 8,
    salary: "₹4,80,000 - ₹8,00,000 PA",
    salaryDisplay: "₹4.8 - ₹8.0 LPA",
    experience: "1 - 3 Years",
    expBracket: "Junior (1-3 yrs)",
    qualification: "Any Graduate (B.A. / B.Com / B.Sc / B.Tech)",
    vacancies: 10,
    featured: false,
    urgent: false,
    postedDate: "6 Days Ago",
    deadline: "12 Nov 2026",
    overview: "Provide top-tier product support, live chat assistance, and onboarding guidance to global customers utilizing Zoho suite applications.",
    description: "Provide top-tier product support, live chat assistance, and onboarding guidance to global customers utilizing Zoho suite applications.",
    responsibilities: [
      "Answer technical inquiries via live chat, email ticketing, and screen-sharing sessions.",
      "Troubleshoot product configuration issues, workflow automation setups, and API integrations.",
      "Document solutions in customer knowledge base and help articles.",
      "Escalate unresolved product bugs to development engineering teams.",
      "Maintain a 95%+ Customer Satisfaction (CSAT) score and first response time under 15 minutes."
    ],
    requirements: [
      "Excellent written and spoken English communication skills.",
      "1-3 years experience in international voice/email customer support or SaaS helpdesk.",
      "Patient customer problem-solving demeanor and technical curiosity.",
      "Comfortable working in rotational shift windows to support global time zones.",
      "Basic understanding of web technologies (HTML, CSS, JSON) is a plus."
    ],
    benefits: [
      "Shift Allowance & Free Doorstep Cab Pick/Drop",
      "Unlimited Free Gourmet Meals",
      "Health & Dental Care Insurance",
      "Generous Annual Performance Bonus",
      "Continuous Career Progression into Product Operations"
    ],
    skills: ["Customer Support", "Zendesk / Zoho Desk", "Technical Troubleshooting", "Written Communication", "Client Onboarding"],
    status: "active",
    applicantsCount: 0
  }
];

const syncDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Ensure employer user exists
    let employer = await User.findOne({ email: 'employer@gmail.com' });
    if (!employer) {
      employer = await User.create({
        name: 'employer',
        email: 'employer@gmail.com',
        password: 'employer@123',
        phone: '9876543210',
        role: 'employer',
        isEmailVerified: true,
        employerProfile: {
          companyName: 'SJ tech',
          companyWebsite: 'https://sjtech.com',
          companySize: '50-200 Employees',
          industry: 'Technology & IT',
          location: 'Bengaluru / Remote',
          aboutCompany: 'SJ tech is an innovative technology and software engineering company providing scalable enterprise solutions.',
          isVerifiedCompany: true
        }
      });
      console.log('✅ Created employer user:', employer.email);
    }

    // 2. Clear previous jobs and insert all 12 complete jobs into MongoDB
    await Job.deleteMany({});
    console.log('🧹 Cleared previous jobs');

    const jobsToInsert = allPortalJobs.map(j => ({
      ...j,
      employerId: employer._id
    }));

    const inserted = await Job.insertMany(jobsToInsert);
    console.log(`🚀 Successfully synced ${inserted.length} real jobs into MongoDB database!`);

    for (const j of inserted) {
      console.log(`   - [${j._id}] ${j.title} (${j.company}, ${j.location})`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error syncing jobs to database:', err);
    process.exit(1);
  }
};

syncDatabase();
