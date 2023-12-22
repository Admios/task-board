CREATE TABLE IF NOT EXISTS boards (
  id text,
  name text,
  owner text,
  PRIMARY KEY (id)
);

---

ALTER TABLE states ADD board_id text;

--- 

CREATE INDEX idx_boards_owner ON boards (owner);
