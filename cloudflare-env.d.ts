declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    LINGUALENS_DB?: D1Database;
    AUTH_MODE?: 'cloudflare-access' | 'sites' | 'local-test';
    ACCESS_TEAM_DOMAIN?: string;
    ACCESS_AUD?: string;
    ADMIN_EMAILS?: string;
    RESEARCHER_EMAILS?: string;
    MODERATOR_EMAILS?: string;
    GEMINI_API_KEY?: string;
    GEMINI_MODEL?: string;
    BUCKET?: R2Bucket;
  }
}
