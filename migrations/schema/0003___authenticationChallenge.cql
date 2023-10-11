ALTER TABLE users DROP current_challenge;

---

CREATE TABLE IF NOT EXISTS authentication_challenges (
    id text,
    challenge text,
    PRIMARY KEY (id)
);

