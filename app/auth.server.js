export async function generateAuthUrl(conversationId, shopId) {
  const { storeCodeVerifier } = await import('./db.server');
  const clientId = process.env.SHOPIFY_API_KEY;
  const scope = "customer-account-mcp-api:full";
  const responseType = "code";
  const redirectUri = process.env.REDIRECT_URL;
  const state = `${conversationId}-${shopId}-${Date.now()}`;
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  try { await storeCodeVerifier(state, verifier); } catch (error) { console.error('Failed to store code verifier:', error); }
  const codeChallengeMethod = "S256";
  const baseAuthUrl = await getBaseAuthUrl(conversationId);
  if (!baseAuthUrl) throw new Error('Base auth URL not found');
  const authUrl = `${baseAuthUrl}?client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&state=${state}&code_challenge=${challenge}&code_challenge_method=${codeChallengeMethod}`;
  return { url: authUrl, conversation_id: conversationId };
}

async function getBaseAuthUrl(conversationId) {
  const { getCustomerAccountUrls } = await import('./db.server');
  const result = await getCustomerAccountUrls(conversationId);
  return result?.authorizationUrl;
}

export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(convertBufferToString(array));
}

export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digestOp = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(convertBufferToString(digestOp));
}

function convertBufferToString(buffer) {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer)));
}

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
