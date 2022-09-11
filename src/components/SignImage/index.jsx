import React, { Fragment, useEffect, useState, useRef } from "react";

import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";

const SignImage = ({ url, isSelected, onClick = () => {} }) => {
  const transformRef = useRef();
  const imageRef = useRef();
  const [img] = useImage(url);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isSelected) {
      transformRef.current.nodes([imageRef.current]);
      transformRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <Fragment>
      <Image
        onClick={onClick}
        ref={imageRef}
        stroke={isDragging ? "#22e72b" : "transparent"}
        strokeWidth={5}
        image={img}
        x={position.x}
        y={position.y}
        draggable={true}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e) => {
          setIsDragging(false);
          setPosition({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(scaleX);
          node.scaleY(scaleY);

          const newWidth = Math.max(5, node.width() * scaleX);
          const newHeight = Math.max(node.height() * scaleY);
        }}
      />

      {isSelected && (
        <Transformer
          ref={transformRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Fragment>
  );
};

export default SignImage;
