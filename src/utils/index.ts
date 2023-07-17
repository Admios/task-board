export const mouseCoords = (canvas: HTMLCanvasElement, event: MouseEvent) => {
  const canvasCoords = canvas.getBoundingClientRect();
  return {
    x: event.pageX - canvasCoords.left,
    y: event.pageY - canvasCoords.top,
  };
};

export const cursorInRect = (
  mouseX: number,
  mouseY: number,
  rectX: number,
  rectY: number,
  rectW: number,
  rectH: number
) => {
  const xLine = mouseX > rectX && mouseX < rectX + rectW;
  const yLine = mouseY > rectY && mouseY < rectY + rectH;

  return xLine && yLine;
};

export const offsetCoords = (
  mouse: {
    x: number;
    y: number;
  },
  rect: {
    x: number;
    y: number;
  }
) => {
  return {
    x: mouse.x - rect.x,
    y: mouse.y - rect.y,
  };
};
