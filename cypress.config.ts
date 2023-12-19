import env from "@next/env";
import { defineConfig } from "cypress";

const { combinedEnv } = env.loadEnvConfig(process.cwd());

export default defineConfig({
  env: combinedEnv,
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
