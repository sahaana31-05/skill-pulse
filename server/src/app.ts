import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import type { Role } from '@prisma/client';
import { prisma } from './lib/prisma.js';
import { computeSkillGap } from './lib/skillGap.js';

export const app = express();
const fieldSchema = z.enum(['IT', 'Non-IT']);
const skillGapSchema = z.object({ roleId: z.number().int().positive(), knownSkills: z.array(z.string()) });

app.use(cors());
app.use(express.json());

const toRole = (role: Role) => ({
  id: role.id,
  company: role.company,
  field: fieldSchema.parse(role.field),
  role: role.role,
  skills: [role.skill1, role.skill2, role.skill3, role.skill4, role.skill5],
  source: role.source
});

const toSummary = (role: Role) => {
  const full = toRole(role);
  return { id: full.id, company: full.company, field: full.field, role: full.role };
};

app.get('/api/companies', async (_request, response) => {
  const companies = await prisma.role.findMany({ distinct: ['company'], select: { company: true }, orderBy: { company: 'asc' } });
  response.json(companies.map(({ company }) => company));
});

app.get('/api/companies/:company/roles', async (request, response) => {
  const field = request.query.field ? fieldSchema.parse(request.query.field) : undefined;
  const roles = await prisma.role.findMany({ where: { company: request.params.company, ...(field ? { field } : {}) }, orderBy: { role: 'asc' } });
  response.json(roles.map(toSummary));
});

app.get('/api/roles', async (request, response) => {
  const field = request.query.field ? fieldSchema.parse(request.query.field) : undefined;
  const search = typeof request.query.search === 'string' ? request.query.search : undefined;
  const roles = await prisma.role.findMany({ where: { ...(typeof request.query.company === 'string' ? { company: request.query.company } : {}), ...(field ? { field } : {}), ...(search ? { role: { contains: search } } : {}) }, orderBy: [{ company: 'asc' }, { role: 'asc' }] });
  response.json(roles.map(toSummary));
});

app.get('/api/roles/:id', async (request, response) => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id)) return response.status(400).json({ message: 'Role id must be a number.' });
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) return response.status(404).json({ message: 'Role not found.' });
  response.json(toRole(role));
});

app.get('/api/skills', async (_request, response) => {
  const roles = await prisma.role.findMany({ select: { skill1: true, skill2: true, skill3: true, skill4: true, skill5: true } });
  const skills = new Set(roles.flatMap((role) => [role.skill1, role.skill2, role.skill3, role.skill4, role.skill5]));
  response.json([...skills].sort());
});

app.post('/api/skill-gap', async (request, response) => {
  const parsed = skillGapSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'roleId and knownSkills are required.' });
  const role = await prisma.role.findUnique({ where: { id: parsed.data.roleId } });
  if (!role) return response.status(404).json({ message: 'Role not found.' });
  response.json(computeSkillGap([role.skill1, role.skill2, role.skill3, role.skill4, role.skill5], parsed.data.knownSkills));
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ message: 'Something went wrong.' });
});
