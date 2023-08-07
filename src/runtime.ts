import Theme from "./themes/Theme";

const FRAMES_PER_FRAME = 2;

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
    theme.prepare().then(() => loop(theme));
    return;
  }

  if (real_frames % FRAMES_PER_FRAME != 0) {
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

  if (i == 0) {
    outputCanvas.width = cols * canvas.width;
    outputCanvas.height = rows * canvas.height;
  }

  const col = i % cols;
  const row = Math.floor(i / rows);
  const x = col * 240;
  const y = row * 160;

  outputCtx.drawImage(canvas, x, y);
  animationLines.push(
    `frame duration="${FRAMES_PER_FRAME}f" x="${x}" y="${y}" w="240" h="160"`
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
