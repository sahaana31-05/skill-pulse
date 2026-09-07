import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Role } from '../../../shared/types';

const fields = ['IT', 'Non-IT'] as const;

export default function Company() {
  const { companyId = '' } = useParams();
  const company = decodeURIComponent(companyId);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedField = searchParams.get('field') === 'Non-IT' ? 'Non-IT' : 'IT';
  const { data: roleSummaries = [], isLoading } = useQuery({ queryKey: ['company-roles', company], queryFn: () => api.companyRoles(company) });
  const { data: roles = [], isLoading: detailsLoading } = useQuery<Role[]>({
    queryKey: ['company-role-details', company],
    queryFn: () => Promise.all(roleSummaries.map((item) => api.role(String(item.id)))),
    enabled: roleSummaries.length > 0
  });

  return <main className="container-shell py-16">
    <p className="eyebrow">Company view</p>
    <h1 className="mt-3 text-4xl font-extrabold tracking-tight">{company}</h1>
    <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">Showing all {selectedField} roles from the workbook, with the five skills attached to each role.</p>
    <div className="mt-8 inline-flex rounded-lg border border-slate-200 bg-mist p-1">{fields.map((field) => <button key={field} onClick={() => setSearchParams({ field })} className={`rounded-md px-5 py-2 text-sm font-bold ${selectedField === field ? 'bg-white text-ink shadow-sm' : 'text-slate-500'}`}>{field}</button>)}</div>
    <section className="mt-10 rounded-2xl bg-ink p-6 text-white sm:p-8"><p className="eyebrow">{selectedField} learning roadmap</p><h2 className="mt-2 text-2xl font-extrabold">From field choice to course completion</h2><div className="mt-6 grid gap-4 md:grid-cols-5">{['Choose a role', 'Read the long lesson content', 'Answer five related MCQs', 'Solve coding practicals', 'Pass the final mock and earn your certificate'].map((step, index) => <div className="border-t border-white/20 pt-4" key={step}><span className="text-sm font-bold text-pulse">0{index + 1}</span><p className="mt-3 text-sm leading-6 text-slate-200">{step}</p></div>)}</div></section>
    {isLoading || detailsLoading ? <p className="mt-10 text-slate-500">Loading roles and Excel skills...</p> : <div className="mt-10">{[selectedField].map((field) => {
      const fieldRoles = roles.filter((item) => item.field === field);
      return <section key={field} aria-labelledby={`${field}-roles`}>
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4"><div><span className="pill border-pulse text-pulse">{field}</span><h2 id={`${field}-roles`} className="mt-3 text-2xl font-extrabold">{field} roles</h2></div><span className="text-sm text-slate-500">{fieldRoles.length} roles</span></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{fieldRoles.map((item) => <Link to={`/roles/${item.id}`} key={item.id} className="card flex flex-col justify-between p-6 transition hover:-translate-y-1 hover:border-pulse"><div><span className="pill">{item.field}</span><h3 className="mt-5 text-xl font-extrabold">{item.role}</h3><p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Skills from dataset</p><div className="mt-3 flex flex-wrap gap-2">{item.skills.map((skill) => <span className="pill bg-mist text-xs" key={skill}>{skill}</span>)}</div></div><span className="mt-8 flex items-center gap-2 text-sm font-bold text-pulse">Open course roadmap <ArrowRight size={16} /></span></Link>)}</div>
        {fieldRoles.length === 0 && <p className="mt-5 text-sm text-slate-500">No roles found for this field.</p>}
      </section>;
    })}</div>}
  </main>;
}
