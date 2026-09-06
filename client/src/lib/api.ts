import type { Role, RoleSummary, SkillGapResponse } from '../../../shared/types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) throw new Error((await response.json()).message ?? 'Request failed');
  return response.json() as Promise<T>;
}

export const api = {
  companies: () => request<string[]>('/api/companies'),
  companyRoles: (company: string, field?: string) => request<RoleSummary[]>(`/api/companies/${encodeURIComponent(company)}/roles${field ? `?field=${encodeURIComponent(field)}` : ''}`),
  roles: (params = '') => request<RoleSummary[]>(`/api/roles${params ? `?${params}` : ''}`),
  role: (id: string) => request<Role>(`/api/roles/${id}`),
  skills: () => request<string[]>('/api/skills'),
  skillGap: (roleId: number, knownSkills: string[]) => request<SkillGapResponse>('/api/skill-gap', { method: 'POST', body: JSON.stringify({ roleId, knownSkills }) })
};
