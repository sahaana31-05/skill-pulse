import { useQuery } from '@tanstack/react-query';
import { Award, Check, ExternalLink, Printer, RotateCcw, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../lib/api';
import { createCourseSessions, evaluateCode, getEfficiency, type CourseSession } from '../lib/learning';

const PROFICIENCY_THRESHOLD = 70;
type Gap = { alreadyHave: string[]; toDevelop: string[] };

export default function RoleDetail() {
  const { roleId = '' } = useParams();
  const { data: role, isLoading } = useQuery({ queryKey: ['role', roleId], queryFn: () => api.role(roleId) });
  const [knownSkills, setKnownSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [gap, setGap] = useState<Gap | null>(null);
  const [courseSkills, setCourseSkills] = useState<string[]>([]);
  const [selectedStartModule, setSelectedStartModule] = useState(0);
  const [moduleIndex, setModuleIndex] = useState(0);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [sessionMarks, setSessionMarks] = useState<Record<number, number>>({});
  const [code, setCode] = useState('');
  const [moduleScores, setModuleScores] = useState<number[]>([]);
  const [needsRetake, setNeedsRetake] = useState(false);
  const [checkpointScore, setCheckpointScore] = useState<number | null>(null);
  const [checkpointMark, setCheckpointMark] = useState<number | null>(null);
  const [checkpointPassed, setCheckpointPassed] = useState(false);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [courseComplete, setCourseComplete] = useState(false);

  if (isLoading || !role) return <main className="container-shell py-24 text-slate-500">Loading role...</main>;

  const currentSession = sessions[sessionIndex];
  const currentSkill = courseSkills[moduleIndex];
  const completedSessions = Object.keys(sessionMarks).length;
  const totalMarks = Object.values(sessionMarks).reduce((sum, mark) => sum + mark, 0);
  const progressPercent = sessions.length ? Math.round((completedSessions / sessions.length) * 100) : 0;
  const overallScore = completedSessions ? getEfficiency(totalMarks, completedSessions * 5) : 0;
  const isSessionUnlocked = (index: number) => index === 0 || sessionMarks[sessions[index - 1].number] !== undefined;
  const resetInputs = () => { setAnswers({}); setCode(''); };
  const toggleSkill = (skill: string) => setKnownSkills((current) => current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]);
  const addCustom = () => { const value = customSkill.trim(); if (value && !knownSkills.includes(value)) setKnownSkills([...knownSkills, value]); setCustomSkill(''); };

  const startCourse = async () => {
    const result = await api.skillGap(role.id, knownSkills);
    const start = Math.min(selectedStartModule, Math.max(result.toDevelop.length - 1, 0));
    const orderedSkills = [...result.toDevelop.slice(start), ...result.toDevelop.slice(0, start)];
    setGap(result); setCourseSkills(orderedSkills); setModuleIndex(0); setSessions(orderedSkills.length ? createCourseSessions(orderedSkills[0]) : []);
    setSessionIndex(0); resetInputs(); setSessionMarks({}); setModuleScores([]); setNeedsRetake(false); setCheckpointScore(null); setCheckpointMark(null); setCheckpointPassed(false); setShowCheckpoint(false); setCourseComplete(orderedSkills.length === 0);
  };

  const advanceAfterCheckpoint = () => {
    setShowCheckpoint(false);
    setCheckpointPassed(false);
    if (!checkpointPassed) return;
    if (currentSession?.kind === 'Final Mock') {
      if (moduleIndex < courseSkills.length - 1) {
        setModuleIndex(moduleIndex + 1);
        setSessions(createCourseSessions(courseSkills[moduleIndex + 1]));
        setSessionIndex(0);
        resetInputs();
      } else {
        setCourseComplete(true);
      }
      return;
    }
    setSessionIndex(sessionIndex + 1);
    resetInputs();
  };

  const submitSession = () => {
    if (!currentSession) return;
    if (currentSession.kind === 'Lecture MCQ' || currentSession.kind === 'Final Mock') {
      const mark = currentSession.questions.filter((question, index) => answers[index] === question.answer).length;
      const score = getEfficiency(mark, currentSession.questions.length);
      setSessionMarks({ ...sessionMarks, [currentSession.number]: mark }); setModuleScores([...moduleScores, score]); setCheckpointMark(mark); setCheckpointScore(score); setCheckpointPassed(mark > 3); setShowCheckpoint(true); resetInputs();
      if (score < PROFICIENCY_THRESHOLD) setNeedsRetake(true);
      return;
    }
    if (currentSession.kind === 'Lecture') {
      const mark = currentSession.questions.filter((question, index) => answers[index] === question.answer).length;
      const score = getEfficiency(mark, currentSession.questions.length);
      setSessionMarks({ ...sessionMarks, [currentSession.number]: mark }); setCheckpointMark(mark); setCheckpointScore(score); setCheckpointPassed(mark > 3); setShowCheckpoint(true); resetInputs();
      return;
    }
    const passed = currentSession.kind === 'Practical' ? evaluateCode(code, currentSession.codeKeywords) : currentSession.questions.every((question, index) => answers[index] === question.answer);
    if (!passed) return;
    setSessionMarks({ ...sessionMarks, [currentSession.number]: 5 }); setCheckpointMark(5); setCheckpointScore(100); setCheckpointPassed(true); setShowCheckpoint(true); resetInputs();
  };

  const restartModule = () => { setNeedsRetake(false); setShowCheckpoint(false); setCheckpointScore(null); setCheckpointMark(null); setCheckpointPassed(false); setModuleScores(moduleScores.slice(0, -1)); setSessionMarks({}); setSessionIndex(0); resetInputs(); };
  const restartCourse = () => { setCourseComplete(false); setNeedsRetake(false); setShowCheckpoint(false); setCheckpointScore(null); setCheckpointMark(null); setCheckpointPassed(false); setModuleIndex(0); setSessionIndex(0); setSessionMarks({}); setModuleScores([]); resetInputs(); if (courseSkills.length) setSessions(createCourseSessions(courseSkills[0])); };
  const overallEfficiency = overallScore || getEfficiency(moduleScores.reduce((sum, score) => sum + score, 0), moduleScores.length * 100);

  return <main className="container-shell py-16">
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-3"><span className="pill border-pulse text-pulse">{role.field}</span><span className="text-sm text-slate-500">{role.company}</span></div>
      <h1 className="mt-5 text-4xl font-extrabold tracking-tight">{role.role}</h1>
      <p className="mt-4 text-lg text-slate-500">Read the course content, complete the MCQ checkpoint, then solve realistic coding scenarios.</p>
    </div>
    <section className="mt-10"><h2 className="text-xl font-extrabold">Required skills</h2><div className="mt-5 flex flex-wrap gap-3">{role.skills.map((skill) => <span className="pill bg-mist" key={skill}>{skill}</span>)}</div><p className="mt-6 flex items-center gap-2 text-sm text-slate-500">Source: {role.source} <ExternalLink size={14} /></p></section>
    <section className="mt-16 rounded-2xl bg-ink p-6 text-white sm:p-8">
      <p className="eyebrow">Course search</p><h2 className="mt-3 text-2xl font-extrabold">Search for skills you already know</h2><p className="mt-3 max-w-2xl leading-7 text-slate-300">Use the search bar to enter known skills. No recommended skill list is shown; your course is created from your own input.</p>
      <div className="mt-6 flex gap-3"><input value={customSkill} onChange={(event) => setCustomSkill(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addCustom(); }} placeholder="Search or enter a skill you know" className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400" /><button onClick={addCustom} className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-ink">Add</button></div>
      {knownSkills.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{knownSkills.map((skill) => <button onClick={() => toggleSkill(skill)} key={skill} className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-200">{skill} <X className="ml-1 inline" size={13} /></button>)}</div>}
      <button onClick={startCourse} className="mt-8 rounded-lg bg-pulse px-5 py-3 text-sm font-bold text-white">Start course</button>
    </section>
    {gap && <section className="mt-8 grid gap-5 md:grid-cols-2"><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><div className="flex items-center gap-2 text-sm font-bold text-emerald-700"><Check size={17} /> Already have</div><div className="mt-5 flex flex-wrap gap-2">{gap.alreadyHave.length ? gap.alreadyHave.map((skill) => <span className="pill border-emerald-200 bg-white" key={skill}>{skill}</span>) : <p className="text-sm text-slate-500">No matches yet.</p>}</div></div><div className="rounded-xl border border-slate-200 p-6"><h2 className="text-sm font-bold">Choose a starting module</h2><p className="mt-2 text-sm text-slate-500">Each missing skill has two topics, ten lectures, a checkpoint, five coding practicals, and a final mock.</p><div className="mt-5 flex flex-wrap gap-2">{gap.toDevelop.map((skill, index) => <button type="button" onClick={() => setSelectedStartModule(index)} className={`pill ${selectedStartModule === index ? 'border-pulse bg-emerald-50 text-pulse' : ''}`} key={skill}>{index + 1}. {skill}</button>)}</div></div></section>}
    {currentSession && !courseComplete && !needsRetake && !showCheckpoint && <section className="mt-10 rounded-2xl border border-slate-200 bg-mist p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row"><div><p className="eyebrow">Module {moduleIndex + 1} of {courseSkills.length}</p><h2 className="mt-2 text-2xl font-extrabold">{currentSkill}</h2><p className="mt-2 text-base text-slate-500">Session {currentSession.number} of {sessions.length}: {currentSession.title}</p><p className="mt-1 text-sm text-slate-400">Topic: {currentSession.topic}</p></div><span className={`pill text-base ${currentSession.kind === 'Lecture' ? 'border-blue-300 text-blue-700' : currentSession.kind === 'Practical' ? 'border-amber-300 text-amber-700' : 'border-rose-300 text-rose-700'}`}>{currentSession.kind === 'Lecture' ? 'Lecture + MCQ' : currentSession.kind}</span></div>
      <div className="mt-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-slate-400">Learning roadmap</p><p className="mt-2 text-base text-slate-600">Complete each lecture quiz before the next session unlocks. Coding practice follows lectures 3, 6, and 9.</p></div><div className="text-right text-sm font-bold text-pulse"><span>{completedSessions} / {sessions.length} sessions</span><span className="ml-3">{progressPercent}% complete</span></div></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-pulse transition-all" style={{ width: `${progressPercent}%` }} /></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sessions.map((session, index) => { const completed = sessionMarks[session.number] !== undefined; const unlocked = isSessionUnlocked(index); const label = session.kind === 'Lecture' ? 'Lecture + MCQ' : session.kind; return <button type="button" disabled={!unlocked} onClick={() => { setSessionIndex(index); setShowCheckpoint(false); resetInputs(); }} className={`min-h-24 rounded-xl border-2 px-4 py-3 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-55 ${sessionIndex === index ? 'border-pulse bg-white text-pulse shadow-sm' : completed ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : unlocked ? 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300' : 'border-slate-200 bg-slate-100 text-slate-500'}`} key={session.number}><span className="flex items-center justify-between gap-2"><span className="font-extrabold">{session.number}. {label}</span><span className="text-xs font-bold">{completed ? `Completed ${sessionMarks[session.number]}/5` : unlocked ? 'Current' : 'Locked'}</span></span><span className="mt-2 block">{session.title}</span></button>; })}</div></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><div className="rounded-xl bg-white p-6"><p className="text-sm font-bold uppercase tracking-wider text-slate-400">Detailed lesson content</p><h3 className="mt-3 text-xl font-extrabold">{currentSession.objective}</h3><div className="mt-6 space-y-5 text-base leading-8 text-slate-600">{currentSession.content.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div><div className="rounded-xl bg-white p-6">{currentSession.kind === 'Practical' ? <><p className="text-sm font-bold uppercase tracking-wider text-slate-400">Coding practical</p><h3 className="mt-3 text-xl font-extrabold">{currentSession.codeScenario}</h3><p className="mt-3 text-base leading-7 text-slate-600">Use the three lectures before this checkpoint. Explain your approach, test it with normal and edge cases, then submit.</p><textarea value={code} onChange={(event) => setCode(event.target.value)} placeholder="Write your solution here..." className="mt-6 min-h-56 w-full rounded-lg border border-slate-200 p-4 font-mono text-base outline-none focus:border-pulse" /><button disabled={!code.trim()} onClick={submitSession} className="mt-4 rounded-lg bg-ink px-5 py-3 text-base font-bold text-white disabled:opacity-40">Submit practical</button></> : <><p className="text-sm font-bold uppercase tracking-wider text-slate-400">{currentSession.kind === 'Lecture MCQ' || currentSession.kind === 'Final Mock' ? 'MCQ assessment' : 'Lecture check'}</p>{currentSession.questions.map((question, questionIndex) => <div className="mt-6" key={question.prompt}><h3 className="text-lg font-extrabold leading-7">{question.prompt}</h3><div className="mt-3 grid gap-3">{question.choices.map((choice) => <button key={choice} onClick={() => setAnswers({ ...answers, [questionIndex]: choice })} className={`rounded-lg border-2 px-4 py-3 text-left text-base ${answers[questionIndex] === choice ? 'border-pulse bg-emerald-50' : 'border-slate-200'}`}>{choice}</button>)}</div></div>)}<button disabled={currentSession.questions.some((_question, index) => !answers[index])} onClick={submitSession} className="mt-6 rounded-lg bg-ink px-5 py-3 text-base font-bold text-white disabled:opacity-40">{currentSession.kind === 'Lecture MCQ' ? 'Finish MCQ and show mark' : currentSession.kind === 'Final Mock' ? 'Finish final mock' : 'Submit lecture check'}</button></>}</div></div>
    </section>}
    {showCheckpoint && checkpointScore !== null && <section className="mt-10 rounded-2xl border-2 border-pulse bg-emerald-50 p-8"><p className="eyebrow">Session result</p><h2 className="mt-2 text-3xl font-extrabold">Score: {checkpointMark} / 5</h2><p className="mt-2 text-xl font-bold text-pulse">Efficiency: {checkpointScore}%</p><p className="mt-4 text-slate-600">{needsRetake ? `You need at least ${PROFICIENCY_THRESHOLD}% to continue.` : currentSession?.kind === 'Lecture' ? 'Lecture quiz passed. The next session is ready.' : currentSession?.kind === 'Practical' ? 'Coding session completed. Continue to the next lesson.' : currentSession?.kind === 'Lecture MCQ' ? 'Lecture checkpoint passed. Continue to the next coding session.' : 'Final assessment passed.'}</p>{needsRetake ? <button onClick={restartModule} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white"><RotateCcw size={16} /> Retake course content</button> : checkpointPassed ? <button onClick={advanceAfterCheckpoint} className="mt-6 rounded-lg bg-pulse px-4 py-3 text-sm font-bold text-white">Continue</button> : <button onClick={() => { setShowCheckpoint(false); setCheckpointScore(null); setCheckpointMark(null); setCheckpointPassed(false); resetInputs(); }} className="mt-6 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white">Retake quiz</button>}</section>}
    {needsRetake && !showCheckpoint && <section className="mt-10 rounded-2xl border-2 border-rose-300 bg-rose-50 p-6"><h2 className="text-2xl font-extrabold">Retake required</h2><p className="mt-3 text-slate-600">Review both lecture topics and take the MCQ again before practical coding unlocks.</p></section>}
    {courseComplete && <section className="mt-10 rounded-2xl border-2 border-pulse bg-emerald-50 p-6 sm:p-10"><div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"><div><Award className="text-pulse" size={34} /><p className="eyebrow mt-5">Course completed</p><h2 className="mt-2 text-3xl font-extrabold">Certificate of completion</h2><p className="mt-3 text-slate-600">Awarded for completing the {role.role} skill course at {role.company}.</p></div><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white"><Printer size={16} /> Print certificate</button></div><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-lg bg-white p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Modules</p><p className="mt-2 text-2xl font-extrabold">{courseSkills.length}</p></div><div className="rounded-lg bg-white p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Sessions</p><p className="mt-2 text-2xl font-extrabold">{courseSkills.length * 17}</p></div><div className="rounded-lg bg-white p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Efficiency</p><p className="mt-2 text-2xl font-extrabold">{overallEfficiency}%</p></div></div><button onClick={restartCourse} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-pulse"><RotateCcw size={15} /> Restart course</button></section>}
  </main>;
}
