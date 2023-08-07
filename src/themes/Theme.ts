export default interface Theme {
  TOTAL_FRAMES: number;

  prepare?(): Promise<void>;

  draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    frame_number: number
  );
}
