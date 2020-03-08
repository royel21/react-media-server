import axios from "axios";

const loadFiles = async (page, order, type) => {
  let input = document.getElementById("filter-file");

  let filter = input && input.value;

  let itemsperpage = Math.floor(window.innerWidth / 200) * 3;

  let res = await axios.get(
    `/api/get${type}/${order}/${page || 1}/${itemsperpage}/${filter || ""}`
  );
  return res.data;
};

export { loadFiles };
