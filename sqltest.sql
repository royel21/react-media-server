SELECT
  `File`.`Id`,
  `File`.`Name`,
  `File`.`Duration`,
  `File`.`FullPath`,
  `File`.`Type`,
  `File`.`Size`,
  `File`.`CreatedAt`,
  `File`.`ViewCount`,
  `File`.`DirectoryId`,
  `File`.`FolderId`,
  REPLACE(Name, '[', '0') AS `N`,
  (
    Select
      LastPos
    from RecentFiles
    where
      FileId == File.Id
      and RecentId == '3gleg'
  ) AS `CurrentPos`,
  (
    Select
      LastRead
    from RecentFiles
    where
      FileId == File.Id
      and RecentId == '3gleg'
  ) AS `LastRead`,
  (
    Select
      FileId
    from FavoriteFiles
    where
      FileId == File.Id
      and FavoriteId IN ('')
  ) AS `isFav`,
  `Folder`.`Id` AS `Folder.Id`,
  `Folder`.`Name` AS `Folder.Name`,
  `Folder`.`CoverPath` AS `Folder.CoverPath`,
  `Folder`.`DirectoryId` AS `Folder.DirectoryId`
FROM `Files` AS `File`
INNER JOIN `Folders` AS `Folder` ON `File`.`FolderId` = `Folder`.`Id`
  AND `Folder`.`Id` = 'u4zfk'
WHERE
  (`File`.`Name` LIKE '%%')
  AND `File`.`Type` LIKE '%%'
ORDER BY
  `N`
LIMIT
  0, '10';