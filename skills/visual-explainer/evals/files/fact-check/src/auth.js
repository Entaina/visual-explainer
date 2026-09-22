const EXPIRY_MINUTES = 60;

export function verifyToken(token, now = Date.now()) {
  if (!token || !token.issuedAt) return { valid: false, reason: "malformed" };
  const ageMinutes = (now - token.issuedAt) / 60000;
  if (ageMinutes > EXPIRY_MINUTES) return { valid: false, reason: "expired" };
  return { valid: true };
}
