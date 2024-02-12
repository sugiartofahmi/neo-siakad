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
import { faker } from "@faker-js/faker";
const dbUrl = process.env["DATABASE_URL"] as string;
const dbQueryClient = new Pool({
  connectionString: dbUrl,
});

const db = drizzle(dbQueryClient, {
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

const seedRole = async () => {
  const roleExist = await db.select({ id: roles.id }).from(roles);

  if (roleExist.length) {
    return;
  }
  console.log("Seeding roles... 🚀");

  await db.insert(roles).values([
    {
      name: "Admin",
    },
    {
      name: "Wakil Rektor",
    },
    {
      name: "Kemahasiswaan",
    },
    {
      name: "Wakil Dekan",
    },
    {
      name: "Ketua Program Studi",
    },
    {
      name: "Ormawa",
    },
  ]);
  console.log("Seeding roles done! 🎊");
};

const main = async () => {
  try {
    console.log("seed");
  } catch (error) {
    console.error(error);
  }
};

main();
