import { DCController } from "./dc";


export const setMultiAxesDCPower = (
  controls: DCController,
  forwardAxes: number,
  backwardAxes: number,
) => {
  if (backwardAxes > 0) {
    controls.setPower(backwardAxes, -1);
  } else {
    controls.setPower(forwardAxes, 1);
  }
};
