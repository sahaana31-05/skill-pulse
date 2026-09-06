import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedRole = { company: string; field: string; role: string; skills: string[]; source: string };

const roles: SeedRole[] = [
  { company: 'Accenture', field: 'IT', role: 'Software Engineer', skills: ['Python', 'Java', 'SQL', 'Git', 'Cloud Computing'], source: 'Accenture Careers' },
  { company: 'Accenture', field: 'IT', role: 'Data Analyst', skills: ['SQL', 'Power BI', 'Data Modeling', 'Data Visualization', 'Data Transformation'], source: 'Accenture Careers' },
  { company: 'Accenture', field: 'IT', role: 'Data Engineer', skills: ['Databricks', 'PySpark', 'Data Engineering', 'Data Processing', 'Cloud Data Platforms'], source: 'Accenture Careers' },
  { company: 'Accenture', field: 'IT', role: 'Cloud Engineer', skills: ['Cloud Computing', 'Azure', 'Networking', 'Security', 'Automation'], source: 'Accenture Careers' },
  { company: 'Accenture', field: 'IT', role: 'Low-Code Developer', skills: ['Power Platform', 'APIs/REST', 'SQL/NoSQL', 'JavaScript', 'Problem Solving'], source: 'Accenture Careers' },
  { company: 'Accenture', field: 'Non-IT', role: 'Business Analyst', skills: ['Business Analysis', 'Requirements Gathering', 'Process Analysis', 'Problem Solving', 'Communication'], source: 'Accenture Careers' },
  { company: 'Accenture', field: 'Non-IT', role: 'Project Manager', skills: ['Project Planning', 'Agile', 'Leadership', 'Risk Management', 'Communication'], source: 'Accenture Careers' },
  { company: 'Accenture', field: 'Non-IT', role: 'HR / Talent Acquisition', skills: ['Recruitment', 'Communication', 'Interviewing', 'Talent Management', 'HR Analytics'], source: 'Accenture Careers' },
  { company: 'Accenture', field: 'Non-IT', role: 'Management Consultant', skills: ['Business Strategy', 'Research', 'Analytical Thinking', 'Presentation', 'Problem Solving'], source: 'Accenture Careers' },
  { company: 'Accenture', field: 'Non-IT', role: 'Finance Analyst', skills: ['Financial Analysis', 'Excel', 'Reporting', 'Data Analysis', 'Communication'], source: 'Accenture Careers' },
  { company: 'TCS', field: 'IT', role: 'Data Engineer', skills: ['Python', 'SQL', 'ETL', 'Databricks', 'Cloud'], source: 'TCS Careers' },
  { company: 'TCS', field: 'IT', role: 'Data Scientist', skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'], source: 'TCS Careers' },
  { company: 'TCS', field: 'IT', role: 'Python Developer', skills: ['Python', 'Programming', 'APIs', 'SQL', 'Problem Solving'], source: 'TCS Careers' },
  { company: 'TCS', field: 'IT', role: 'Databricks Developer', skills: ['Databricks', 'PySpark', 'SQL', 'Data Engineering', 'Cloud Data Platforms'], source: 'TCS Careers' },
  { company: 'TCS', field: 'IT', role: 'Spark/Scala Data Engineer', skills: ['Apache Spark', 'Scala', 'Big Data', 'Data Pipelines', 'ETL'], source: 'TCS Careers' },
  { company: 'TCS', field: 'Non-IT', role: 'Business Analyst', skills: ['Business Analysis', 'Requirements Gathering', 'Communication', 'Documentation', 'Problem Solving'], source: 'TCS Careers' },
  { company: 'TCS', field: 'Non-IT', role: 'HR / Talent Acquisition', skills: ['Recruitment', 'Communication', 'Talent Management', 'Interviewing', 'HR Analytics'], source: 'TCS Careers' },
  { company: 'TCS', field: 'Non-IT', role: 'Finance Analyst', skills: ['Financial Analysis', 'Excel', 'Reporting', 'Accounting', 'Data Analysis'], source: 'TCS Careers' },
  { company: 'TCS', field: 'Non-IT', role: 'Project Manager', skills: ['Project Management', 'Agile', 'Leadership', 'Stakeholder Management', 'Risk Management'], source: 'TCS Careers' },
  { company: 'TCS', field: 'Non-IT', role: 'Business Consultant', skills: ['Business Strategy', 'Process Analysis', 'Communication', 'Research', 'Problem Solving'], source: 'TCS Careers' },
  { company: 'Microsoft', field: 'IT', role: 'Software Engineer', skills: ['C# / Java / Python', 'Data Structures', 'Distributed Systems', 'Cloud', 'System Design'], source: 'Microsoft Careers' },
  { company: 'Microsoft', field: 'IT', role: 'Cloud Engineer', skills: ['Azure', 'Cloud Architecture', 'Networking', 'Security', 'Automation'], source: 'Microsoft Careers' },
  { company: 'Microsoft', field: 'IT', role: 'AI Engineer', skills: ['Artificial Intelligence', 'Machine Learning', 'Python', 'APIs', 'Cloud'], source: 'Microsoft Careers' },
  { company: 'Microsoft', field: 'IT', role: 'Data Scientist', skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'], source: 'Microsoft Careers' },
  { company: 'Microsoft', field: 'IT', role: 'DevOps Engineer', skills: ['Azure DevOps', 'CI/CD', 'Automation', 'Git', 'Cloud Infrastructure'], source: 'Microsoft Careers' },
  { company: 'Microsoft', field: 'Non-IT', role: 'Product Manager', skills: ['Product Strategy', 'Market Research', 'Analytical Thinking', 'Communication', 'Leadership'], source: 'Microsoft Careers' },
  { company: 'Microsoft', field: 'Non-IT', role: 'Program Manager', skills: ['Project Management', 'Stakeholder Management', 'Communication', 'Leadership', 'Problem Solving'], source: 'Microsoft Careers' },
  { company: 'Microsoft', field: 'Non-IT', role: 'Business Program Manager', skills: ['Business Analysis', 'Program Management', 'Communication', 'Data Analysis', 'Strategy'], source: 'Microsoft Careers' },
  { company: 'Microsoft', field: 'Non-IT', role: 'Technical Recruiter', skills: ['Recruitment', 'Sourcing', 'Communication', 'Interviewing', 'Stakeholder Management'], source: 'Microsoft Careers' },
  { company: 'Microsoft', field: 'Non-IT', role: 'Finance Analyst', skills: ['Financial Analysis', 'Excel', 'Forecasting', 'Data Analysis', 'Communication'], source: 'Microsoft Careers' },
  { company: 'IBM', field: 'IT', role: 'Software Developer', skills: ['Python', 'Java', 'Data Structures & Algorithms', 'Databases', 'Git'], source: 'IBM Careers' },
  { company: 'IBM', field: 'IT', role: 'Data Scientist', skills: ['Python', 'Data Analysis', 'Machine Learning', 'Statistics', 'Data Visualization'], source: 'IBM Careers' },
  { company: 'IBM', field: 'IT', role: 'Cloud Engineer', skills: ['Cloud Computing', 'Kubernetes', 'Docker', 'Automation', 'Security'], source: 'IBM Careers' },
  { company: 'IBM', field: 'IT', role: 'AI Engineer', skills: ['AI', 'Machine Learning', 'Python', 'NLP', 'Cloud'], source: 'IBM Careers' },
  { company: 'IBM', field: 'IT', role: 'DevOps Engineer', skills: ['CI/CD', 'Git', 'Docker', 'Kubernetes', 'Cloud'], source: 'IBM Careers' },
  { company: 'IBM', field: 'Non-IT', role: 'Business Consultant', skills: ['Business Analysis', 'Communication', 'Collaboration', 'Problem Solving', 'Business Strategy'], source: 'IBM Careers' },
  { company: 'IBM', field: 'Non-IT', role: 'Management Consultant', skills: ['Project Management', 'Agile', 'Communication', 'Decision Making', 'Problem Solving'], source: 'IBM Careers' },
  { company: 'IBM', field: 'Non-IT', role: 'HR Business Partner', skills: ['HR Management', 'Communication', 'Employee Relations', 'Workforce Planning', 'Analytics'], source: 'IBM Careers' },
  { company: 'IBM', field: 'Non-IT', role: 'Finance Analyst', skills: ['Financial Analysis', 'Excel', 'Forecasting', 'Reporting', 'Data Analysis'], source: 'IBM Careers' },
  { company: 'IBM', field: 'Non-IT', role: 'Project Manager', skills: ['Project Planning', 'Agile', 'Risk Management', 'Leadership', 'Stakeholder Management'], source: 'IBM Careers' },
  { company: 'Deloitte', field: 'IT', role: 'Data Analyst', skills: ['SQL', 'Python', 'Data Science', 'Statistical Analysis', 'Data Visualization'], source: 'Deloitte Careers' },
  { company: 'Deloitte', field: 'IT', role: 'Data Engineer', skills: ['SQL', 'Python', 'ETL', 'Cloud', 'Data Pipelines'], source: 'Deloitte Careers' },
  { company: 'Deloitte', field: 'IT', role: 'Technology Consultant', skills: ['Technology Analysis', 'Data Analytics', 'Cloud', 'Problem Solving', 'Communication'], source: 'Deloitte Careers' },
  { company: 'Deloitte', field: 'IT', role: 'Cybersecurity Analyst', skills: ['Cybersecurity', 'Risk Assessment', 'Network Security', 'SIEM', 'Problem Solving'], source: 'Deloitte Careers' },
  { company: 'Deloitte', field: 'IT', role: 'Analytics Consultant', skills: ['SQL', 'Python', 'Data Cleaning', 'Statistical Analysis', 'Business Intelligence'], source: 'Deloitte Careers' },
  { company: 'Deloitte', field: 'Non-IT', role: 'Business Consultant', skills: ['Business Analysis', 'Market Analysis', 'Research', 'Communication', 'Problem Solving'], source: 'Deloitte Careers' },
  { company: 'Deloitte', field: 'Non-IT', role: 'Management Consultant', skills: ['Business Strategy', 'Analytical Thinking', 'Research', 'Presentation', 'Problem Solving'], source: 'Deloitte Careers' },
  { company: 'Deloitte', field: 'Non-IT', role: 'HR Consultant', skills: ['HR Management', 'Workforce Analytics', 'Communication', 'Stakeholder Management', 'Problem Solving'], source: 'Deloitte Careers' },
  { company: 'Deloitte', field: 'Non-IT', role: 'Finance Analyst', skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Reporting', 'Data Analysis'], source: 'Deloitte Careers' },
  { company: 'Deloitte', field: 'Non-IT', role: 'Project Manager', skills: ['Project Management', 'Agile', 'Leadership', 'Risk Management', 'Stakeholder Management'], source: 'Deloitte Careers' }
];

await prisma.role.deleteMany();
await prisma.role.createMany({ data: roles.map(({ skills, ...role }) => ({ ...role, skill1: skills[0], skill2: skills[1], skill3: skills[2], skill4: skills[3], skill5: skills[4] })) });
await prisma.$disconnect();
