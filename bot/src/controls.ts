import { DCController } from "./dc";


export const setMultiAxesDCPower = (
  controls: DCController,
  forwardAxis: number,
  backwardAxis: number,
) => {
  if (backwardAxis > 0) {
    controls.setPower(backwardAxis, -1);
  } else {
    controls.setPower(forwardAxis, 1);
  }
};
