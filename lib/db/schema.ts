import {
  timestamp,
  text,
  pgTable,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";

// Better Auth tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// App-specific tables
export const cvs = pgTable("cvs", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  originalContent: text("originalContent").notNull(),
  fileType: text("fileType").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const cvOptimizations = pgTable("cv_optimizations", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  cvId: text("cvId").notNull(),
  jobDescription: text("jobDescription").notNull(),
  optimizedContent: text("optimizedContent").notNull(),
  atsScore: numeric("atsScore").notNull(),
  keywords: text("keywords"),
  suggestions: text("suggestions"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
