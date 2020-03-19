const db = require("./models");

db.user
  .findOne({
    where: {
      Name: "Royel"
    },
    include: [
      { model: db.userConfig },
      { model: db.recent },
      {
        model: db.favorite,
        order: [db.sqlze.literal("LOWER(Favorites.Name)")],
        attributes: ["Id", "Name", "Type"]
      }
    ]
  })
  .then(files => {
    console.log(files);
  });
