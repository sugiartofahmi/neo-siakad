import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  fullname: text("fullname"),
  email: text("email").notNull(),
  password: text("password"),
  roleId: text("role_id").notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  userAffiliations: one(userAffiliations),
  roles: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const roles = pgTable("roles", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  permissions: text("permissions").array(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const userAffiliations = pgTable(
  "user_affiliations",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: text("organization_id"),
    facultyId: text("faculty_id"),
    departmentId: text("department_id"),
  },
  (affiliations) => ({
    compoundKeyOrganization: primaryKey({
      columns: [affiliations.userId, affiliations.organizationId],
    }),
    compoundKeyUnit: primaryKey({
      columns: [affiliations.facultyId, affiliations.departmentId],
    }),
  })
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
