import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullname: text("fullname"),
  email: text("email").notNull(),
  password: text("password"),
  roleId: text("role_id")
    .notNull()
    .references(() => roles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name"),
  permissions: text("permissions").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userAffiliations = pgTable(
  "user_affiliations",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: text("organization_id").references(() => organizations.id),
    facultyId: text("faculty_id").references(() => faculty.id),
    departmentId: text("department_id").references(() => department.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
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

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  location: text("location"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  budget: text("budget"),
  applicantId: text("applicant_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name"),
  facultyId: text("faculty_id").references(() => faculty.id),
  departmentId: text("department_id").references(() => department.id),
  organizationLevelId: text("organization_level_id").references(
    () => organizationLevel.id
  ),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const organizationLevel = pgTable("organization_level", {
  id: serial("id").primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const department = pgTable("department", {
  id: serial("id").primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reviewerId: text("reviewer_id").references(() => users.id),
  proposalId: text("proposal_id").references(() => proposals.id),
  isApproved: boolean("is_approved"),
  commenst: text("commenst"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title"),
  file: text("file"),
  proposalStatusId: text("proposal_staus_id").references(
    () => proposalStatus.id
  ),
  activityId: text("activity_id").references(() => activities.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const proposalStatus = pgTable("proposal_status", {
  id: serial("id").primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

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

//
export const usersRelations = relations(users, ({ one, many }) => ({
  userAffiliations: one(userAffiliations),
  roles: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const userAffiliationsRelations = relations(
  userAffiliations,
  ({ one }) => ({
    faculty: one(faculty, {
      fields: [userAffiliations.facultyId],
      references: [faculty.id],
    }),
    department: one(department, {
      fields: [userAffiliations.departmentId],
      references: [department.id],
    }),
    organization: one(organizations, {
      fields: [userAffiliations.organizationId],
      references: [organizations.id],
    }),
  })
);
export const activitiesRelations = relations(activities, ({ one, many }) => ({
  users: one(users, {
    fields: [activities.applicantId],
    references: [users.id],
  }),
  proposals: many(proposals),
}));
export const organizationsRelations = relations(organizations, ({ one }) => ({
  faculty: one(faculty, {
    fields: [organizations.facultyId],
    references: [faculty.id],
  }),
  department: one(department, {
    fields: [organizations.departmentId],
    references: [department.id],
  }),
  organizationLevel: one(organizationLevel, {
    fields: [organizations.organizationLevelId],
    references: [organizationLevel.id],
  }),
}));
export const organizationLevelRelations = relations(
  organizationLevel,
  ({ many }) => ({
    organization: many(organizations),
  })
);
export const facultyRelations = relations(faculty, ({ many }) => ({
  userAffiliations: many(userAffiliations),
  organizations: many(organizations),
}));
export const departmentRelations = relations(department, ({ many }) => ({
  userAffiliations: many(userAffiliations),
  organizations: many(organizations),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
  proposal: one(proposals, {
    fields: [reviews.proposalId],
    references: [proposals.id],
  }),
}));
export const proposalsRelations = relations(proposals, ({ one }) => ({
  proposalStatus: one(proposalStatus, {
    fields: [proposals.proposalStatusId],
    references: [proposalStatus.id],
  }),
  activity: one(activities, {
    fields: [proposals.activityId],
    references: [activities.id],
  }),
}));

export const proposalStatusRelations = relations(
  proposalStatus,
  ({ many }) => ({
    proposals: many(proposals),
  })
);
