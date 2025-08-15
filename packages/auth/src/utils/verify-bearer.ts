import { auth } from '../auth';

export async function verifyBearerToken(token: string) {
  try {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${token}`);

    const session = await auth.api.getSession({
      headers,
    });

    if (session?.user) {
      return session.user;
    }

    return null;
  } catch (error) {
    console.error('Bearer token verification failed:', error);
    return null;
  }
}
