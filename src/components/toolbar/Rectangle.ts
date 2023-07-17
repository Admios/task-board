export default class Rectangle {
  id: string;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  offset: { x: number; y: number } = { x: 0, y: 0 };
  selected: boolean = false;
  strokeStyle: string = "gray";
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.id = `rect-${Date.now()}`;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    this.ctx.save();
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.stroke();
    this.ctx.restore();
  }

  setSelected(selected: boolean) {
    this.selected = selected;
    this.selected ? (this.strokeStyle = "green") : (this.strokeStyle = "gray");
  }
}
