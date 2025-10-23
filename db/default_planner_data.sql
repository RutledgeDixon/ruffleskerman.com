USE wedding_planner_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE card;
TRUNCATE TABLE category;
TRUNCATE TABLE user;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO user (name, password) VALUES
('RuRu', 'securepassword123');

INSERT INTO category (title, description, progress, user_id) VALUES
('food', 'do you like food?', 0, (SELECT id FROM user WHERE name = 'RuRu')),
('photos', 'do you like photos?', 0, (SELECT id FROM user WHERE name = 'RuRu'));

INSERT INTO card (title, description, answer, imageurl, url, checked, category_id) VALUES
('chocolate', 'do you like chocolate?', 'yes', '/images/chocolate.jpg', '', false, (SELECT id FROM category WHERE title = 'food' AND user_id = (SELECT id FROM user WHERE name = 'RuRu'))),
('vanilla', 'do you like vanilla?', '', '', '', false, (SELECT id FROM category WHERE title = 'food' AND user_id = (SELECT id FROM user WHERE name = 'RuRu'))),
('guests', 'do you like guest photos?', 'no', '', '', false, (SELECT id FROM category WHERE title = 'photos' AND user_id = (SELECT id FROM user WHERE name = 'RuRu'))),
('hosts', 'do you like host photos?', 'yes', '', 'google.com', true, (SELECT id FROM category WHERE title = 'photos' AND user_id = (SELECT id FROM user WHERE name = 'RuRu')));