// interface Position {
//   top: number;
//   left: number;
// }

export function ggID() {
  let id = 0;
  return function genId() {
    return id++;
  };
}

export const getMovePosition = (
  x,
  y,
  dragX,
  dragY,
  width,
  height,
  pageWidth,
  pageHeight,
) => {
  const newPositionTop = y + dragY;
  const newPositionLeft = x + dragX;
  const newPositionRight = newPositionLeft + width;
  const newPositionBottom = newPositionTop + height;

  const top =
    newPositionTop < 0
      ? 0
      : newPositionBottom > pageHeight
      ? pageHeight - height
      : newPositionTop;
  const left =
    newPositionLeft < 0
      ? 0
      : newPositionRight > pageWidth
      ? pageWidth - width
      : newPositionLeft;

  return {
    top,
    left,
  };
};

export const normalize = (value) => parseFloat((value / 255).toFixed(1));
