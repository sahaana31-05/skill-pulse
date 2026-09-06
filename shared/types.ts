export type Field = 'IT' | 'Non-IT';

export interface RoleSummary {
  id: number;
  company: string;
  field: Field;
  role: string;
}

export interface Role extends RoleSummary {
  skills: string[];
  source: string;
}

export interface SkillGapRequest {
  roleId: number;
  knownSkills: string[];
}

export interface SkillGapResponse {
  alreadyHave: string[];
  toDevelop: string[];
}

export interface ApiError {
  message: string;
}
