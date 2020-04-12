const db = require("../models");

const getOrderBy = (orderby, isFolder) => {
  let nameOrder = db.sqlze.literal(
    `REPLACE(${isFolder ? "Name" : "File.Name"}, '[','0')`
  );
  let order = [];
  switch (orderby) {
    case "nd": {
      order.push([nameOrder, "DESC"]);
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
      order.push(nameOrder);
    }
  }
  return order;
};

const getFiles = async (user, data, model) => {
  let files = { count: 0, rows: [] };
  let searchs = [];
  let search = data.search || "";

  for (let s of search.split("|")) {
    searchs.push({
      Name: {
        [db.Op.like]: "%" + s + "%",
      },
    });
  }
  user = user
    ? user
    : await db.user.findOne({ where: { Name: "Royel" }, include: db.recent });

  let favs = (await user.getFavorites({ attributes: ["Id", "Name"] })).map(
    (f) => f.dataValues
  );

  let query = {
    attributes: [
      "Id",
      "Name",
      "Type",
      "Duration",
      "Cover",
      "CreatedAt",
      [
        db.sqlze.literal(
          "(Select LastPos from RecentFiles where FileId == File.Id and RecentId == '" +
            user.Recent.Id +
            "')"
        ),
        "CurrentPos",
      ],
      [
        db.sqlze.literal(
          "(Select LastRead from RecentFiles where FileId == File.Id and RecentId == '" +
            user.Recent.Id +
            "')"
        ),
        "LastRead",
      ],
    ],
    order: getOrderBy(data.order),
    offset: (data.page - 1) * data.items,
    limit: data.items,
    where: {
      [db.Op.or]: searchs,
    },
  };
  // by file type manga or video => future audio
  if (data.type)
    query.where.Type = {
      [db.Op.like]: `%${data.type || ""}%`,
    };
  // if we are getting files favorite, if favorite
  if (model !== db.favorite) {
    query.attributes.push([
      db.sqlze.literal(
        "(Select FileId from FavoriteFiles where FileId == File.Id and FavoriteId IN ('" +
          favs.map((i) => i.Id).join("','") +
          "'))"
      ),
      "isFav",
    ]);
  }
  // if we are getting files from a model (favorite or folder-content)
  if (model) {
    query.include = [
      {
        model,
        where: {
          Id: data.id,
        },
      },
    ];
  }

  files = await db.file.findAndCountAll(query);
  files.rows.map((f) => f.dataValues);

  return files;
};

exports.getFilesList = async (user, res, type, params, model) => {
  let data = {};
  try {
    data = await getFiles(user, { type, ...params }, model);
  } catch (err) {
    console.log(err);
  }
  let pagedata = {
    files: data.rows,
    totalFiles: data.count,
    totalPages: Math.ceil(data.count / params.items),
  };
  return res ? res.json(pagedata) : pagedata;
};

exports.getFolders = async (req, res) => {
  const { order, page, items, search } = req.params;

  let result = await db.folder.findAndCountAll({
    where: {
      Name: {
        [db.Op.like]: `%${search || ""}%`,
      },
    },
    order: getOrderBy(order, true),
    offset: (page - 1) * items,
    limit: items,
  });
  return res.json({
    files: result.rows,
    totalFiles: result.count,
    totalPages: Math.ceil(result.count / items),
  });
};

exports.getFolderContent = async (req) => {
  const { id, order, page, items, search } = req.params;

  let result = await db.folder.findAndCountAll({
    where: {
      Id: id,
      Name: {
        [db.Op.like]: `%${search || ""}%`,
      },
    },
    order: [["Name", order === "nu" ? "ASC" : "DESC"]],
    offset: (page - 1) * items,
    limit: items,
  });
  return {
    files: result.rows,
    totalFiles: result.count,
    totalPages: result.count / items,
  };
};
