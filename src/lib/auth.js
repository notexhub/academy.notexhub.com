import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export async function getAuthUser(req) {
  try {
    // 1. Try Authorization Header
    const authHeader = req.headers.get('Authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // 2. Fall back to notex_session Cookie if header token is missing or malformed
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      token = cookies().get('notex_session')?.value;
    }

    if (!token) return null;

    // 3. Verify and return decoded user
    return await verifyToken(token).catch(() => null);
  } catch (error) {
    return null;
  }
}
