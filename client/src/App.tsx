import { lazy, Suspense } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { ArrowRight, CircleDot } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const Browse = lazy(() => import('./pages/Browse'));
const Company = lazy(() => import('./pages/Company'));
const RoleDetail = lazy(() => import('./pages/RoleDetail'));
const About = lazy(() => import('./pages/About'));

function Layout() {
  return <>
    <header className="border-b border-white/10 bg-ink text-white">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-extrabold tracking-tight"><CircleDot className="text-pulse" size={22} />Skill Pulse</Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <NavLink to="/roles" className={({ isActive }) => isActive ? 'text-white' : 'hover:text-white'}>Browse roles</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-white' : 'hover:text-white'}>About</NavLink>
        </nav>
        <Link to="/roles" className="inline-flex items-center gap-2 rounded-lg bg-pulse px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500">Start skill check <ArrowRight size={16} /></Link>
      </div>
    </header>
    <Suspense fallback={<div className="container-shell py-24 text-slate-500">Loading...</div>}><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/roles" element={<Browse />} />
      <Route path="/companies/:companyId" element={<Company />} />
      <Route path="/roles/:roleId" element={<RoleDetail />} />
      <Route path="/about" element={<About />} />
    </Routes></Suspense>
    <footer className="mt-20 border-t border-slate-200 py-8"><div className="container-shell flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:justify-between"><span>Skill Pulse</span><span>Role intelligence for deliberate career moves.</span></div></footer>
  </>;
}

export default Layout;
