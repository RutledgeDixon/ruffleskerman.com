USE movie_poll_db;

-- Wipe existing poll data so re-running this script starts clean.
-- Use TRUNCATE for fast resets. Foreign key checks are temporarily disabled
-- so parent/child tables can be truncated in one pass.
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE question;
TRUNCATE TABLE movie;
TRUNCATE TABLE user;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed users for movie poll login.
-- Password for every user is: 31415
-- Bcrypt hash generated from project environment.
INSERT INTO user (name, hashed_password)
VALUES
    ('Allison', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Corbett', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Owen', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Rutledge', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Gideon', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Valor', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Victory', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Garrison', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Haven', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Archer', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W'),
    ('Ruth', '$2b$10$ml6mblfLMsfdjwBeeC5gWuKLIWZqNZh1JkFC4ty3vemOldyNpx00W')
ON DUPLICATE KEY UPDATE hashed_password = VALUES(hashed_password);

-- Movie and question seed data can be added after users are in place.
-- Each movie should get the same set of questions.
-- Question answer values should be numeric rankings (0-10).

-- Insert all movies for every user.
INSERT INTO movie (title, description, progress, user_id)
SELECT
    m.title,
    'Family movie poll',
    0,
    u.id
FROM user u
CROSS JOIN (
    SELECT 'High school musical' AS title
    UNION ALL SELECT 'Oklahoma'
    UNION ALL SELECT 'Sound of music'
    UNION ALL SELECT 'The King and I'
    UNION ALL SELECT 'State Fair'
    UNION ALL SELECT 'Mamma Mia'
    UNION ALL SELECT 'My Fair Lady'
    UNION ALL SELECT 'Singing in the Rain'
    UNION ALL SELECT 'The music man'
    UNION ALL SELECT 'Seven brides for seven brothers'
    UNION ALL SELECT 'Kiss me Kate'
    UNION ALL SELECT 'Meet me in St. Louis'
    UNION ALL SELECT 'Fiddler on the roof'
    UNION ALL SELECT 'West side story'
    UNION ALL SELECT 'The greatest showman'
    UNION ALL SELECT 'Newsies'
    UNION ALL SELECT 'Oliver'
) m;

INSERT INTO question (title, description, answer, checked, movie_id)
SELECT
    'How well-written was the plot?',
    'Rate this from 1 to 10',
    NULL,
    FALSE,
    id
FROM movie;

INSERT INTO question (title, description, answer, checked, movie_id)
SELECT
    'How skillful was the characterization?',
    'Rate this from 1 to 10',
    NULL,
    FALSE,
    id
FROM movie;

INSERT INTO question (title, description, answer, checked, movie_id)
SELECT
    'What was the quality of the music (vocal)?',
    'Rate this from 1 to 10',
    NULL,
    FALSE,
    id
FROM movie;

INSERT INTO question (title, description, answer, checked, movie_id)
SELECT
    'What was the quality of the music (instrumental)?',
    'Rate this from 1 to 10',
    NULL,
    FALSE,
    id
FROM movie;

INSERT INTO question (title, description, answer, checked, movie_id)
SELECT
    'How well did the music integrate with the movie?',
    'Rate this from 1 to 10',
    NULL,
    FALSE,
    id
FROM movie;