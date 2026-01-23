import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  {
    ignores: ["out/**", ".next/**", "src/types/**", "coverage/**"],
  },
  ...nextCoreWebVitals,
]);
