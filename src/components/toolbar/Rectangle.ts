export default class Rectangle {
  id: string;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  offset: { x: number; y: number } = { x: 0, y: 0 };
  selected: boolean = false;
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
    // this.ctx.beginPath();
    // this.ctx.moveTo(this.x, this.y);
    // this.ctx.lineTo(0, this.y);
    // this.ctx.moveTo(this.x, this.y);
    // this.ctx.lineTo(this.x, 0);
    // this.ctx.moveTo(this.x, this.y);
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.stroke();
    this.ctx.restore();
  }

  setSelected(selected: boolean) {
    this.selected = selected;
    this.selected
      ? (this.ctx.strokeStyle = "green")
      : (this.ctx.strokeStyle = "gray");
    this.draw();
  }
}
