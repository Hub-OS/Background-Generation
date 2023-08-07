import drawGrid from "../pieces/drawGrid";
import drawSky from "../pieces/drawSky";
import drawCityScape from "../pieces/drawCityScape";
import Theme from "./Theme";
import { HORIZON_Y } from "../sharedConstants";

const LINE_COLOR = "#D84080";
const BUILDING_FILL_STYLE = "#1B2348";
const skyImage = new Image();

export default class implements Theme {
  TOTAL_FRAMES = 24;

  async prepare() {
    const url = new URL("../../sky.png", import.meta.url);
    skyImage.src = url.toString();
    console.log(skyImage.src);

    await new Promise((resolve) => {
      skyImage.onload = resolve;
    });
  }

  draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    frame_number: number
  ) {
    const skyPattern = ctx.createPattern(skyImage, null)!;

    ctx.fillStyle = skyPattern;
    ctx.strokeStyle = LINE_COLOR;
    drawGrid(canvas, ctx, frame_number);
    drawSky(canvas, ctx);

    // drawDaySun(canvas, ctx);

    ctx.fillStyle = BUILDING_FILL_STYLE;
    drawCityScape(ctx);
  }
}

function drawDaySun(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const SUN_RADIUS = 36;
  const SUN_X = canvas.width / 2;
  const SUN_Y = HORIZON_Y - SUN_RADIUS * 2;

  ctx.fillStyle = "WHITE";
  ctx.beginPath();
  ctx.arc(SUN_X, SUN_Y, SUN_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}
