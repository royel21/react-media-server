const db = require("../models");

const getOrderBy = orderby => {
  let order = [];
  switch (orderby) {
    case "nd": {
      order.push([db.sqlze.col("N"), "DESC"]);
      break;
    }
    case "du": {
      order.push(["CreatedAt", "DESC"]);
      break;
    }
    case "dd": {
      order.push(["CreatedAt", "ASC"]);
      break;
    }
    default: {
      order.push(db.sqlze.col("N"));
    }
  }
  return order;
};

exports.getFiles = async (user, data, model) => {
  let files = { count: 0, rows: [] };
  let searchs = [];
  let search = data.search || "";

  for (let s of search.split("|")) {
    searchs.push({
      Name: {
        [db.Op.like]: "%" + s + "%"
      }
    });
  }
  let favs = (await user.getFavorites()).map(i => i.Id);

  let query = {
    attributes: {
      include: [
        [db.sqlze.literal("REPLACE(`File`.`Name`, '[','0')"), "N"],
        [
          db.sqlze.literal(
            "(Select LastPos from RecentFiles where FileId == File.Id and RecentId == '" +
              user.Recent.Id +
              "')"
          ),
          "CurrentPos"
        ],
        [
          db.sqlze.literal(
            "(Select LastRead from RecentFiles where FileId == File.Id and RecentId == '" +
              user.Recent.Id +
              "')"
          ),
          "LastRead"
        ]
      ]
    },
    order: getOrderBy(data.order),
    offset: (data.page - 1) * data.itemsperpage,
    limit: data.itemsperpage,
    where: {
      [db.Op.or]: searchs
    }
  };
  if (data.type !== "Any")
    query.where.Type = {
      [db.Op.like]: `%${data.type || ""}%`
    };

  if (model) {
    query.include = [
      {
        model,
        where: {
          Id: data.id
        }
      }
    ];
  }

  if (model !== db.favorite)
    query.attributes.include.push([
      db.sqlze.literal(
        "(Select FileId from FavoriteFiles where FileId == File.Id and FavoriteId IN ('" +
          favs.join("','") +
          "'))"
      ),
      "isFav"
    ]);

  files = await db.file.findAndCountAll(query);
  files.rows.map(f => f.dataValues);
  return files;
};

exports.getFolders = async req => {
  const { order, page, itemsperpage, search } = req.params;

  let result = await db.folder.findAndCountAll({
    where: {
      Name: {
        [db.Op.like]: `%${search || ""}%`
      }
    },
    order: [["Name", order === "nu" ? "ASC" : "DESC"]],
    offset: (page - 1) * itemsperpage,
    limit: itemsperpage
  });
  return {
    files: result.rows,
    totalFiles: result.count,
    totalPages: Math.ceil(result.count / itemsperpage)
  };
};

exports.getFolderContent = async req => {
  const { id, order, page, itemsperpage, search } = req.params;

  let result = await db.folder.findAndCountAll({
    where: {
      Id: id,
      Name: {
        [db.Op.like]: `%${search || ""}%`
      }
    },
    order: [["Name", order === "nu" ? "ASC" : "DESC"]],
    offset: (page - 1) * itemsperpage,
    limit: itemsperpage
  });
  return {
    files: result.rows,
    totalFiles: result.count,
    totalPages: result.count / itemsperpage
  };
};
