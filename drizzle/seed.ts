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

const seedFaculty = async () => {
  const facultyhExist = await db.select({ id: faculty.id }).from(faculty);

  if (facultyhExist.length) {
    return;
  }

  console.log("Seeding faculty... 🚀");
  await db.insert(faculty).values([
    {
      name: "Fakultas Agama Islam",
    },
    {
      name: "Fakultas Ekonomi",
    },
    {
      name: "Fakultas Hukum",
    },
    {
      name: "Fakultas Ilmu Komunikasi",
    },
    {
      name: "Fakultas Keguruan dan Ilmu Pendidikan",
    },
    {
      name: "Fakultas Pertanian",
    },
    {
      name: "Fakultas Teknik",
    },
    {
      name: "Fakultas Teknik",
    },
  ]);
  console.log("Seeding faculty done! 🎊");
};

const seedDepartment = async () => {
  const [departmentExist, dataFaculty] = await Promise.all([
    db.select({ id: department.id }).from(department),
    db.select({ id: faculty.id, name: faculty.name }).from(faculty),
  ]);

  if (departmentExist.length || !dataFaculty.length) {
    return;
  }

  const fkId = dataFaculty.filter((el) =>
    el?.name.includes("Fakultas Ekonomi")
  )[0].id;
  const fkipId = dataFaculty.filter((el) =>
    el.name.includes("Fakultas Keguruan dan Ilmu Pendidikan")
  )[0].id;
  const faiId = dataFaculty.filter((el) =>
    el.name.includes("Fakultas Agama Islam")
  )[0].id;
  const fhId = dataFaculty.filter((el) => el.name.includes("Fakultas Hukum"))[0]
    .id;
  const fikomId = dataFaculty.filter((el) =>
    el.name.includes("Fakultas Ilmu Komunikasi")
  )[0].id;
  const ftanId = dataFaculty.filter((el) =>
    el.name.includes("Fakultas Pertanian")
  )[0].id;
  const ftekId = dataFaculty.filter((el) =>
    el.name.includes("Fakultas Teknik")
  )[0].id;

  console.log("Seeding department... 🚀");
  await db.insert(department).values([
    {
      name: "Komunikasi dan Penyiaran Islam",
      facultyId: faiId,
    },
    {
      name: "Pendidikan Agama Islam",
      facultyId: faiId,
    },
    {
      name: "Pendidikan Guru Madrasah Ibtidaiyah",

      facultyId: faiId,
    },
    {
      name: "Perbankan Syariah",

      facultyId: faiId,
    },
    {
      name: "Akuntansi",

      facultyId: fkId,
    },
    {
      name: "Manajemen",

      facultyId: fkId,
    },
    {
      name: "Ilmu Hukum",

      facultyId: fhId,
    },
    {
      name: "Ilmu Komunikasi",

      facultyId: fikomId,
    },
    {
      name: "Ilmu Perpustakaan",

      facultyId: fikomId,
    },
    {
      name: "Pendidikan Bahasa Arab",

      facultyId: fkipId,
    },
    {
      name: "Pendidikan Bahasa dan Sastra Indonesia",

      facultyId: fkipId,
    },
    {
      name: "Pendidikan Bahasa Ingris",

      facultyId: fkipId,
    },
    {
      name: "Pendidikan Guru Pendidikan Anak Usia Dini",

      facultyId: fkipId,
    },
    {
      name: "Pendidikan Luar Biasa",

      facultyId: fkipId,
    },
    {
      name: "Pendidikan Luar Sekolah",

      facultyId: fkipId,
    },
    {
      name: "Pendidikan Matematika",

      facultyId: fkipId,
    },
    {
      name: "Pendidikan Pancasila dan Kewarganegaraan",

      facultyId: fkipId,
    },
    {
      name: "Agroteknologi",

      facultyId: ftanId,
    },
    {
      name: "Teknik Elektro",

      facultyId: ftekId,
    },
    {
      name: "Teknik Informatika",
      facultyId: ftekId,
    },
    {
      name: "Teknik Industri",
      facultyId: ftekId,
    },
  ]);
};

const main = async () => {
  try {
    await seedRole();
    await seedFaculty();
    await seedDepartment();
  } catch (error) {
    console.error(error);
  }
};

main();
