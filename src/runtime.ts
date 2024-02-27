import Theme from "./themes/Theme";

let frame_number = 0;
let rendered_frames = 0;
let real_frames = 0;
const animationLines = ['animation state="DEFAULT"'];
const outputCanvas = document.createElement("canvas");
const outputCtx = outputCanvas.getContext("2d")!;
const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

export default function loop(theme: Theme) {
  real_frames += 1;

  if (real_frames == 1 && theme.prepare) {
    theme.prepare(canvas, ctx).then(() => loop(theme));
    return;
  }

  if (real_frames % theme.FRAME_DURATION != 0) {
    requestAnimationFrame(() => loop(theme));
    return;
  }

  theme.draw(canvas, ctx, frame_number);

  frame_number += 1;

  if (rendered_frames < theme.TOTAL_FRAMES) {
    copyToOutput(theme, rendered_frames);
    rendered_frames += 1;

    if (rendered_frames == theme.TOTAL_FRAMES) {
      enableDownload();
    }
  }

  requestAnimationFrame(() => loop(theme));
}

function copyToOutput(theme: Theme, i: number) {
  const cols = Math.ceil(Math.sqrt(theme.TOTAL_FRAMES));
  const rows = Math.ceil(theme.TOTAL_FRAMES / cols);

  const w = canvas.width;
  const h = canvas.height;

  if (i == 0) {
    outputCanvas.width = cols * w;
    outputCanvas.height = rows * h;
  }

  const col = i % cols;
  const row = Math.floor(i / rows);
  const x = col * w;
  const y = row * h;

  outputCtx.drawImage(canvas, x, y);
  animationLines.push(
    `frame duration="${theme.FRAME_DURATION}f" x="${x}" y="${y}" w="${w}" h="${h}"`
  );
}

function enableDownload() {
  const downloadButton = document.getElementById(
    "download-button"
  )! as HTMLButtonElement;
  const downloadLink = document.getElementById(
    "download-link"
  )! as HTMLAnchorElement;

  downloadButton.disabled = false;
  downloadLink.href = outputCanvas.toDataURL("image/png");
  downloadLink.download = "bg.png";

  document.getElementById("animation-output")!.innerHTML =
    animationLines.join("\n");
}
