export const scrollInView = (num, cb) => {
  let currentimg = document.querySelectorAll(".img-current img")[num];
  if (currentimg) {
    currentimg.scrollIntoView();
  }
  if (cb) cb();
  console.log("scrollto:", num);
};

export const webtoonLoader = (
  observer,
  size,
  pageRef,
  divRef,
  loadImages,
  setPageData,
  contentRef
) => {
  let imgs = document.querySelectorAll(".img-current img");
  if (!observer.current) {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries.length < imgs.length) {
          let pg;
          let dir;
          for (let entry of entries) {
            if (entry.isIntersecting) {
              pg = parseInt(entry.target.id);
              console.log(pg, pageRef.current.pos);
              if (pg < pageRef.current.pos) {
                pageRef.current.pos = pg + 1;
                dir = -5;
              } else {
                pageRef.current.pos = pg - 1;
                dir = 5;
              }
            }
          }
          if (pg) {
            setPageData({ page: pageRef.current.pos });
            console.log("load:", pg, dir, size);
            if (pg < size && pg > 0 && !contentRef.current[pg + dir]) {
              loadImages(pg + dir, 5, dir);
            }
          }
          console.log("intersect", pg, pageRef.current.pos);
        }
      },
      {
        root: divRef.current,
        rootMargin: window.innerHeight * 2 + "px",
        threshold: 0,
      }
    );
  }
  imgs.forEach((lazyImg) => {
    observer.current.observe(lazyImg);
  });
};
