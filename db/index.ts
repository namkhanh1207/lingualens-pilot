import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const database = env.DB || env.LINGUALENS_DB;
  if (!database) {
    throw new Error(
      "Cloudflare D1 binding `DB` or `LINGUALENS_DB` is unavailable."
    );
  }

  return drizzle(database, { schema });
}
