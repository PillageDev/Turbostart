import { githubOAuth, sendMagicLink } from "./server-actions";

export function createAuthService() {
  return new AuthService();
}

class AuthService {
  async loginWithMagicLink(email: string, redirectUrl: string | null) {
    const success = await sendMagicLink({ email, redirectUrl });

    if (!success) {
      throw new Error("Failed to send magic link. Please try again.");
    }

    return {
      success: true,
    };
  }

  async loginWithGithub(redirectUrl: string | null) {
    const data = await githubOAuth({ redirectUrl });

    if (!data.url) {
      throw new Error("Failed to log in with GitHub. Please try again.");
    }

    return {
      success: true,
      url: data.url,
    };
  }
}
