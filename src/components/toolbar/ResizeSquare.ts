import Rectangle from "./Rectangle";

type Pos = "tl" | "tr" | "bl" | "br";
export default class ResizeSquare {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  parent: Rectangle;
  pos: Pos;
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    parent: Rectangle,
    pos: Pos
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.parent = parent;
    this.pos = pos;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.closePath();
  }
}
