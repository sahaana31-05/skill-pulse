export function computeSkillGap(roleSkills: string[], knownSkills: string[]) {
  const known = new Set(knownSkills.map((skill) => skill.trim().toLowerCase()).filter(Boolean));
  const alreadyHave = roleSkills.filter((skill) => known.has(skill.trim().toLowerCase()));
  const toDevelop = roleSkills.filter((skill) => !known.has(skill.trim().toLowerCase()));

  return { alreadyHave, toDevelop };
}
