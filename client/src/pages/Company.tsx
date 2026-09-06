import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function Company() {
  const { companyId = '' } = useParams();
  const company = decodeURIComponent(companyId);
  const [params, setParams] = useSearchParams();
  const field = params.get('field') ?? 'IT';
  const { data: roles = [], isLoading } = useQuery({ queryKey: ['company-roles', company, field], queryFn: () => api.companyRoles(company, field) });
  return <main className="container-shell py-16"><p className="eyebrow">Company view</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight">{company}</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">Explore the roles this employer offers across technical and non-technical paths.</p><div className="mt-10 inline-flex rounded-lg border border-slate-200 bg-mist p-1"><button onClick={() => setParams({ field: 'IT' })} className={`rounded-md px-5 py-2 text-sm font-bold ${field === 'IT' ? 'bg-white text-ink shadow-sm' : 'text-slate-500'}`}>IT</button><button onClick={() => setParams({ field: 'Non-IT' })} className={`rounded-md px-5 py-2 text-sm font-bold ${field === 'Non-IT' ? 'bg-white text-ink shadow-sm' : 'text-slate-500'}`}>Non-IT</button></div><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{isLoading ? <p className="text-slate-500">Loading roles...</p> : roles.map((item) => <Link to={`/roles/${item.id}`} key={item.id} className="card flex flex-col justify-between p-6 transition hover:-translate-y-1 hover:border-pulse"><div><span className="pill">{item.field}</span><h2 className="mt-5 text-xl font-extrabold">{item.role}</h2></div><span className="mt-8 flex items-center gap-2 text-sm font-bold text-pulse">View skills <ArrowRight size={16} /></span></Link>)}</div></main>;
}
