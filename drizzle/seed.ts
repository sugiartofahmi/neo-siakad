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
import { drizzle } from "drizzle-orm/node-postgres";

const dbUrl = process.env["DATABASE_URL"] as string;
const dbQueryClient = new Pool({
  connectionString: dbUrl,
});

const main = async () => {
  try {
    console.log("seed");
  } catch (error) {
    console.error(error);
  }
};

main();
