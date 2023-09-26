CREATE TABLE IF NOT EXISTS authenticators (
  id text,
  credential_public_key text,
  counter int,
  credential_device_type text,
  credential_backed_up boolean,
  transports set<varchar>,
  user_id text,
  PRIMARY KEY (id)
);

---

CREATE INDEX idx_authenticators_user_id ON authenticators (user_id)

---

CREATE TABLE IF NOT EXISTS columns (
  id text,
  name text,
  position int,
  color text,
  PRIMARY KEY (id)
);

---

CREATE TABLE IF NOT EXISTS tasks (
  id text,
  text text,
  column_id text,
  position int,
  PRIMARY KEY (id)
);

---

CREATE TABLE IF NOT EXISTS users (
  id text,
  current_challenge text,
  PRIMARY KEY (id)
);



