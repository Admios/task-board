DROP INDEX idx_states_owner;

---

DROP INDEX idx_tasks_owner;

---

ALTER TABLE states DROP owner;

---

ALTER TABLE tasks DROP owner;

---

CREATE INDEX idx_tasks_state ON tasks (state_id);

---

CREATE INDEX idx_states_board ON states (board_id);
