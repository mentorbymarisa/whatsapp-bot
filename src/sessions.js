const sessions = new Map();
const SESSION_TTL = 60 * 60 * 1000;

function getSession(userId) {
  const session = sessions.get(userId);
  if (!session) return null;
  if (Date.now() - session.updatedAt > SESSION_TTL) {
    sessions.delete(userId);
    return null;
  }
  return session;
}

function setSession(userId, update) {
  const existing = getSession(userId) || { step: 'name', data: {}, updatedAt: Date.now() };
  const updated = { ...existing, ...update, updatedAt: Date.now() };
  sessions.set(userId, updated);
  return updated;
}

function deleteSession(userId) {
  sessions.delete(userId);
}

module.exports = { getSession, setSession, deleteSession };
