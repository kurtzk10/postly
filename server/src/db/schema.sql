-- Postly schema. Safe to re-run: drops and recreates every table.

DROP TABLE IF EXISTS capsules;
DROP TABLE IF EXISTS postcards;
DROP TABLE IF EXISTS templates;

CREATE TABLE templates (
  id    SERIAL PRIMARY KEY,
  slug  TEXT NOT NULL UNIQUE,
  name  TEXT NOT NULL
);

CREATE TABLE postcards (
  id             SERIAL PRIMARY KEY,
  image_url      TEXT NOT NULL,
  caption        VARCHAR(140) NOT NULL DEFAULT '',
  template_id    INTEGER NOT NULL REFERENCES templates (id),
  -- One postcard per day: the streaks depend on it.
  postcard_date  DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE capsules (
  id           SERIAL PRIMARY KEY,
  postcard_id  INTEGER NOT NULL REFERENCES postcards (id) ON DELETE CASCADE,
  message      VARCHAR(500) NOT NULL,
  unlock_at    DATE NOT NULL,
  opened_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO templates (slug, name) VALUES
  ('classic',  'Classic'),
  ('polaroid', 'Polaroid'),
  ('airmail',  'Airmail');
