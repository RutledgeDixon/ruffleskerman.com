--insert user--
INSERT INTO user (name, password) VALUES
('RuRu', 'securepassword123');

--insert categories (assumes user id is 1)--
INSERT INTO category (title, descriptionk, progress, user_name) VALUES
('food', 'do you like food?', 0, 'RuRu'),
('photos', 'do you like photos?', 0, 'RuRu');

--insert cards--
INSERT INTO card (title, description, answer, imageurl,  url, checked, category_title) VALUES
('chocolate', 'do you like chocolate?', 'yes', '/images/chocolate.jpg', '', false, 'food'),
('vanilla', 'do you like vanilla?', '', '', '', false, 'food'),
('guests', 'do you like guest photos?', 'no', '', '', false, 'photos'),
('hosts', 'do you like host photos?', 'yes', '', 'google.com', true, 'photos');