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
  const { data: postings = [], isLoading: postingsLoading } = useQuery({ queryKey: ['featured-postings'], queryFn: () => api.roles() });
  const steps = [
    { number: '01', title: 'Choose a company', text: 'Start with the employers you are curious about.', icon: Building2 },
    { number: '02', title: 'Choose a field', text: 'Open the IT or Non-IT learning path.', icon: Search },
    { number: '03', title: 'Learn and test', text: 'Read detailed content and complete session MCQs.', icon: BarChart3 },
    { number: '04', title: 'Practise and finish', text: 'Solve coding scenarios, check efficiency, and earn completion.', icon: CheckCircle2 }
  ];

  return <main>
    <section className="bg-ink text-white"><div className="container-shell grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
      <div><p className="eyebrow">Career clarity, grounded in evidence</p><h1 className="mt-5 max-w-2xl text-5xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl">Know the skills behind the role.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Explore what leading companies look for, then turn a target role into a practical learning plan.</p></div>
      <div className="rounded-2xl bg-white p-3 text-ink shadow-2xl"><div className="p-5"><p className="text-sm font-bold">Find a role</p><p className="mt-1 text-sm text-slate-500">Choose a path and see its five core skills.</p><div className="mt-6 grid gap-3">
        <select aria-label="Company" value={company} onChange={(event) => setCompany(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-pulse"><option value="">Select company</option>{companies.map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Field" value={field} onChange={(event) => setField(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-pulse"><option>IT</option><option>Non-IT</option></select>
        <button disabled={!company} onClick={() => navigate(`/companies/${encodeURIComponent(company)}?field=${encodeURIComponent(field)}#${field}-roles`)} className="flex items-center justify-center gap-2 rounded-lg bg-pulse px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50">Open learning path <ArrowRight size={16} /></button>
      </div></div></div>
    </div></section>
    <section className="container-shell py-20"><div className="max-w-2xl"><p className="eyebrow">A clearer starting point</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight">From broad ambition to your next useful skill.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-4">{steps.map(({ number, title, text, icon: Icon }) => <div className="border-t-2 border-pulse pt-5" key={number}><span className="text-sm font-bold text-pulse">{number}</span><Icon className="mt-8 text-slate-700" size={22} /><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}</div></section>
    <section className="bg-mist py-20"><div className="container-shell"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Explore employers</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight">Five companies. Fifty roles.</h2><p className="mt-3 text-slate-500">Accenture, TCS, Microsoft, IBM, and Deloitte</p></div><Link to="/roles" className="hidden items-center gap-2 text-sm font-bold text-pulse sm:flex">Browse all <ArrowRight size={16} /></Link></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{companies.map((item) => <Link key={item} to={`/companies/${encodeURIComponent(item)}`} className="card p-5 transition hover:-translate-y-1 hover:border-pulse"><span className="text-lg font-extrabold">{item}</span><span className="mt-8 block text-sm text-slate-500">View roles <ArrowRight className="ml-1 inline" size={14} /></span></Link>)}</div></div></section>
    <section className="container-shell py-20"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Role postings</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight">Different paths, one place.</h2><p className="mt-3 text-slate-500">Browse a sample of the role postings in the dataset.</p></div><Link to="/roles" className="hidden items-center gap-2 text-sm font-bold text-pulse sm:flex">View all postings <ArrowRight size={16} /></Link></div><div className="mt-10 overflow-hidden rounded-xl border border-slate-200">{postingsLoading ? <p className="p-6 text-slate-500">Loading postings...</p> : postings.slice(0, 10).map((item) => <Link to={`/roles/${item.id}`} key={item.id} className="grid gap-2 border-t border-slate-100 px-5 py-5 first:border-t-0 transition hover:bg-emerald-50 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center sm:gap-4"><span className="font-bold">{item.role}</span><span className="text-sm text-slate-600">{item.company}</span><span className="text-sm text-slate-600">{item.field}</span><ArrowRight className="hidden text-pulse sm:block" size={18} /></Link>)}</div></section>
  </main>;
}
