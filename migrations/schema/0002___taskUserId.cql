ALTER TABLE tasks ADD owner text;

---

ALTER TABLE states ADD owner text;

---

CREATE INDEX idx_tasks_owner ON tasks (owner);

---

CREATE INDEX idx_states_owner ON states (owner);