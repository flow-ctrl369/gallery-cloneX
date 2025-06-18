const { execSync } = require("child_process");

console.log("Running database migrations...");

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  console.log("Running database migrations...");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });

  console.log("Database migrations completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}
