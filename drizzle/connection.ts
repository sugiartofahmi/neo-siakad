import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  users,
  roles,
  userAffiliations,
  activities,
  organizations,
  organizationLevel,
  faculty,
  department,
  reviews,
  proposals,
  proposalStatus,
  accounts,
  sessions,
  verificationTokens,
} from "./schema";

const dbUrl = process.env.DATABASE_URL!;

const dbQueryClient = new Pool({
  connectionString: dbUrl,
});

export const db = drizzle(dbQueryClient, {
  schema: {
    users,
    roles,
    userAffiliations,
    activities,
    organizations,
    organizationLevel,
    faculty,
    department,
    reviews,
    proposals,
    proposalStatus,
    accounts,
    sessions,
    verificationTokens,
  },
});
