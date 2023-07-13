import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

const CanvasContext = createContext<{
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  setSquares: Dispatch<SetStateAction<any[]>>;
  squares: any[];
}>({
  ctx: null,
  canvas: null,
  canvasRef: null,
  setSquares: () => {},
  squares: [],
});

export const useCanvas = () => useContext(CanvasContext);

export const CanvasContextProvider = ({
  children,
  draw,
}: {
  children: React.ReactNode;
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [squares, setSquares] = useState<any[]>([]);

  useEffect(() => {
    const _canvas = canvasRef.current;
    if (!_canvas) return;
    setCanvas(canvas);
    const context = _canvas.getContext("2d");
    if (!context) return;
    setCtx(context);
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;

    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return (
    <CanvasContext.Provider
      value={{ ctx, canvasRef, canvas, squares, setSquares }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
