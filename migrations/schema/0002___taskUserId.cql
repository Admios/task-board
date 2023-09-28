ALTER TABLE tasks ADD owner text;

---

ALTER TABLE columns ADD owner text;

---

CREATE INDEX idx_tasks_owner ON tasks (owner);

---

CREATE INDEX idx_columns_owner ON columns (owner);