import React, { useState } from "react";
import Files from "./Files";

const FileList = ({ mData, loadFiles }) => {
  const [page, setPage] = useState(1);
  let totalPages = mData.totalFilePages;

  const goToPage = (pg) => {
    console.log(pg);
    pg = pg < 1 ? 1 : pg > totalPages ? totalPages : pg;
    setPage(pg);
    loadFiles(pg);
    return pg;
  };

  const handleClick = () => {};

  console.log("render Files");

  return (
    <Files
      title="Folders"
      data={mData}
      goToPage={goToPage}
      page={page}
      handleClick={handleClick}
    />
  );
};

export default React.memo(FileList);
