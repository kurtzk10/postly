-- Sample data so the app isn't empty on first run.
--
-- A DEMO ACCOUNT owns the sample postcards. Log in with:
--   email:    demo@postly.app
--   password: postly-demo
-- It's only for trying the app locally. Never seed it into a real deployment.
INSERT INTO users (email, password_hash) VALUES
  ('demo@postly.app', '$2b$12$o3MCLXKwSp0Vty.ExX/V9eH6JXXHrc8Y94jEocfs67yr.YF56tuOG');

-- Postcards on past days. Today is left free so you can make one.
INSERT INTO postcards (user_id, image_url, caption, template_id, postcard_date) VALUES
  (1, 'https://res.cloudinary.com/demo/image/upload/cld-sample.jpg',   'Coffee on the balcony before anyone else was up.',  1, CURRENT_DATE - 1),
  (1, 'https://res.cloudinary.com/demo/image/upload/kitten.jpg',       'The neighbour''s cat decided I was worth visiting.', 2, CURRENT_DATE - 2),
  (1, 'https://res.cloudinary.com/demo/image/upload/yellow_tulip.jpg', 'First tulip of the year.',                           3, CURRENT_DATE - 3),
  (1, 'https://res.cloudinary.com/demo/image/upload/bike.jpg',         'Rode the long way home.',                            1, CURRENT_DATE - 4),
  (1, 'https://res.cloudinary.com/demo/image/upload/beach.jpg',        'Cold water, warm sand.',                             2, CURRENT_DATE - 5),
  (1, 'https://res.cloudinary.com/demo/image/upload/mountain.jpg',     'Made it to the top, legs did not agree.',            3, CURRENT_DATE - 6),
  (1, 'https://res.cloudinary.com/demo/image/upload/dog.jpg',          'Dog-sitting day.',                                   1, CURRENT_DATE - 9),
  (1, 'https://res.cloudinary.com/demo/image/upload/horses.jpg',       'Horses by the fence on the drive out.',              2, CURRENT_DATE - 10),
  (1, 'https://res.cloudinary.com/demo/image/upload/cld-sample-4.jpg', 'Tried a new recipe. It worked!',                     3, CURRENT_DATE - 17);
