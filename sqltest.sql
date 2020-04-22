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
-- SELECT
--   *
-- From Files
-- WHERE
--   FolderId = "2tnh5"
-- DELETE FROM Folders
-- WHERE
--   Id = 'fqawc';
-- SELECT
--   Name,
--   Duration
-- from Files
-- Where
--   Duration = 0;
-- SQLite
SELECT
  `Folders`.`Id`,
  `Folders`.`Type`,
  `Folders`.`Name`,
  `Folders`.`Cover`,
  `Folders`.`CreatedAt`,
  `Folders`.`FileCount`,
  `Folders`.`DirectoryId`,
  `Files`.`Id` AS `Files.Id`,
  `Files`.`Name` AS `Files.Name`,
  `Files`.`Type` AS `Files.Type`,
  `Files`.`Duration` AS `Files.Duration`,
  `Files`.`Cover` AS `Files.Cover`,
  `Files`.`FolderId` AS `Files.FolderId`,
  `Files`.`ViewCount` AS `Files.ViewCount`,
  IFNULL(
    (
      Select
        LastPos
      from RecentFiles
      where
        FileId == Files.Id
        and RecentId == 'sftsa'
    ),
    0
  ) AS `Files.CurrentPos`
FROM `Folders` AS `Folders`
LEFT OUTER JOIN `Files` AS `Files` ON `Folders`.`Id` = `Files`.`FolderId`
WHERE
  `Folders`.`Id` = 'xcrjb'
ORDER BY
  REPLACE(`Files`.`Name`, '[', '0');