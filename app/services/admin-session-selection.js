function usableSessions(sessions = []) {
  return sessions.filter((session) => (
    typeof session?.shop === 'string'
    && session.shop.length > 0
    && typeof session?.accessToken === 'string'
    && session.accessToken.length > 0
  ));
}

export function selectAdminSession(sessions, requestedHostname) {
  const usable = usableSessions(sessions);
  const exactMatch = usable.find((session) => session.shop === requestedHostname);
  if (exactMatch) return exactMatch;

  const installedShops = new Set(usable.map((session) => session.shop));
  if (installedShops.size !== 1) return null;

  return usable[0] || null;
}
