declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ADMIN_EMAILS?: string;
    RESEARCHER_EMAILS?: string;
    MODERATOR_EMAILS?: string;
    GEMINI_API_KEY?: string;
    GEMINI_MODEL?: string;
    BUCKET?: R2Bucket;
  }
}
