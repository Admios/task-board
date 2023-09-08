const nextJest = require("next/jest");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");
const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  displayName: {
    name: "Tasks Frontend",
    color: "blueBright",
  },
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  testPathIgnorePatterns: ["<rootDir>/.next"],

  // Do not put anything here: it will be overwritten by createJestConfig
  transformIgnorePatterns: [],
};

// based on https://stackoverflow.com/a/74903612
module.exports = async function () {
  const makeConfig = await createJestConfig(customJestConfig);
  const finalConfig = await makeConfig();

  // Allow certain libraries to be transpiled with TS Jest
  finalConfig.transformIgnorePatterns[0] =
    "/node_modules/(?!react-dnd|dnd-core|@react-dnd|redux|@babel|@simplewebauthn)";

  return finalConfig;
};
