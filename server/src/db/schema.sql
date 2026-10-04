-- Postly schema. Safe to re-run: drops and recreates every table.

DROP TABLE IF EXISTS capsules;
DROP TABLE IF EXISTS postcards;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS session;

CREATE TABLE templates (
  id    SERIAL PRIMARY KEY,
  slug  TEXT NOT NULL UNIQUE,
  name  TEXT NOT NULL
);

-- One row per account. Passwords are stored only as bcrypt hashes.
CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE postcards (
  id             SERIAL PRIMARY KEY,
  -- Whose postcard it is. Deleting an account deletes its postcards (and,
  -- through the capsules table, their capsules).
  user_id        INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  image_url      TEXT NOT NULL,
  caption        VARCHAR(140) NOT NULL DEFAULT '',
  template_id    INTEGER NOT NULL REFERENCES templates (id),
  postcard_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One postcard per day PER USER: the streaks depend on it.
  UNIQUE (user_id, postcard_date)
);


CREATE TABLE capsules (
  id           SERIAL PRIMARY KEY,
  postcard_id  INTEGER NOT NULL REFERENCES postcards (id) ON DELETE CASCADE,
  message      VARCHAR(500) NOT NULL,
  unlock_at    DATE NOT NULL,
  opened_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Logins. express-session keeps one row per logged-in browser here: the
-- cookie holds only the random sid, never the user's details. This is the
-- table layout connect-pg-simple expects.
CREATE TABLE session (
  sid     VARCHAR NOT NULL PRIMARY KEY,
  sess    JSON NOT NULL,
  expire  TIMESTAMP(6) NOT NULL
);
CREATE INDEX session_expire_idx ON session (expire);

INSERT INTO templates (slug, name) VALUES
  ('classic',  'Classic'),
  ('polaroid', 'Polaroid'),
  ('airmail',  'Airmail');
