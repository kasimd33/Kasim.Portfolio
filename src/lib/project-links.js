export function getProjectSource(project, githubProfile = '') {
  if (project.github?.trim()) return { href: project.github.trim(), label: 'View repository', kind: 'repository' };
  if (githubProfile?.trim()) return { href: githubProfile.trim(), label: 'GitHub profile', kind: 'profile' };
  return { href: 'https://github.com/', label: 'GitHub', kind: 'github' };
}
