export interface SkillItem {
  id: string;
  namaFungsi: string;
  catatan: string;
  linkGithub: string;
  category: string;
}

export interface SkillCategory {
  title: string;
  slug: string;
  itemCount: number;
  description?: string;
}

export interface ProfilingData {
  name: string;
  title: string;
  summary: string;
  cvUrl: string;
  avatarUrl: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  location: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  demoLink?: string;
  githubLink?: string;
  status: 'Production' | 'Completed' | 'In Progress' | string;
  techStack: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  location?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

export interface TestimonialItem {
  id: string;
  nama: string;
  peran: string;
  kesan: string;
  avatarUrl?: string;
}

export interface PortfolioFullData {
  profile: ProfilingData;
  categories: SkillCategory[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  aboutFacts: string[];
  testimonials: TestimonialItem[];
}

export type UserProfile = ProfilingData;
