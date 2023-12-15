import { join } from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [join("src", "styles")],
    prependData: `@import "./bulmaVariables";`,
  },
};

export default nextConfig;
