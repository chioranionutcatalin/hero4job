export interface PersonalDataType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  linkedInUrl?: string;
  personalWebsite?: string;
  profileImageUrl?: string;
  driverLicenseCategory?: string;
  desiredJobTitle?: string;
  summary?: string;
}

export type DateParts = {
  day: number | null;
  month: number;
  year: number;
};

export interface ExperienceType {
  role: string;
  companyName: string;
  startDate: DateParts;
  endDate?: DateParts;
  location?: string;
  remote?: boolean;
  stillWorkingHere?: boolean;
  description?: string;
}

export interface SkillType {
  name: string;
  proficiencyLevel?: 'N/A' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description?: string;
}

export interface LanguageType {
  language: string;
  proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

export interface EducationType {
  institutionName: string;
  startDate: string;
  endDate?: string;
  location?: string;
  degreeType?: string;
  fieldOfStudy?: string;
  description?: string;
}

export interface CVType {
  personalData: PersonalDataType;
  experienceData: ExperienceType[];
  skillsData: SkillType[];
  languagesData: LanguageType[];
  educationData: EducationType[];
}
