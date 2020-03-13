import axios from "axios";

const loadFiles = async (page, order, filter, type) => {
  let itemsperpage = Math.floor(window.innerWidth / 200) * 3;

  let res = await axios.get(
    `/api/files/${type}/${order || "nu"}/${page ||
      1}/${itemsperpage}/${filter || ""}`
  );
  return res.data;
};

export { loadFiles };
