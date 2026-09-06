import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BarChart3, Building2, CheckCircle2, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../lib/api';
import { excelCompanyNames } from '../data/companies';

export default function Home() {
  const navigate = useNavigate();
  const companies = [...excelCompanyNames];
  const [company, setCompany] = useState('');
  const [field, setField] = useState('IT');
  const { data: roles = [] } = useQuery({ queryKey: ['company-roles', company, field], queryFn: () => api.companyRoles(company, field), enabled: Boolean(company) });
  const steps = [
    { number: '01', title: 'Choose a company', text: 'Start with the employers you are curious about.', icon: Building2 },
    { number: '02', title: 'Pick a role', text: 'Compare IT and non-IT paths side by side.', icon: Search },
    { number: '03', title: 'See the signal', text: 'Review the five skills that define the role.', icon: BarChart3 },
    { number: '04', title: 'Close the gap', text: 'Mark what you know and get a focused list.', icon: CheckCircle2 }
  ];

  return <main>
    <section className="bg-ink text-white"><div className="container-shell grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
      <div><p className="eyebrow">Career clarity, grounded in evidence</p><h1 className="mt-5 max-w-2xl text-5xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl">Know the skills behind the role.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Explore what leading companies look for, then turn a target role into a practical learning plan.</p></div>
      <div className="rounded-2xl bg-white p-3 text-ink shadow-2xl"><div className="p-5"><p className="text-sm font-bold">Find a role</p><p className="mt-1 text-sm text-slate-500">Choose a path and see its five core skills.</p><div className="mt-6 grid gap-3">
        <select aria-label="Company" value={company} onChange={(event) => { setCompany(event.target.value); }} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-pulse"><option value="">Select company</option>{companies.map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Field" value={field} onChange={(event) => setField(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-pulse"><option>IT</option><option>Non-IT</option></select>
        <select aria-label="Role" disabled={!company} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-pulse"><option>Select role</option>{roles.map((item) => <option key={item.id} value={item.id}>{item.role}</option>)}</select>
        <button onClick={() => { const select = document.querySelector<HTMLSelectElement>('select[aria-label="Role"]'); if (select?.value && select.value !== 'Select role') navigate(`/roles/${select.value}`); }} className="flex items-center justify-center gap-2 rounded-lg bg-pulse px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500">View role skills <ArrowRight size={16} /></button>
      </div></div></div>
    </div></section>
    <section className="container-shell py-20"><div className="max-w-2xl"><p className="eyebrow">A clearer starting point</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight">From broad ambition to your next useful skill.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-4">{steps.map(({ number, title, text, icon: Icon }) => <div className="border-t-2 border-pulse pt-5" key={number}><span className="text-sm font-bold text-pulse">{number}</span><Icon className="mt-8 text-slate-700" size={22} /><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}</div></section>
    <section className="bg-mist py-20"><div className="container-shell"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Explore employers</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight">Five companies. Fifty roles.</h2><p className="mt-3 text-slate-500">Accenture, TCS, Microsoft, IBM, and Deloitte</p></div><Link to="/roles" className="hidden items-center gap-2 text-sm font-bold text-pulse sm:flex">Browse all <ArrowRight size={16} /></Link></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{companies.map((item) => <Link key={item} to={`/companies/${encodeURIComponent(item)}`} className="card p-5 transition hover:-translate-y-1 hover:border-pulse"><span className="text-lg font-extrabold">{item}</span><span className="mt-8 block text-sm text-slate-500">View roles <ArrowRight className="ml-1 inline" size={14} /></span></Link>)}</div></div></section>
  </main>;
}
