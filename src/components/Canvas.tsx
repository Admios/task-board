import React from "react";
import { useCanvas } from "../hooks/useCanvas";

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
  options?: {};
}

const Canvas = (props: CanvasProps) => {
  const { draw, ...rest } = props;
  const { canvasRef } = useCanvas();

  return (
    <canvas
      ref={canvasRef}
      {...rest}
      width={"100%"}
      height={"calc(100% - 5px)"}
    />
  );
};

export default Canvas;
