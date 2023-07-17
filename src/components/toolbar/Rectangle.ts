import ResizeSquare from "./ResizeSquare";

export default class Rectangle {
  id: string;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  offset: { x: number; y: number } = { x: 0, y: 0 };
  selected: boolean = false;
  active: boolean = false;
  strokeStyle: string = "gray";
  isParent: boolean;
  resizeSquares: ResizeSquare[] = [];
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    isPatent: boolean = false
  ) {
    this.id = `rect-${Date.now()}`;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isParent = isPatent;
  }

  draw() {
    this.ctx.save();
    this.ctx.strokeStyle = this.strokeStyle;
    // this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.stroke();
    this.resizeSquares = [];
    if (this.active) {
      this.resizeSquares.push(
        new ResizeSquare(this.ctx, this.x - 2.5, this.y - 2.5, 5, 5, this, "tl")
      );
      this.resizeSquares.push(
        new ResizeSquare(
          this.ctx,
          this.x + this.width - 2.5,
          this.y - 2.5,
          5,
          5,
          this,
          "tr"
        )
      );
      this.resizeSquares.push(
        new ResizeSquare(
          this.ctx,
          this.x + this.width - 2.5,
          this.y + this.height - 2.5,
          5,
          5,
          this,
          "br"
        )
      );
      this.resizeSquares.push(
        new ResizeSquare(
          this.ctx,
          this.x - 2.5,
          this.y + this.height - 2.5,
          5,
          5,
          this,
          "bl"
        )
      );
    }
  }

  setSelected(selected: boolean) {
    this.selected = selected;
    if (this.active) return;
    this.selected ? (this.strokeStyle = "green") : (this.strokeStyle = "gray");
  }

  setActive(active: boolean) {
    this.active = active;
    this.strokeStyle = active ? "blue" : "gray";
  }

  clone = () => {
    return new Rectangle(
      this.ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      false
    );
  };
}
