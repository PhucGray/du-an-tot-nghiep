import React, { useEffect, useRef, useState } from "react";
import { API_DOMAIN } from "../../../configs/api";

export default ({
  page,
  dimensions,
  updateDimensions,
  setPdfSize,
  pages,
  getPageSizes = () => {},
  listImg,
  pageIndex,
  isKiThat
}) => {
  const canvasRef = useRef();
  const [width, setWidth] = useState((dimensions && dimensions.width) || 0);
  const [height, setHeight] = useState((dimensions && dimensions.height) || 0);
  // const [pageSizes, setPageSizes] = useState([]);
  const iiii = 1

  useEffect(() => {
    const renderPage = async (p) => {
      const _page = await p;
      if (_page) {
        const context = canvasRef.current?.getContext("2d");
        const viewport = _page.getViewport({ scale: 1.388888889 });

        setWidth(viewport.width * iiii);
        setHeight(viewport.height * iiii);
        setPdfSize({ width: viewport.width*iiii, height: viewport.height*iiii });

        if (context) {
          await _page.render({
            canvasContext: canvasRef.current?.getContext("2d"),
            viewport,
          }).promise;

          const newDimensions = {
            width: viewport.width * iiii,
            height: viewport.height * iiii,
          };

          updateDimensions(newDimensions);
        }
      }
    };

    renderPage(page);
  }, [page, updateDimensions]);

  useEffect(() => {
    const renderPages = async (pages) => {
      let sizes = [];
      pages.forEach(async (p) => {
        const _page = await p;

        if (_page) {
          const context = canvasRef.current?.getContext("2d");
          const viewport = _page.getViewport({ scale: 1.388888889 });

          sizes.push({ width: viewport.width* iiii, height: viewport.height * iiii});
        }
        getPageSizes(sizes);
      });
    };

    if (pages?.length > 0) renderPages(pages);
  }, [pages]);

  return (
    <div style={{position: 'relative'}}>
     {listImg?.length > 0 && isKiThat && <div
        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
      >
        <img 
          // src='https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=640:*'
          src={API_DOMAIN + '/' + listImg?.[pageIndex]}
          style={{
            height: '100%',
            width: '100%',
            opacity: 1
          }}
        />
      </div>}
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
