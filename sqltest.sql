SELECT
  `File`.*,
  `Favorites`.`Id` AS `Favorites.Id`,
  `Favorites`.`Name` AS `Favorites.Name`,
  `Favorites`.`UserId` AS `Favorites.UserId`,
  `Favorites->FavoriteFile`.`Id` AS `Favorites.FavoriteFile.Id`,
  `Favorites->FavoriteFile`.`FavoriteId` AS `Favorites.FavoriteFile.FavoriteId`,
  `Favorites->FavoriteFile`.`FileId` AS `Favorites.FavoriteFile.FileId`
FROM (
    SELECT
      `File`.`Id`,
      `File`.`Name`,
      `File`.`Type`,
      `File`.`Duration`,
      (
        Select
          LastPos
        from RecentFiles
        where
          FileId == File.Id
          and RecentId == 'pjwhn'
      ) AS `CurrentPos`,
      (
        Select
          LastRead
        from RecentFiles
        where
          FileId == File.Id
          and RecentId == 'pjwhn'
      ) AS `LastRead`
    FROM `Files` AS `File`
    WHERE
      (`File`.`Name` LIKE '%%')
      AND (
        SELECT
          `FavoriteFile`.`Id`
        FROM `FavoriteFiles` AS `FavoriteFile`
        INNER JOIN `Favorites` AS `Favorite` ON `FavoriteFile`.`FavoriteId` = `Favorite`.`Id`
          AND (
            `Favorite`.`Id` = '0w1sk'
            OR `Favorite`.`Name` = '0w1sk'
          )
        WHERE
          (`File`.`Id` = `FavoriteFile`.`FileId`)
        LIMIT
          1
      ) IS NOT NULL
    ORDER BY
      REPLACE(File.Name, '[', '0')
    LIMIT
      0, '12'
  ) AS `File`
INNER JOIN `FavoriteFiles` AS `Favorites->FavoriteFile` ON `File`.`Id` = `Favorites->FavoriteFile`.`FileId`
INNER JOIN `Favorites` AS `Favorites` ON `Favorites`.`Id` = `Favorites->FavoriteFile`.`FavoriteId`
  AND (
    `Favorites`.`Id` = '0w1sk'
    OR `Favorites`.`Name` = '0w1sk'
  )
ORDER BY
  REPLACE(File.Name, '[', '0');