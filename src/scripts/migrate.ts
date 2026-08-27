import env from "@next/env";

const result = env.loadEnvConfig("./");
console.log("Loaded Env Files: ", result.loadedEnvFiles.map((f) => f.path));
console.log("Using database: ", process.env.SQLITE_PATH ?? "./data/tasks.db");

async function run() {
  const { db } = await import("@/model/SqliteClient");
  const { applySchema } = await import("@/model/schema");

  applySchema(db);
  console.log("Schema applied.");
  db.close();
}

run();
