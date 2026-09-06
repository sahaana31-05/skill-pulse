# Skill Pulse

Skill Pulse is a full-stack skill intelligence platform for exploring the skills associated with roles at Accenture, TCS, Microsoft, IBM, and Deloitte.

## Stack

- React, Vite, TypeScript, Tailwind CSS
- Express, Prisma, SQLite
- TanStack Query, React Router, Zod
- Vitest for skill-gap logic

## Setup

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

The client runs at `http://localhost:5173` and the API runs at `http://localhost:4000`.

Useful commands:

```bash
npm test
npm run build
```

The default `npm run build` builds the frontend only and does not require a database or environment variables, which is suitable for a static Vercel deployment. Use `npm run build:full` when you also want to compile the Express and Prisma server locally. The API-backed role data and skill-gap actions require the server and database to be deployed separately; a frontend-only deployment can still render the client shell, but those API requests will not have a backend until that service is hosted.

The SQLite database is created at `server/prisma/dev.db`. The dataset contains exactly 50 role records. Sources are reference points and should be rechecked against current job postings before being treated as current market requirements.

## Learning course

Open any role, use the search bar to enter the skills the student already knows, and choose `Start course`. No recommended skill list is displayed. The session map lets the learner choose which missing-skill module to start from. Every remaining skill becomes a course module with exactly 17 sessions:

- 10 detailed lecture sessions covering two valid topics, with at least four content paragraphs per topic; every lecture has its own content and five related MCQs
- 1 five-question lecture MCQ assessment based on the lecture content, with the mark and efficiency displayed immediately after submission
- 5 practical coding sessions with scenarios, code entry, debugging, and testing
- 1 final mock MCQ after the lectures and practical work

Each lecture displays a mark out of 5 immediately after submission. A score above 3 is required to continue from that lecture. A coding practical is placed after lecture 3, lecture 6, lecture 9, the lecture MCQ checkpoint, and the remaining lecture block. The full session map remains open so learners can review any lecture or open any coding practical directly. The learner must reach 70% on the lecture MCQ before the later practical coding sessions unlock. Below that threshold, the learner is asked to retake both lecture topics and the MCQ. After all unknown-skill modules and final mocks are complete, Skill Pulse displays a certificate of completion with the total modules, 17 sessions per module, and overall efficiency. The certificate can be printed from the browser. Progress is held in the active browser session and can be restarted.

Lecture content begins with an everyday recipe-style explanation, then introduces the technical words, then gives a simple way to study and check the idea. This is designed for learners who have no previous computer or programming background.
