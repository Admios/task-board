import { readFileSync } from "fs";
import gql from "graphql-tag";

export const typeDefs = gql(
    readFileSync("src/pages/api/graphql/schema.graphql", {
      encoding: "utf-8",
    })
  );