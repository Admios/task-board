import { Client, mapping } from "cassandra-driver";

const contactPoints = (process.env.CASSANDRA_HOSTS ?? "127.0.0.1").split(",");
const keyspace = process.env.CASSANDRA_KEYSPACE ?? "tasks";
const localDataCenter = process.env.CASSANDRA_LOCAL_DATACENTER ?? "datacenter1";

export const client = new Client({
  contactPoints,
  localDataCenter,
  keyspace,
});

export const mapper = new mapping.Mapper(client, {
  models: {
    State: {
      tables: ["states"],
      mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
    },

    Task: {
      tables: ["tasks"],
      mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
    },

    User: {
      tables: ["users"],
      mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
      columns: {
        // The userId is the username!
        id: {
          name: "username",
        },
      },
    },

    Authenticator: {
      tables: ["authenticators"],
      mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
      columns: {
        id: {
          name: "credentialID",
          fromModel(value: Uint8Array) {
            return Buffer.from(value).toString("base64url");
          },
          toModel(columnValue: string) {
            return Buffer.from(columnValue, "base64url");
          },
        },

        credential_public_key: {
          name: "credentialPublicKey",
          fromModel(value: Uint8Array): string {
            return Buffer.from(value).toString("base64url");
          },
          toModel(columnValue: string): Uint8Array {
            return Buffer.from(columnValue, "base64url");
          },
        },

        transports: {
          name: "transports",
          fromModel(value?: string[]): string[] {
            return value ?? [];
          },
          toModel(columnValue?: string[]): string[] {
            return columnValue ?? [];
          },
        },
      },
    },
  },
});
