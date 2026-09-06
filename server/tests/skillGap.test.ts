import { describe, expect, it } from 'vitest';
import { computeSkillGap } from '../src/lib/skillGap';

describe('computeSkillGap', () => {
  it('matches known skills without case or whitespace sensitivity', () => {
    expect(computeSkillGap(['Python', 'SQL', 'Git'], [' python ', 'GIT'])).toEqual({ alreadyHave: ['Python', 'Git'], toDevelop: ['SQL'] });
  });

  it('returns every role skill as a development target when none are known', () => {
    expect(computeSkillGap(['Python', 'SQL'], [])).toEqual({ alreadyHave: [], toDevelop: ['Python', 'SQL'] });
  });
});
