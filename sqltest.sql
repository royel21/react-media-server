-- DELETE from Favorites
-- where
--   Id = 'abck';
-- SQLite
--- Update Isloading Query
-- UPDATE Directories
-- set
--   IsLoading = 0
-- Where
--   IsLoading = 1;
------
---Find duplicate
-- Select
--   Id
-- from Files
-- where
--   Id in (
--     select
--       folderId
--     from (
--         SELECT
--           count(*) count,
--           *
--         From Files
--         GROUP by
--           Name
--       )
--     where
--       count > 1
--   );
SELECT
  *
From Files
WHERE
  FolderId = "2tnh5"