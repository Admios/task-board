CREATE MATERIALIZED VIEW tasks_by_state_id
AS SELECT id, text, state_id, position
FROM tasks
WHERE state_id IS NOT NULL AND id IS NOT NULL
PRIMARY KEY (state_id, id);
