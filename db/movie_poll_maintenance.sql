USE movie_poll_db;

-- Movie Poll Maintenance Helpers
-- Run only the section you need.
-- These statements do NOT wipe existing data.

-- ==========================================
-- 1) Delete a movie for every user
-- ==========================================
-- IMPORTANT: replace this placeholder before running.
SET @movie_title_to_delete = 'Movie Title';

-- Preview how many movie rows will be deleted.
SELECT COUNT(*) AS matching_movies
FROM movie
WHERE TRIM(title) = TRIM(@movie_title_to_delete);

-- Delete movie rows for all users.
-- related question rows are removed automatically by ON DELETE CASCADE.
DELETE FROM movie
WHERE TRIM(title) = TRIM(@movie_title_to_delete);

-- Verify movie title is gone.
SELECT COUNT(*) AS remaining_movies
FROM movie
WHERE TRIM(title) = TRIM(@movie_title_to_delete);


-- ==========================================
-- 2) Rename a movie title for one user
-- ==========================================
SET @target_user_name = 'Allison';
SET @old_title = 'Old Movie Title';
SET @new_title = 'New Movie Title';

UPDATE movie m
JOIN user u ON u.id = m.user_id
SET m.title = @new_title
WHERE u.name = @target_user_name
  AND m.title = @old_title;


-- ==========================================
-- 3) Add a new movie for every user
--    (safe against duplicates)
-- ==========================================
SET @new_movie_title = 'New Movie Title';
SET @new_movie_description = 'Family movie poll';

INSERT INTO movie (title, description, progress, user_id)
SELECT
    @new_movie_title,
    @new_movie_description,
    0,
    u.id
FROM user u
WHERE NOT EXISTS (
    SELECT 1
    FROM movie m
    WHERE m.user_id = u.id
      AND m.title = @new_movie_title
);


-- ==========================================
-- 4) Add a new movie for one user
--    (safe against duplicates)
-- ==========================================
SET @target_user_name = 'Allison';
SET @new_movie_title = 'New Movie Title';
SET @new_movie_description = 'Family movie poll';

INSERT INTO movie (title, description, progress, user_id)
SELECT
    @new_movie_title,
    @new_movie_description,
    0,
    u.id
FROM user u
WHERE u.name = @target_user_name
  AND NOT EXISTS (
      SELECT 1
      FROM movie m
      WHERE m.user_id = u.id
        AND m.title = @new_movie_title
  );


-- ==========================================
-- 5) Clone questions from an existing template movie
--    into a newly added movie for every user
-- ==========================================
SET @template_movie_title = 'High school musical';
SET @new_movie_title = 'New Movie Title';

INSERT INTO question (title, description, answer, checked, movie_id)
SELECT
    q.title,
    q.description,
    NULL,
    FALSE,
    nm.id
FROM movie nm
JOIN user u ON u.id = nm.user_id
JOIN movie tm
    ON tm.user_id = u.id
   AND tm.title = @template_movie_title
JOIN question q ON q.movie_id = tm.id
LEFT JOIN question existing
    ON existing.movie_id = nm.id
   AND existing.title = q.title
WHERE nm.title = @new_movie_title
  AND existing.id IS NULL;


-- ==========================================
-- 6) Clone questions for one user only
-- ==========================================
SET @target_user_name = 'Allison';
SET @template_movie_title = 'High school musical';
SET @new_movie_title = 'New Movie Title';

INSERT INTO question (title, description, answer, checked, movie_id)
SELECT
    q.title,
    q.description,
    NULL,
    FALSE,
    nm.id
FROM movie nm
JOIN user u ON u.id = nm.user_id
JOIN movie tm
    ON tm.user_id = u.id
   AND tm.title = @template_movie_title
JOIN question q ON q.movie_id = tm.id
LEFT JOIN question existing
    ON existing.movie_id = nm.id
   AND existing.title = q.title
WHERE u.name = @target_user_name
  AND nm.title = @new_movie_title
  AND existing.id IS NULL;


-- ==========================================
-- 7) Add all questions to a movie by title (every user)
-- ==========================================
-- Copies all questions from template movie title to target movie title,
-- inserting only missing question titles.
SET @template_movie_title = 'High school musical';
SET @target_movie_title = 'New Movie Title';

INSERT INTO question (title, description, answer, checked, movie_id)
SELECT
    q.title,
    q.description,
    NULL,
    FALSE,
    target_movie.id
FROM movie target_movie
JOIN user u ON u.id = target_movie.user_id
JOIN movie template_movie
    ON template_movie.user_id = u.id
   AND template_movie.title = @template_movie_title
JOIN question q ON q.movie_id = template_movie.id
LEFT JOIN question existing
    ON existing.movie_id = target_movie.id
   AND existing.title = q.title
WHERE target_movie.title = @target_movie_title
  AND existing.id IS NULL;


-- ==========================================
-- 8) Add all questions to a movie by title (one user)
-- ==========================================
SET @target_user_name = 'Allison';
SET @template_movie_title = 'High school musical';
SET @target_movie_title = 'New Movie Title';

INSERT INTO question (title, description, answer, checked, movie_id)
SELECT
    q.title,
    q.description,
    NULL,
    FALSE,
    target_movie.id
FROM movie target_movie
JOIN user u ON u.id = target_movie.user_id
JOIN movie template_movie
    ON template_movie.user_id = u.id
   AND template_movie.title = @template_movie_title
JOIN question q ON q.movie_id = template_movie.id
LEFT JOIN question existing
    ON existing.movie_id = target_movie.id
   AND existing.title = q.title
WHERE u.name = @target_user_name
  AND target_movie.title = @target_movie_title
  AND existing.id IS NULL;


-- ==========================================
-- 9) Quick verification
-- ==========================================
-- List movie counts per user
SELECT u.name, COUNT(*) AS movie_count
FROM user u
LEFT JOIN movie m ON m.user_id = u.id
GROUP BY u.id, u.name
ORDER BY u.name;

-- List movies per user alphabetically
SELECT u.name, m.title
FROM movie m
JOIN user u ON u.id = m.user_id
ORDER BY u.name, m.title;
