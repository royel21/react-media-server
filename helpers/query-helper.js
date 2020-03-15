const db = require("../models");

const getOrderBy = orderby => {
  let order = [];
  switch (orderby) {
    case "nd": {
      order.push([db.sqlze.literal("REPLACE(Name, '[','0')"), "DESC"]);
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
      order.push(db.sqlze.literal("REPLACE(Name, '[','0')"));
    }
  }
  return order;
};

exports.getFiles = async (user, data, model) => {
  console.time("test");
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
    raw: true,
    attributes: [
      "Id",
      "Name",
      "Type",
      "Duration",
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
    ],
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

  if (model !== db.favorite) {
    query.attributes.push([
      db.sqlze.literal(
        "(Select FileId from FavoriteFiles where FileId == File.Id and FavoriteId IN ('" +
          favs.join("','") +
          "'))"
      ),
      "isFav"
    ]);
  }
  console.time("test");
  files = await db.file.findAndCountAll(query);
  console.log(files.rows);
  files.rows.map(f => f.dataValues);
  console.timeEnd("test");
  return files;
};

exports.getFolders = async (req, res) => {
  console.time("start");
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
  console.timeEnd("start");
  return res.json({
    files: result.rows,
    totalFiles: result.count,
    totalPages: Math.ceil(result.count / itemsperpage)
  });
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
