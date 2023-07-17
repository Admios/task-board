import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import Rectangle from "../components/toolbar/Rectangle";
import { cursorInRect, mouseCoords, offsetCoords } from "../utils";

type DrawElement = {
  [key: string]: (ctx: CanvasRenderingContext2D) => void;
};

const CanvasContext = createContext<{
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  rectangles: Rectangle[];
  addRectangle: (rect: Rectangle) => void;
  drawElement: DrawElement[];
  addDrawElement: (el: DrawElement) => void;
}>({
  ctx: null,
  canvas: null,
  canvasRef: null,
  rectangles: [],
  addRectangle: () => {},
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
  const rectangles: Rectangle[] = [];

  const addRectangle = (rect: Rectangle) => {
    rectangles.push(rect);
  };
  const drawElement: DrawElement[] = useMemo(() => [], []);

  const addDrawElement = (el: DrawElement) => {
    drawElement.push(el);
  };

  const mouseMoveHandler = () => {
    if (!canvas) return;
    canvas.addEventListener("mousemove", (e) => {
      const mouse = mouseCoords(canvas, e);
      const rectArr = rectangles.map((e) => {
        return cursorInRect(mouse.x, mouse.y, e.x, e.y, e.width, e.height);
      });
      !rectArr.every((e) => e === false)
        ? canvas.classList.add("pointer")
        : canvas.classList.remove("pointer");
      rectangles.forEach((e) => {
        if (e.selected) {
          e.x = mouse.x - e.offset.x;
          e.y = mouse.y - e.offset.y;
        }
      });
    });
  };

  const mouseDownHandler = () => {
    if (!canvas) return;
    canvas.addEventListener("mousedown", (e) => {
      const mouse = mouseCoords(canvas, e);
      rectangles.forEach((e) => {
        if (cursorInRect(mouse.x, mouse.y, e.x, e.y, e.width, e.height)) {
          e.setSelected(true);
          e.offset = offsetCoords(mouse, e);
        } else {
          e.setSelected(false);
        }
      });
    });
  };

  const mouseUpHandler = () => {
    if (!canvas) return;
    canvas.addEventListener("mouseup", (e) => {
      rectangles.forEach((e) => {
        e.setSelected(false);
      });
    });
  };

  const addHandlers = () => {
    mouseMoveHandler();
    mouseDownHandler();
    mouseUpHandler();
  };

  useEffect(() => {
    addHandlers();
  }, [canvas]);

  useEffect(() => {
    const _canvas = canvasRef.current;
    if (!_canvas) return;
    setCanvas(_canvas);
    const context = _canvas.getContext("2d");
    if (!context) return;
    setCtx(context);
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
  }, []);

  function animate() {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "white";
      drawElement.forEach((el) => {
        const key = Object.keys(el)[0];
        el[key](ctx);
      });
      rectangles.forEach((e) => {
        e.draw();
      });
      window.requestAnimationFrame(animate);
    }
  }

  animate();

  return (
    <CanvasContext.Provider
      value={{
        ctx,
        canvasRef,
        canvas,
        rectangles,
        addRectangle,
        drawElement,
        addDrawElement,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
