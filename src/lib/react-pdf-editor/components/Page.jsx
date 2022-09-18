import React, { useEffect, useRef, useState } from "react";

// interface Props {
//   page: any;
//   dimensions?: Dimensions;
//   updateDimensions: ({ width, height }: Dimensions) => void;
// }

export default ({ page, dimensions, updateDimensions }) => {
  const canvasRef = useRef();
  const [width, setWidth] = useState((dimensions && dimensions.width) || 0);
  const [height, setHeight] = useState((dimensions && dimensions.height) || 0);

  useEffect(() => {
    const renderPage = async (p) => {
      const _page = await p;
      if (_page) {
        const context = canvasRef.current?.getContext("2d");
        const viewport = _page.getViewport({ scale: 1 });

        setWidth(viewport.width);
        setHeight(viewport.height);

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

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
