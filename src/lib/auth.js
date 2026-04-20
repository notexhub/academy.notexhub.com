import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export async function getAuthUser(req) {
  try {
    // 1. Try Authorization Header
    const authHeader = req.headers.get('Authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    let source = 'header';

    // 2. Fall back to notex_session Cookie if header token is missing or malformed
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      token = cookies().get('notex_session')?.value;
      source = 'cookie';
    }

    if (!token) {
      return { user: null, reason: 'no_token_found', source: 'none' };
    }

    // 3. Verify and return decoded user
    const decoded = await verifyToken(token).catch(() => null);
    
    if (!decoded) {
      return { user: null, reason: 'invalid_token', source, tokenPrefix: token.substring(0, 10) };
    }

    return { user: decoded, reason: 'ok', source, token };
  } catch (error) {
    return { user: null, reason: 'crash_' + error.message, source: 'error' };
  }
}
