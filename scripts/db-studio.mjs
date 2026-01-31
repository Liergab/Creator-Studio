/**
 * Run Prisma Studio.
 * Prisma Studio does not support MongoDB (any protocol). If DATABASE_URL
 * points to MongoDB, we print a helpful message and suggest alternatives.
 */
import "dotenv/config";

const url = process.env.DATABASE_URL || "";
const isMongo = /^mongodb(\+srv)?:\/\//i.test(url);

if (isMongo) {
  console.error("");
  console.error("  Prisma Studio does not support MongoDB.");
  console.error("");
  console.error("  Use one of these instead:");
  console.error("  • MongoDB Compass – https://www.mongodb.com/products/compass");
  console.error("  • Atlas Data Explorer – in your Atlas project: Browse Collections");
  console.error("  • mongosh – MongoDB shell");
  console.error("");
  process.exit(1);
}

import { spawnSync } from "child_process";
const out = spawnSync("pnpm", ["exec", "prisma", "studio"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});
process.exit(out.status ?? 1);
