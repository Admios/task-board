CREATE TABLE IF NOT EXISTS "users" (
  "email" TEXT PRIMARY KEY
);

-- Deliberately has NO foreign key to "users". During passkey registration the
-- challenge row is written before the user exists (see PasskeyAuthenticationFlow
-- .generateOptions); an FK here would make every new-user signup fail.
CREATE TABLE IF NOT EXISTS "authentication_challenges" (
  "id"        TEXT PRIMARY KEY,
  "challenge" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "authenticators" (
  "credentialID"         TEXT PRIMARY KEY,
  "credentialPublicKey"  BLOB    NOT NULL,
  "counter"              INTEGER NOT NULL DEFAULT 0,
  "credentialDeviceType" TEXT    NOT NULL,
  "credentialBackedUp"   INTEGER NOT NULL DEFAULT 0,
  "transports"           TEXT,
  "userId"               TEXT    NOT NULL
                         REFERENCES "users"("email") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_authenticators_userId" ON "authenticators" ("userId");

CREATE TABLE IF NOT EXISTS "boards" (
  "id"    TEXT PRIMARY KEY,
  "name"  TEXT NOT NULL,
  "owner" TEXT NOT NULL
          REFERENCES "users"("email") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_boards_owner" ON "boards" ("owner");

CREATE TABLE IF NOT EXISTS "states" (
  "id"       TEXT PRIMARY KEY,
  "name"     TEXT NOT NULL,
  "boardId"  TEXT NOT NULL
             REFERENCES "boards"("id") ON DELETE CASCADE,
  "position" INTEGER NOT NULL DEFAULT 0,
  "color"    TEXT
);
CREATE INDEX IF NOT EXISTS "idx_states_boardId" ON "states" ("boardId");

CREATE TABLE IF NOT EXISTS "tasks" (
  "id"       TEXT PRIMARY KEY,
  "text"     TEXT NOT NULL,
  "stateId"  TEXT NOT NULL
             REFERENCES "states"("id") ON DELETE CASCADE,
  "position" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS "idx_tasks_stateId" ON "tasks" ("stateId");
