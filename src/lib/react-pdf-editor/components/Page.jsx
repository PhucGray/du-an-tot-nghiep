import React, { useEffect, useRef, useState } from "react";

export default ({
  page,
  dimensions,
  updateDimensions,
  setPdfSize,
  pages,
  getPageSizes = () => {},
}) => {
  const canvasRef = useRef();
  const [width, setWidth] = useState((dimensions && dimensions.width) || 0);
  const [height, setHeight] = useState((dimensions && dimensions.height) || 0);
  // const [pageSizes, setPageSizes] = useState([]);

  useEffect(() => {
    const renderPage = async (p) => {
      const _page = await p;
      if (_page) {
        const context = canvasRef.current?.getContext("2d");
        const viewport = _page.getViewport({ scale: 1 });

        setWidth(viewport.width);
        setHeight(viewport.height);
        setPdfSize({ width: viewport.width, height: viewport.height });

        if (context) {
          await _page.render({
            canvasContext: canvasRef.current?.getContext("2d"),
            viewport,
          }).promise;

          const newDimensions = {
            width: viewport.width,
            height: viewport.height,
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
          const viewport = _page.getViewport({ scale: 1 });

          sizes.push({ width: viewport.width, height: viewport.height });

          // setWidth(viewport.width);
          // setHeight(viewport.height);
          // setPdfSize({ width: viewport.width, height: viewport.height });
          // if (context) {
          //   await _page.render({
          //     canvasContext: canvasRef.current?.getContext("2d"),
          //     viewport,
          //   }).promise;
          //   const newDimensions = {
          //     width: viewport.width,
          //     height: viewport.height,
          //   };
          //   updateDimensions(newDimensions);
          // }
        }

        // console.log("vii");
        // console.log(sizes);
        // setPageSizes(sizes)
        getPageSizes(sizes);
      });
      // const _page = await p;
      // if (_page) {
      //   const context = canvasRef.current?.getContext("2d");
      //   const viewport = _page.getViewport({ scale: 1 });

      //   setWidth(viewport.width);
      //   setHeight(viewport.height);
      //   setPdfSize({ width: viewport.width, height: viewport.height });

      //   if (context) {
      //     await _page.render({
      //       canvasContext: canvasRef.current?.getContext("2d"),
      //       viewport,
      //     }).promise;

      //     const newDimensions = {
      //       width: viewport.width,
      //       height: viewport.height,
      //     };

      //     updateDimensions(newDimensions);
      //   }
      // }
    };

    if (pages?.length > 0) renderPages(pages);
  }, [pages]);

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
