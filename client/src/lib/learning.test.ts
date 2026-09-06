import { describe, expect, it } from 'vitest';
import { createCourseSessions, evaluateCode, getEfficiency } from './learning';

describe('course sessions', () => {
  it('creates ten lectures, a lecture MCQ, five practicals, and a final mock', () => {
    const sessions = createCourseSessions('SQL');
    expect(sessions).toHaveLength(17);
    expect(sessions.filter((session) => session.kind === 'Lecture')).toHaveLength(10);
    expect(sessions.find((session) => session.kind === 'Lecture MCQ')?.questions).toHaveLength(5);
    expect(sessions.filter((session) => session.kind === 'Practical')).toHaveLength(5);
    expect(sessions.at(-1)?.kind).toBe('Final Mock');
    expect(sessions.slice(0, 10).filter((session) => session.kind === 'Lecture')).toHaveLength(8);
    expect(sessions[3].kind).toBe('Practical');
    expect(sessions[7].kind).toBe('Practical');
    expect(sessions[11].kind).toBe('Practical');
    expect(sessions.filter((session) => session.kind === 'Lecture').every((session) => session.questions.length === 5)).toBe(true);
    expect(new Set(sessions.filter((session) => session.kind === 'Lecture').map((session) => session.content)).size).toBe(10);
  });

  it('calculates efficiency percentage', () => { expect(getEfficiency(3, 5)).toBe(60); });

  it('accepts a substantial code answer containing the topic syntax', () => {
    expect(evaluateCode('def total(values):\n    return sum(values)', ['def', 'return'])).toBe(true);
    expect(evaluateCode('short', ['def', 'return'])).toBe(false);
  });
});
