import { cassandraClient } from "@/cassandra";

export interface UserEntity {
  id: string;
  username: string;
  currentChallenge?: string;
}

const userSchema = {
  fields: {
    id: {
      type: "uuid",
      default: { $db_function: "uuid()" },
    },
    username: "text",
    currentChallenge: "text",
  },
  key: ["id"],
};

export const UserModel = cassandraClient.model("User", userSchema);

UserModel.syncDB();
