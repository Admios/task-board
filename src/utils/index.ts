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
  rectH: number,
  buffer: number = 0
) => {
  const xLine = mouseX > rectX - buffer && mouseX < rectX + rectW + buffer;
  const yLine = mouseY > rectY - buffer && mouseY < rectY + rectH + buffer;

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
