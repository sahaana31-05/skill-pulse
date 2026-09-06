import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

const fields = ['IT', 'Non-IT'] as const;

export default function Company() {
  const { companyId = '' } = useParams();
  const company = decodeURIComponent(companyId);
  const { data: roles = [], isLoading } = useQuery({ queryKey: ['company-roles', company], queryFn: () => api.companyRoles(company) });

  return <main className="container-shell py-16">
    <p className="eyebrow">Company view</p>
    <h1 className="mt-3 text-4xl font-extrabold tracking-tight">{company}</h1>
    <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">Explore every role from both fields in the dataset: IT and Non-IT.</p>
    {isLoading ? <p className="mt-10 text-slate-500">Loading roles...</p> : <div className="mt-10 space-y-12">{fields.map((field) => {
      const fieldRoles = roles.filter((item) => item.field === field);
      return <section key={field} aria-labelledby={`${field}-roles`}>
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4"><div><span className="pill border-pulse text-pulse">{field}</span><h2 id={`${field}-roles`} className="mt-3 text-2xl font-extrabold">{field} roles</h2></div><span className="text-sm text-slate-500">{fieldRoles.length} roles</span></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{fieldRoles.map((item) => <Link to={`/roles/${item.id}`} key={item.id} className="card flex flex-col justify-between p-6 transition hover:-translate-y-1 hover:border-pulse"><div><span className="pill">{item.field}</span><h3 className="mt-5 text-xl font-extrabold">{item.role}</h3></div><span className="mt-8 flex items-center gap-2 text-sm font-bold text-pulse">View skills <ArrowRight size={16} /></span></Link>)}</div>
        {fieldRoles.length === 0 && <p className="mt-5 text-sm text-slate-500">No roles found for this field.</p>}
      </section>;
    })}</div>}
  </main>;
}
