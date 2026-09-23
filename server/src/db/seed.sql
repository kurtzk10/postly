-- Sample postcards on past days so the gallery isn't empty on first run.
-- Dates are relative to today, and today is left free so you can make one.

INSERT INTO postcards (image_url, caption, template_id, postcard_date) VALUES
  ('https://res.cloudinary.com/demo/image/upload/cld-sample.jpg',   'Coffee on the balcony before anyone else was up.',  1, CURRENT_DATE - 1),
  ('https://res.cloudinary.com/demo/image/upload/kitten.jpg',       'The neighbour''s cat decided I was worth visiting.', 2, CURRENT_DATE - 2),
  ('https://res.cloudinary.com/demo/image/upload/yellow_tulip.jpg', 'First tulip of the year.',                           3, CURRENT_DATE - 3),
  ('https://res.cloudinary.com/demo/image/upload/bike.jpg',         'Rode the long way home.',                            1, CURRENT_DATE - 4),
  ('https://res.cloudinary.com/demo/image/upload/beach.jpg',        'Cold water, warm sand.',                             2, CURRENT_DATE - 5),
  ('https://res.cloudinary.com/demo/image/upload/mountain.jpg',     'Made it to the top, legs did not agree.',            3, CURRENT_DATE - 6),
  ('https://res.cloudinary.com/demo/image/upload/dog.jpg',          'Dog-sitting day.',                                   1, CURRENT_DATE - 9),
  ('https://res.cloudinary.com/demo/image/upload/horses.jpg',       'Horses by the fence on the drive out.',              2, CURRENT_DATE - 10),
  ('https://res.cloudinary.com/demo/image/upload/cld-sample-4.jpg', 'Tried a new recipe. It worked!',                     3, CURRENT_DATE - 17);
