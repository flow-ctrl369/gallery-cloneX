const { execSync } = require("child_process");

console.log("Running database migrations...");

try {
  // Generate Prisma client
  execSync("npx prisma generate", { stdio: "inherit" });

  // Run migrations
  execSync("npx prisma migrate deploy", { stdio: "inherit" });

  console.log("Database migrations completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}
