import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

type DrawElement = {
  [key: string]: (ctx: CanvasRenderingContext2D) => void;
};

const CanvasContext = createContext<{
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  setSquares: Dispatch<SetStateAction<any[]>>;
  squares: any[];
  drawElement: DrawElement[];
  addDrawElement: (el: DrawElement) => void;
}>({
  ctx: null,
  canvas: null,
  canvasRef: null,
  setSquares: () => {},
  squares: [],
  drawElement: [],
  addDrawElement: () => {},
});

export const useCanvas = () => useContext(CanvasContext);

export const CanvasContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [squares, setSquares] = useState<any[]>([]);
  const [drawElement, setDrawElement] = useState<DrawElement[]>([]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, els: DrawElement[]) => {
      if (els.length === 0) return;
      els.forEach((el) => {
        const key = Object.keys(el)[0];
        el[key](ctx);
      });
    },
    []
  );

  useEffect(() => {
    const _canvas = canvasRef.current;
    if (!_canvas) return;
    setCanvas(_canvas);
    const context = _canvas.getContext("2d");
    if (!context) return;
    setCtx(context);
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
    draw(context, drawElement);
  }, [draw, drawElement]);

  const addDrawElement = (el: DrawElement) => {
    setDrawElement((prev) => [...prev, el]);
  };

  return (
    <CanvasContext.Provider
      value={{
        ctx,
        canvasRef,
        canvas,
        squares,
        setSquares,
        drawElement,
        addDrawElement,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
